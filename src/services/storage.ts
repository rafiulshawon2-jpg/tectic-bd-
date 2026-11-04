import {
  FacebookGroup,
  Campaign,
  PublishingTask,
  ActivityLog,
  AppSettings,
} from '../types';

const STORAGE_KEYS = {
  GROUPS: 'tectic_groups_v1',
  CAMPAIGNS: 'tectic_campaigns_v1',
  TASKS: 'tectic_tasks_v1',
  LOGS: 'tectic_logs_v1',
  SETTINGS: 'tectic_settings_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  brandName: 'TecTic Bd',
  userEmail: 'rafiulshawon2@gmail.com',
  defaultTimezone: 'Asia/Dhaka',
  defaultIntervalMinutes: 5,
  extensionBridgeToken: 'ttb_live_bridge_994827',
  simulatedExtension: true, // Allows immediate out-of-the-box browser execution testing
  autoRetryOnFail: true,
  maxRetries: 3,
  isFirebaseConfigured: false,
};

// Curated initial groups for TecTic Bd promotional campaigns
export const INITIAL_GROUPS: FacebookGroup[] = [
  {
    id: 'grp-01',
    name: 'TecTic Bd – Official Tech & Software Community',
    url: 'https://www.facebook.com/groups/tecticbd.community',
    category: 'Technology & IT',
    description: 'Main technology and software solutions group in Bangladesh.',
    status: 'active',
    dateAdded: '2026-10-15T09:00:00.000Z',
    memberCount: 24500,
  },
  {
    id: 'grp-02',
    name: 'Dhaka Freelancers & Tech Entrepreneurs Hub',
    url: 'https://www.facebook.com/groups/dhakafreelancers.hub',
    category: 'Freelancing & Business',
    description: 'Hub for freelancers, agency owners, and digital service providers.',
    status: 'active',
    dateAdded: '2026-10-18T11:30:00.000Z',
    memberCount: 88200,
  },
  {
    id: 'grp-03',
    name: 'Bangladesh Digital Marketing & SEO Experts',
    url: 'https://www.facebook.com/groups/bangladesh.digitalmarketing.experts',
    category: 'Digital Marketing',
    description: 'Discussions on Facebook Ads, Google Ads, content marketing and SEO.',
    status: 'active',
    dateAdded: '2026-10-20T14:15:00.000Z',
    memberCount: 142000,
  },
  {
    id: 'grp-04',
    name: 'E-Commerce Entrepreneurs of Bangladesh (F-Commerce & Web)',
    url: 'https://www.facebook.com/groups/bd.ecommerce.entrepreneurs',
    category: 'E-Commerce',
    description: 'Active marketplace of online shop owners and e-commerce founders.',
    status: 'active',
    dateAdded: '2026-10-22T08:45:00.000Z',
    memberCount: 195000,
  },
  {
    id: 'grp-05',
    name: 'Startup Bangladesh Founders & Investors Circle',
    url: 'https://www.facebook.com/groups/startupbangladesh.circle',
    category: 'Startups',
    description: 'Networking group for tech startup founders and innovators.',
    status: 'active',
    dateAdded: '2026-10-25T16:00:00.000Z',
    memberCount: 46800,
  },
  {
    id: 'grp-06',
    name: 'Chittagong Business & IT Professionals',
    url: 'https://www.facebook.com/groups/chittagong.it.business',
    category: 'Regional Business',
    description: 'Professional networking for Chattogram IT and trade community.',
    status: 'active',
    dateAdded: '2026-10-28T10:20:00.000Z',
    memberCount: 32100,
  },
  {
    id: 'grp-07',
    name: 'Bangladesh Software Developers & Engineers Forum',
    url: 'https://www.facebook.com/groups/bd.software.engineers',
    category: 'Technology & IT',
    description: 'Developers, tech leads, and software house professionals.',
    status: 'active',
    dateAdded: '2026-11-01T12:00:00.000Z',
    memberCount: 67400,
  },
  {
    id: 'grp-08',
    name: 'SME Business Promotion & Trade Bangladesh',
    url: 'https://www.facebook.com/groups/sme.business.promotion.bd',
    category: 'Business & Trade',
    description: 'B2B promotion, supplier search, and commercial business exchange.',
    status: 'inactive',
    dateAdded: '2026-11-02T15:10:00.000Z',
    memberCount: 51200,
  },
];

