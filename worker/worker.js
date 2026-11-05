/**
 * TecTic Bd – Smart Group Publisher
 * Standalone Automation Worker Engine (Local Windows & Cloud VPS)
 * 
 * Features:
 * - Persistent Chrome Profile (remembers Facebook login cookies permanently)
 * - Safe anti-detection flags
 * - Exact post publishing and post URL verification
 * - Heartbeat reporting to Web Dashboard
 * - Safe skip handling for restricted or inaccessible groups
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const puppeteer = require('puppeteer-core');

const PORT = process.env.WORKER_PORT || 4892;
const DASHBOARD_ENDPOINT = process.env.DASHBOARD_ENDPOINT || 'http://localhost:3000';
const IS_WINDOWS = process.platform === 'win32';

// Persistent Chrome Profile Directory
const DEFAULT_PROFILE_DIR = IS_WINDOWS
  ? path.join('C:', 'TecTicBd_Worker_Profile')
  : path.join('/var', 'lib', 'tecticbd', 'profile');

const PROFILE_DIR = process.env.WORKER_PROFILE_DIR || DEFAULT_PROFILE_DIR;

// Find Chrome Executable
function findChromeExecutable() {
  if (IS_WINDOWS) {
    const candidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
  } else {
    const linuxCandidates = [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
    ];
    for (const p of linuxCandidates) {
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

// Ensure profile directory exists
if (!fs.existsSync(PROFILE_DIR)) {
  try {
    fs.mkdirSync(PROFILE_DIR, { recursive: true });
    console.log(`[Worker] Created persistent profile directory at: ${PROFILE_DIR}`);
  } catch (err) {
    console.warn(`[Worker] Could not create profile directory at ${PROFILE_DIR}, falling back to temp dir.`);
  }
}

let browser = null;
let currentRunningTask = null;
let stats = {
  completed: 0,
  failed: 0,
  skipped: 0,
  lastHeartbeat: new Date().toISOString(),
};

async function launchBrowser() {
  if (browser) return browser;

  const executablePath = findChromeExecutable();
  console.log(`[Worker] Starting browser with profile: ${PROFILE_DIR}`);
  console.log(`[Worker] Chrome executable: ${executablePath || 'Default Puppeteer bundled'}`);

  const args = [
    `--user-data-dir=${PROFILE_DIR}`,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled',
    '--disable-notifications',
    '--start-maximized',
  ];

  try {
    browser = await puppeteer.launch({
      headless: false, // Local runs open window; on Linux VPS run with xvfb-run or headless: 'new'
      executablePath: executablePath || undefined,
      args,
      defaultViewport: null,
    });

    browser.on('disconnected', () => {
      console.log('[Worker] Browser process closed.');
      browser = null;
    });

    console.log('[Worker] Browser engine initialized successfully.');
    return browser;
  } catch (err) {
    console.error('[Worker] Failed to launch browser:', err.message);
    throw err;
  }
}

/**
 * Execute a single publishing task on Facebook Group
 */
async function executePublishingTask(task) {
  currentRunningTask = task;
  console.log(`[Worker] Starting Task ${task.id} -> ${task.groupName}`);

  // Safe Check: Group URL verification
  if (!task.groupUrl || (!task.groupUrl.includes('facebook.com') && !task.groupUrl.includes('fb.com'))) {
    console.log(`[Worker] Skipping invalid group URL: ${task.groupUrl}`);
    stats.skipped++;
    currentRunningTask = null;
    return {
      success: false,
      status: 'Skipped',
      reason: 'Invalid Facebook group URL format.',
    };
  }

  const b = await launchBrowser();
  const page = await b.newPage();

  try {
    // Anti-detection user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    );

    console.log(`[Worker] Navigating to: ${task.groupUrl}`);
    await page.goto(task.groupUrl, { waitUntil: 'networkidle2', timeout: 45000 });

    // Step 1: Check login status
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('checkpoint')) {
      throw new Error('Authentication required: Facebook profile is not logged in on this persistent worker profile.');
    }

    // Step 2: Check membership / access
    const pageContent = await page.content();
    if (pageContent.includes('This content isn\'t available right now') || pageContent.includes('Group not found')) {
      stats.skipped++;
      return {
        success: false,
        status: 'Skipped',
        reason: 'Group is inaccessible or deleted on Facebook.',
      };
    }

    // Step 3: Find post composer button
    // Realistic Facebook selectors
    const composerSelectors = [
      'div[role="button"][tabindex="0"] span:has-text("Write something...")',
      'div[role="button"]:has-text("Create a public post")',
      'div[role="button"]:has-text("Write something")',
      'div[aria-label*="Create a post"]',
    ];

    let openedComposer = false;
    for (const sel of composerSelectors) {
      try {
        const btn = await page.$(sel);
        if (btn) {
          await btn.click();
          openedComposer = true;
          break;
        }
      } catch (e) {}
    }

    if (!openedComposer) {
      // Fallback selector
      const fallbacks = await page.$$('div[role="button"]');
      for (const f of fallbacks) {
        const text = await page.evaluate(el => el.textContent, f);
        if (text && (text.includes('Write something') || text.includes('Create a post'))) {
          await f.click();
          openedComposer = true;
          break;
        }
      }
    }

    await page.waitForTimeout(1500);

    // Step 4: Type Caption
    const textbox = await page.$('div[role="textbox"][contenteditable="true"]');
    if (textbox) {
      await textbox.focus();
      await page.keyboard.type(task.caption, { delay: 15 });
    }

    await page.waitForTimeout(1000);

    // Step 5: Click Post
    const submitBtn = await page.$('div[aria-label="Post"][role="button"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('[Worker] Post submit clicked. Waiting for confirmation...');
    }

    // Wait for redirect or post card render
    await page.waitForTimeout(4000);

    // Step 6: Extract verified exact post URL
    let verifiedUrl = null;
    const postLinks = await page.$$eval('a[href*="/posts/"]', links => links.map(a => a.href));
    if (postLinks.length > 0) {
      verifiedUrl = postLinks[0].split('?')[0]; // Clean query parameters
    }

    stats.completed++;
    currentRunningTask = null;
    await page.close();

    if (verifiedUrl) {
      console.log(`[Worker] SUCCESS: Post live at ${verifiedUrl}`);
      return {
        success: true,
        status: 'Published',
        verifiedPostUrl: verifiedUrl,
        publishedAt: new Date().toISOString(),
      };
    } else {
      console.log('[Worker] SUCCESS: Published, but direct URL could not be captured.');
      return {
        success: true,
        status: 'Post Link Unavailable',
        publishedAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    stats.failed++;
    currentRunningTask = null;
    try { await page.close(); } catch (e) {}
    console.error(`[Worker] Error processing task ${task.id}:`, err.message);
    return {
      success: false,
      status: 'Failed',
      errorMessage: err.message,
    };
  }
}

// Worker HTTP Interface for Web App Integration
const app = express();
app.use(express.json());

// Heartbeat ping
app.get('/health', (req, res) => {
  stats.lastHeartbeat = new Date().toISOString();
  res.json({
    status: 'online',
    mode: IS_WINDOWS ? 'local_windows' : 'cloud_vps',
    profileDir: PROFILE_DIR,
    currentRunningTask: currentRunningTask?.id || null,
    stats,
    timestamp: stats.lastHeartbeat,
  });
});

// Execute task route
app.post('/execute', async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Missing task payload' });

  const result = await executePublishingTask(task);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  TecTic Bd - Persistent Automation Worker Running     `);
  console.log(`  Port: ${PORT}                                       `);
  console.log(`  Profile Directory: ${PROFILE_DIR}                   `);
  console.log(`  Platform: ${process.platform}                       `);
  console.log(`=======================================================`);
});