export const INITIAL_CAMPAIGN: Campaign = {
  id: 'camp-demo-01',
  name: 'TecTic Bd - Cloud Automation & SaaS Launch',
  caption: `🚀 Upgrade Your Business Operations with TecTic Bd!

Are you ready to automate your promotional outreach and scale your enterprise? TecTic Bd delivers state-of-the-art web applications, custom software automation, and digital marketing systems tailored for high-growth businesses.

✨ Key Benefits:
• 100% centralized multi-group campaign management
• Intelligent staggered scheduling with anti-spam rate throttling
• Real-time browser extension queue monitoring & reporting

📲 Contact us today for a free consultation: contact@tecticbd.com | https://tecticbd.com
#TecTicBd #BusinessAutomation #DigitalTransformation #BangladeshTech`,
  media: [
    {
      id: 'med-01',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      name: 'cloud_automation_dashboard.jpg',
    },
    {
      id: 'med-02',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      name: 'team_meeting_tecticbd.jpg',
    },
  ],
  groupIds: ['grp-01', 'grp-02', 'grp-03', 'grp-04', 'grp-05'],
  scheduleMode: 'automatic',
  autoIntervalMinutes: 5,
  startDateTime: new Date(Date.now() - 3600000).toISOString(),
  timezone: 'Asia/Dhaka',
  status: 'processing',
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date().toISOString(),
  totalTasks: 5,
  completedTasks: 2,
  pendingTasks: 2,
  failedTasks: 1,
};

export const INITIAL_TASKS: PublishingTask[] = [
  {
    id: 'tsk-01',
    campaignId: 'camp-demo-01',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    groupId: 'grp-01',
    groupName: 'TecTic Bd – Official Tech & Software Community',
    groupUrl: 'https://www.facebook.com/groups/tecticbd.community',
    caption: INITIAL_CAMPAIGN.caption,
    mediaUrls: [INITIAL_CAMPAIGN.media[0].url, INITIAL_CAMPAIGN.media[1].url],
    scheduledAt: new Date(Date.now() - 3600000).toISOString(),
    executedAt: new Date(Date.now() - 3540000).toISOString(),
    status: 'Published',
    retryCount: 0,
    fbPostUrl: 'https://www.facebook.com/groups/tecticbd.community/posts/108928374829',
    lastUpdated: new Date(Date.now() - 3540000).toISOString(),
  },
  {
    id: 'tsk-02',
    campaignId: 'camp-demo-01',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    groupId: 'grp-02',
    groupName: 'Dhaka Freelancers & Tech Entrepreneurs Hub',
    groupUrl: 'https://www.facebook.com/groups/dhakafreelancers.hub',
    caption: INITIAL_CAMPAIGN.caption,
    mediaUrls: [INITIAL_CAMPAIGN.media[0].url, INITIAL_CAMPAIGN.media[1].url],
    scheduledAt: new Date(Date.now() - 3300000).toISOString(),
    executedAt: new Date(Date.now() - 3240000).toISOString(),
    status: 'Published',
    retryCount: 0,
    fbPostUrl: 'https://www.facebook.com/groups/dhakafreelancers.hub/posts/55928172901',
    lastUpdated: new Date(Date.now() - 3240000).toISOString(),
  },
  {
    id: 'tsk-03',
    campaignId: 'camp-demo-01',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    groupId: 'grp-03',
    groupName: 'Bangladesh Digital Marketing & SEO Experts',
    groupUrl: 'https://www.facebook.com/groups/bangladesh.digitalmarketing.experts',
    caption: INITIAL_CAMPAIGN.caption,
    mediaUrls: [INITIAL_CAMPAIGN.media[0].url],
    scheduledAt: new Date(Date.now() - 3000000).toISOString(),
    executedAt: new Date(Date.now() - 2950000).toISOString(),
    status: 'Failed',
    retryCount: 2,
    errorMessage: 'Group requires admin post approval or rate limit throttle',
    lastUpdated: new Date(Date.now() - 2950000).toISOString(),
  },
  {
    id: 'tsk-04',
    campaignId: 'camp-demo-01',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    groupId: 'grp-04',
    groupName: 'E-Commerce Entrepreneurs of Bangladesh (F-Commerce & Web)',
    groupUrl: 'https://www.facebook.com/groups/bd.ecommerce.entrepreneurs',
    caption: INITIAL_CAMPAIGN.caption,
    mediaUrls: [INITIAL_CAMPAIGN.media[0].url],
    scheduledAt: new Date(Date.now() + 600000).toISOString(), // 10 mins from now
    status: 'Scheduled',
    retryCount: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'tsk-05',
    campaignId: 'camp-demo-01',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    groupId: 'grp-05',
    groupName: 'Startup Bangladesh Founders & Investors Circle',
    groupUrl: 'https://www.facebook.com/groups/startupbangladesh.circle',
    caption: INITIAL_CAMPAIGN.caption,
    mediaUrls: [INITIAL_CAMPAIGN.media[0].url],
    scheduledAt: new Date(Date.now() + 1200000).toISOString(), // 20 mins from now
    status: 'Scheduled',
    retryCount: 0,
    lastUpdated: new Date().toISOString(),
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-01',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    type: 'campaign_created',
    message: 'Campaign "TecTic Bd - Cloud Automation & SaaS Launch" created with 5 groups',
    campaignId: 'camp-demo-01',
  },
  {
    id: 'log-02',
    timestamp: new Date(Date.now() - 3540000).toISOString(),
    type: 'task_published',
    message: 'Successfully published to "TecTic Bd – Official Tech & Software Community"',
    taskId: 'tsk-01',
  },
  {
    id: 'log-03',
    timestamp: new Date(Date.now() - 3240000).toISOString(),
    type: 'task_published',
    message: 'Successfully published to "Dhaka Freelancers & Tech Entrepreneurs Hub"',
    taskId: 'tsk-02',
  },
  {
    id: 'log-04',
    timestamp: new Date(Date.now() - 2950000).toISOString(),
    type: 'task_failed',
    message: 'Failed publishing to "Bangladesh Digital Marketing & SEO Experts"',
    details: 'Group requires admin approval; captured for manual review',
    taskId: 'tsk-03',
  },
];

// Memory cache + local storage synchronization
class StorageService {
  private groups: FacebookGroup[] = [];
  private campaigns: Campaign[] = [];
  private tasks: PublishingTask[] = [];
  private logs: ActivityLog[] = [];
  private settings: AppSettings = DEFAULT_SETTINGS;
  private isInitialized = false;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    try {
      const storedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS);
      this.groups = storedGroups ? JSON.parse(storedGroups) : INITIAL_GROUPS;

      const storedCampaigns = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      this.campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [INITIAL_CAMPAIGN];

      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      this.tasks = storedTasks ? JSON.parse(storedTasks) : INITIAL_TASKS;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      this.logs = storedLogs ? JSON.parse(storedLogs) : INITIAL_LOGS;

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      this.settings = storedSettings ? { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) } : DEFAULT_SETTINGS;

      this.persistAll();
    } catch (e) {
      console.warn('Storage init fallback to memory defaults:', e);
      this.groups = INITIAL_GROUPS;
      this.campaigns = [INITIAL_CAMPAIGN];
      this.tasks = INITIAL_TASKS;
      this.logs = INITIAL_LOGS;
      this.settings = DEFAULT_SETTINGS;
    }
    this.isInitialized = true;
  }

  private persist(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Failed to persist ${key}:`, err);
    }
  }

  private persistAll() {
    this.persist(STORAGE_KEYS.GROUPS, this.groups);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.persist(STORAGE_KEYS.LOGS, this.logs);
    this.persist(STORAGE_KEYS.SETTINGS, this.settings);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Listener callback error:', e);
      }
    });
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  // --- Facebook Groups ---
  public getGroups(): FacebookGroup[] {
    return [...this.groups];
  }

  public addGroup(group: Omit<FacebookGroup, 'id' | 'dateAdded'>): FacebookGroup {
    const newGroup: FacebookGroup = {
      ...group,
      id: 'grp-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      dateAdded: new Date().toISOString(),
    };
    this.groups.unshift(newGroup);
    this.persist(STORAGE_KEYS.GROUPS, this.groups);
    this.addLog({
      type: 'group_added',
      message: `Added new Facebook Group: "${newGroup.name}"`,
      groupId: newGroup.id,
    });
    this.notify();
    return newGroup;
  }

  public updateGroup(id: string, updates: Partial<FacebookGroup>): FacebookGroup | null {
    const idx = this.groups.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.groups[idx] = { ...this.groups[idx], ...updates };
    this.persist(STORAGE_KEYS.GROUPS, this.groups);
    this.notify();
    return this.groups[idx];
  }

  public deleteGroup(id: string): boolean {
    const beforeCount = this.groups.length;
    this.groups = this.groups.filter((g) => g.id !== id);
    if (this.groups.length !== beforeCount) {
      this.persist(STORAGE_KEYS.GROUPS, this.groups);
      this.notify();
      return true;
    }
    return false;
  }

  public bulkImportGroups(
    rawText: string,
    defaultCategory = 'General'
  ): {
    importedCount: number;
    duplicateCount: number;
    invalidCount: number;
    errors: { line: number; rawUrl: string; reason: string }[];
    addedGroups: FacebookGroup[];
  } {
    const lines = rawText.split('\n');
    let importedCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;
    const errors: { line: number; rawUrl: string; reason: string }[] = [];
    const addedGroups: FacebookGroup[] = [];

    const existingUrls = new Set(
      this.groups.map((g) => this.normalizeFbGroupUrl(g.url))
    );

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return; // skip empty lines

      // URL Format validation
      if (
        !trimmed.includes('facebook.com/groups/') &&
        !trimmed.includes('fb.com/groups/')
      ) {
        invalidCount++;
        errors.push({
          line: index + 1,
          rawUrl: trimmed,
          reason: 'Not a valid Facebook group URL (must contain facebook.com/groups/ or fb.com/groups/)',
        });
        return;
      }

      // Check valid web URL syntax
      let parsedUrl: URL;
      try {
        const urlToParse = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
        parsedUrl = new URL(urlToParse);
      } catch {
        invalidCount++;
        errors.push({
          line: index + 1,
          rawUrl: trimmed,
          reason: 'Malformed URL structure',
        });
        return;
      }

      const normalized = this.normalizeFbGroupUrl(parsedUrl.href);

      // Check duplicates
      if (existingUrls.has(normalized)) {
        duplicateCount++;
        errors.push({
          line: index + 1,
          rawUrl: trimmed,
          reason: 'Duplicate URL: already exists in your saved group list',
        });
        return;
      }

      // Extract group name slug from URL path
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      const groupIdx = pathParts.indexOf('groups');
      const slug = groupIdx !== -1 && pathParts[groupIdx + 1] ? pathParts[groupIdx + 1] : `Group-${index + 1}`;
      const generatedName = `FB Group (${slug.replace(/[-_.]+/g, ' ')})`;

      const newGroup: FacebookGroup = {
        id: 'grp-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        name: generatedName,
        url: parsedUrl.href,
        category: defaultCategory,
        status: 'active',
        dateAdded: new Date().toISOString(),
      };

      existingUrls.add(normalized);
      this.groups.unshift(newGroup);
      addedGroups.push(newGroup);
      importedCount++;
    });

    if (importedCount > 0) {
      this.persist(STORAGE_KEYS.GROUPS, this.groups);
      this.addLog({
        type: 'group_imported',
        message: `Bulk imported ${importedCount} Facebook groups (${duplicateCount} duplicates skipped)`,
      });
      this.notify();
    }

    return { importedCount, duplicateCount, invalidCount, errors, addedGroups };
  }

  public normalizeFbGroupUrl(url: string): string {
    try {
      const clean = url.trim().toLowerCase();
      const u = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
      const parts = u.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('groups');
      if (idx !== -1 && parts[idx + 1]) {
        return `facebook.com/groups/${parts[idx + 1]}`;
      }
      return clean.replace(/\/+$/, '');
    } catch {
      return url.trim().toLowerCase();
    }
  }

  // --- Campaigns ---
  public getCampaigns(): Campaign[] {
    return [...this.campaigns];
  }

  public getCampaignById(id: string): Campaign | undefined {
    return this.campaigns.find((c) => c.id === id);
  }

  public createCampaign(
    campaignData: Omit<
      Campaign,
      'id' | 'createdAt' | 'updatedAt' | 'totalTasks' | 'completedTasks' | 'pendingTasks' | 'failedTasks'
    >,
    taskSchedules: { groupId: string; scheduledAt: string }[]
  ): { campaign: Campaign; tasks: PublishingTask[] } {
    const campaignId = 'camp-' + Date.now().toString(36);
    const now = new Date().toISOString();

    const createdTasks: PublishingTask[] = taskSchedules.map((schedule, idx) => {
      const group = this.groups.find((g) => g.id === schedule.groupId);
      return {
        id: `tsk-${campaignId.substring(5)}-${idx + 1}`,
        campaignId,
        campaignName: campaignData.name,
        groupId: schedule.groupId,
        groupName: group?.name || `Group ${idx + 1}`,
        groupUrl: group?.url || '',
        caption: campaignData.caption,
        mediaUrls: campaignData.media.map((m) => m.url),
        scheduledAt: schedule.scheduledAt,
        status: 'Scheduled',
        retryCount: 0,
        lastUpdated: now,
      };
    });

    const newCampaign: Campaign = {
      ...campaignData,
      id: campaignId,
      createdAt: now,
      updatedAt: now,
      totalTasks: createdTasks.length,
      completedTasks: 0,
      pendingTasks: createdTasks.length,
      failedTasks: 0,
      status: 'scheduled',
    };

    this.campaigns.unshift(newCampaign);
    this.tasks.unshift(...createdTasks);

    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);

    this.addLog({
      type: 'campaign_created',
      message: `Started campaign "${newCampaign.name}" with ${createdTasks.length} queued group tasks`,
      campaignId: newCampaign.id,
    });

    this.notify();
    return { campaign: newCampaign, tasks: createdTasks };
  }

  public updateCampaignStatus(campaignId: string, status: Campaign['status']) {
    const camp = this.campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    camp.status = status;
    camp.updatedAt = new Date().toISOString();

    // If paused, pause all pending/scheduled tasks
    if (status === 'paused') {
      this.tasks.forEach((t) => {
        if (t.campaignId === campaignId && (t.status === 'Scheduled' || t.status === 'Draft')) {
          t.status = 'Paused';
          t.lastUpdated = new Date().toISOString();
        }
      });
    } else if (status === 'scheduled' || status === 'processing') {
      this.tasks.forEach((t) => {
        if (t.campaignId === campaignId && t.status === 'Paused') {
          t.status = 'Scheduled';
          t.lastUpdated = new Date().toISOString();
        }
      });
    } else if (status === 'cancelled') {
      this.tasks.forEach((t) => {
        if (t.campaignId === campaignId && (t.status === 'Scheduled' || t.status === 'Paused')) {
          t.status = 'Cancelled';
          t.lastUpdated = new Date().toISOString();
        }
      });
    }

    this.recalculateCampaignCounts(campaignId);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.notify();
  }

  public deleteCampaign(campaignId: string) {
    this.campaigns = this.campaigns.filter((c) => c.id !== campaignId);
    this.tasks = this.tasks.filter((t) => t.campaignId !== campaignId);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.notify();
  }

  public duplicateCampaign(campaignId: string): Campaign | null {
    const source = this.campaigns.find((c) => c.id === campaignId);
    if (!source) return null;

    const newName = `${source.name} (Copy)`;
    const newCamp: Campaign = {
      ...source,
      id: 'camp-' + Date.now().toString(36),
      name: newName,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedTasks: 0,
      failedTasks: 0,
      pendingTasks: source.groupIds.length,
      totalTasks: source.groupIds.length,
    };

    this.campaigns.unshift(newCamp);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.notify();
    return newCamp;
  }

  // --- Tasks & Queue ---
  public getTasks(): PublishingTask[] {
    return [...this.tasks];
  }

  public updateTask(taskId: string, updates: Partial<PublishingTask>) {
    const idx = this.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return;

    this.tasks[idx] = {
      ...this.tasks[idx],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    this.recalculateCampaignCounts(this.tasks[idx].campaignId);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.notify();
  }

  public retryTask(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.status = 'Scheduled';
    task.retryCount = (task.retryCount || 0) + 1;
    task.errorMessage = undefined;
    task.scheduledAt = new Date().toISOString(); // run promptly
    task.lastUpdated = new Date().toISOString();

    this.addLog({
      type: 'task_retried',
      message: `Retrying task for group: ${task.groupName}`,
      taskId: task.id,
      campaignId: task.campaignId,
    });

    this.recalculateCampaignCounts(task.campaignId);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.notify();
  }

  public cancelTask(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.status = 'Cancelled';
    task.lastUpdated = new Date().toISOString();

    this.recalculateCampaignCounts(task.campaignId);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.notify();
  }

  public pauseAllTasks() {
    this.tasks.forEach((t) => {
      if (t.status === 'Scheduled') {
        t.status = 'Paused';
        t.lastUpdated = new Date().toISOString();
      }
    });
    this.campaigns.forEach((c) => {
      if (c.status === 'scheduled' || c.status === 'processing') {
        c.status = 'paused';
      }
    });
    this.addLog({
      type: 'queue_paused',
      message: 'Global publishing queue paused by user',
    });
    this.persistAll();
    this.notify();
  }

  public resumeAllTasks() {
    this.tasks.forEach((t) => {
      if (t.status === 'Paused') {
        t.status = 'Scheduled';
        t.lastUpdated = new Date().toISOString();
      }
    });
    this.campaigns.forEach((c) => {
      if (c.status === 'paused') {
        c.status = 'scheduled';
      }
    });
    this.addLog({
      type: 'queue_resumed',
      message: 'Global publishing queue resumed by user',
    });
    this.persistAll();
    this.notify();
  }

  private recalculateCampaignCounts(campaignId: string) {
    const camp = this.campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    const campTasks = this.tasks.filter((t) => t.campaignId === campaignId);
    camp.totalTasks = campTasks.length;
    camp.completedTasks = campTasks.filter((t) => t.status === 'Published').length;
    camp.failedTasks = campTasks.filter((t) => t.status === 'Failed').length;
    camp.pendingTasks = campTasks.filter((t) => t.status === 'Scheduled' || t.status === 'Processing' || t.status === 'Paused').length;

    if (camp.totalTasks > 0 && camp.completedTasks + camp.failedTasks === camp.totalTasks) {
      camp.status = 'completed';
    }
  }

  // --- Logs ---
  public getLogs(): ActivityLog[] {
    return [...this.logs];
  }

  public addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      ...log,
      id: 'log-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(newLog);
    // keep max 200 logs
    if (this.logs.length > 200) {
      this.logs = this.logs.slice(0, 200);
    }
    this.persist(STORAGE_KEYS.LOGS, this.logs);
  }

  // --- Settings ---
  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public saveSettings(updates: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...updates };
    this.persist(STORAGE_KEYS.SETTINGS, this.settings);
    this.addLog({
      type: 'settings_updated',
      message: 'Application settings updated',
    });
    this.notify();
    return this.settings;
  }

  // --- Backup & Restore ---
  public exportAllData(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        brand: 'TecTic Bd',
        groups: this.groups,
        campaigns: this.campaigns,
        tasks: this.tasks,
        logs: this.logs,
        settings: this.settings,
      },
      null,
      2
    );
  }

  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.groups)) this.groups = data.groups;
      if (Array.isArray(data.campaigns)) this.campaigns = data.campaigns;
      if (Array.isArray(data.tasks)) this.tasks = data.tasks;
      if (Array.isArray(data.logs)) this.logs = data.logs;
      if (data.settings) this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
      this.persistAll();
      this.notify();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  public resetToSampleData() {
    this.groups = [...INITIAL_GROUPS];
    this.campaigns = [INITIAL_CAMPAIGN];
    this.tasks = [...INITIAL_TASKS];
    this.logs = [...INITIAL_LOGS];
    this.settings = { ...DEFAULT_SETTINGS };
    this.persistAll();
    this.notify();
  }

  public clearAllData() {
    this.groups = [];
    this.campaigns = [];
    this.tasks = [];
    this.logs = [];
    this.settings = { ...DEFAULT_SETTINGS };
    this.persistAll();
    this.notify();
  }
}

export const storageService = new StorageService();
