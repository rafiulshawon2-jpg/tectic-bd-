import {
  FacebookGroup,
  Campaign,
  PublishingTask,
  ActivityLog,
  AppSettings,
  MetaAccount,
  GroupNotification,
  GroupPostModerationStatus,
  PrePublishReport,
  PrePublishGroupResult,
  PrePublishStatus,
  WorkerDeploymentMode,
  WorkerState,
} from '../types';

const STORAGE_KEYS = {
  GROUPS: 'tectic_groups_v1',
  CAMPAIGNS: 'tectic_campaigns_v1',
  TASKS: 'tectic_tasks_v1',
  LOGS: 'tectic_logs_v1',
  SETTINGS: 'tectic_settings_v1',
  ACCOUNTS: 'tectic_accounts_v1',
  NOTIFICATIONS: 'tectic_notifications_v1',
  WORKER: 'tectic_worker_state_v1',
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
  notificationPollingIntervalMinutes: 3,
  workerMode: 'local_windows',
  workerPort: 4892,
  workerSecret: 'ttb_worker_sec_9941',
};

export const INITIAL_ACCOUNTS: MetaAccount[] = [
  {
    id: 'meta-fb-01',
    platform: 'facebook',
    name: 'TecTic Bd (Official Admin)',
    username: 'tectic.bd.official',
    accountType: 'profile',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    profileUrl: 'https://www.facebook.com/tectic.bd.official',
    isConnected: true,
    connectedAt: '2026-10-10T10:00:00.000Z',
    tokenExpiry: '2027-10-10T10:00:00.000Z',
    accessTokenSnippet: 'EAAGNO...94bKx',
    permissions: [
      'groups_access_member_info',
      'publish_to_groups',
      'pages_read_engagement',
      'read_notifications',
      'public_profile',
    ],
    isDefault: true,
  },
  {
    id: 'meta-fb-02',
    platform: 'facebook',
    name: 'TecTic Bd – Software Solutions Page',
    username: 'tecticbd.enterprise',
    accountType: 'page',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    profileUrl: 'https://www.facebook.com/tecticbd.enterprise',
    isConnected: true,
    connectedAt: '2026-10-14T12:00:00.000Z',
    tokenExpiry: '2027-10-14T12:00:00.000Z',
    accessTokenSnippet: 'EAAZPO...8821m',
    permissions: [
      'pages_manage_posts',
      'pages_read_engagement',
      'publish_to_groups',
      'pages_show_list',
    ],
    isDefault: false,
  },
  {
    id: 'meta-ig-01',
    platform: 'instagram',
    name: 'TecTic Bd Official (@tecticbd_tech)',
    username: 'tecticbd_tech',
    accountType: 'business_instagram',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    profileUrl: 'https://instagram.com/tecticbd_tech',
    isConnected: true,
    connectedAt: '2026-10-18T15:30:00.000Z',
    tokenExpiry: '2027-10-18T15:30:00.000Z',
    accessTokenSnippet: 'IGQV...4318a',
    permissions: [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
    ],
    isDefault: false,
  },
];

export const INITIAL_NOTIFICATIONS: GroupNotification[] = [
  {
    id: 'notif-01',
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    groupId: 'grp-02',
    groupName: 'Dhaka Freelancers & Tech Entrepreneurs Hub',
    groupUrl: 'https://www.facebook.com/groups/dhakafreelancers.hub',
    taskId: 'tsk-02',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    timestamp: new Date(Date.now() - 3200000).toISOString(),
    status: 'live_approved',
    adminName: 'Tanvir Ahmed (Group Admin)',
    message: 'Your promotional post in "Dhaka Freelancers & Tech Entrepreneurs Hub" was approved and is now active.',
    read: false,
    postSnippet: '🚀 Upgrade Your Business Operations with TecTic Bd! Are you ready to automate...',
    postUrl: 'https://www.facebook.com/groups/dhakafreelancers.hub/posts/55928172901',
  },
  {
    id: 'notif-02',
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    groupId: 'grp-03',
    groupName: 'Bangladesh Digital Marketing & SEO Experts',
    groupUrl: 'https://www.facebook.com/groups/bangladesh.digitalmarketing.experts',
    taskId: 'tsk-03',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    timestamp: new Date(Date.now() - 2900000).toISOString(),
    status: 'pending_approval',
    reason: 'Group moderation rule: Posts containing external service links require admin review.',
    message: 'Your post is waiting in the group admin approval queue (Pending Review).',
    read: false,
    postSnippet: '🚀 Upgrade Your Business Operations with TecTic Bd! Visit our portal...',
  },
  {
    id: 'notif-03',
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    groupId: 'grp-01',
    groupName: 'TecTic Bd – Official Tech & Software Community',
    groupUrl: 'https://www.facebook.com/groups/tecticbd.community',
    taskId: 'tsk-01',
    campaignName: 'TecTic Bd - Cloud Automation & SaaS Launch',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    status: 'live_approved',
    adminName: 'Auto-Approved (Admin Badge)',
    message: 'Post directly published with instant membership authority. Visibility: Public.',
    read: true,
    postSnippet: '🚀 Upgrade Your Business Operations with TecTic Bd!...',
    postUrl: 'https://www.facebook.com/groups/tecticbd.community/posts/108928374829',
  },
  {
    id: 'notif-04',
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    groupId: 'grp-08',
    groupName: 'SME Business Promotion & Trade Bangladesh',
    groupUrl: 'https://www.facebook.com/groups/sme.business.promotion.bd',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'declined',
    adminName: 'Admin Assist (Automated Rule #4)',
    reason: 'Declined: Promotional links must be accompanied by business registration certificate.',
    message: 'Your post was declined by group moderation.',
    read: false,
    postSnippet: 'Special Business Automation Offer for SMEs in Bangladesh...',
  },
];

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
  skippedTasks: 0,
  verificationRequiredTasks: 0,
  selectedMetaAccountId: 'meta-fb-01',
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
    verifiedAt: new Date(Date.now() - 3540000).toISOString(),
    lastUpdated: new Date(Date.now() - 3540000).toISOString(),
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    moderationStatus: 'live_approved',
    moderationCheckedAt: new Date(Date.now() - 3500000).toISOString(),
    workerType: 'local_windows',
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
    verifiedAt: new Date(Date.now() - 3240000).toISOString(),
    lastUpdated: new Date(Date.now() - 3240000).toISOString(),
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    moderationStatus: 'live_approved',
    moderationCheckedAt: new Date(Date.now() - 3200000).toISOString(),
    workerType: 'local_windows',
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
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    moderationStatus: 'pending_approval',
    moderationReason: 'Group rules require admin approval for links',
    moderationCheckedAt: new Date(Date.now() - 2900000).toISOString(),
    workerType: 'local_windows',
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
    scheduledAt: new Date(Date.now() + 600000).toISOString(),
    status: 'Scheduled',
    retryCount: 0,
    lastUpdated: new Date().toISOString(),
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    workerType: 'local_windows',
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
    scheduledAt: new Date(Date.now() + 1200000).toISOString(),
    status: 'Scheduled',
    retryCount: 0,
    lastUpdated: new Date().toISOString(),
    metaAccountId: 'meta-fb-01',
    metaAccountName: 'TecTic Bd (Official Admin)',
    workerType: 'local_windows',
  },
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-00',
    timestamp: new Date(Date.now() - 7400000).toISOString(),
    type: 'account_connected',
    message: 'Connected Facebook Profile: TecTic Bd (Official Admin)',
  },
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
    message: 'Successfully published to "TecTic Bd – Official Tech & Software Community". Verified link stored.',
    taskId: 'tsk-01',
  },
  {
    id: 'log-03',
    timestamp: new Date(Date.now() - 3240000).toISOString(),
    type: 'task_published',
    message: 'Successfully published to "Dhaka Freelancers & Tech Entrepreneurs Hub". Verified link stored.',
    taskId: 'tsk-02',
  },
  {
    id: 'log-04',
    timestamp: new Date(Date.now() - 2950000).toISOString(),
    type: 'notification_received',
    message: 'Notification: Post in "Bangladesh Digital Marketing" is pending admin approval',
    taskId: 'tsk-03',
  },
];

export const INITIAL_WORKER_STATE: WorkerState = {
  mode: 'local_windows',
  status: 'online',
  lastHeartbeat: new Date().toISOString(),
  completedTasks: 42,
  failedTasks: 2,
  profileName: 'Default Windows Chrome Profile (TecTic Bd Admin)',
  workerEndpoint: 'http://localhost:4892',
  vpsProvider: 'Oracle Cloud Always Free ARM (24GB RAM)',
  systemUptime: '14 days, 6 hours',
};

class StorageService {
  private groups: FacebookGroup[] = [];
  private campaigns: Campaign[] = [];
  private tasks: PublishingTask[] = [];
  private logs: ActivityLog[] = [];
  private settings: AppSettings = DEFAULT_SETTINGS;
  private accounts: MetaAccount[] = [];
  private notifications: GroupNotification[] = [];
  private workerState: WorkerState = INITIAL_WORKER_STATE;
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

      const storedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      this.accounts = storedAccounts ? JSON.parse(storedAccounts) : INITIAL_ACCOUNTS;

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : INITIAL_NOTIFICATIONS;

      const storedWorker = localStorage.getItem(STORAGE_KEYS.WORKER);
      this.workerState = storedWorker ? { ...INITIAL_WORKER_STATE, ...JSON.parse(storedWorker) } : INITIAL_WORKER_STATE;

      this.persistAll();
    } catch (e) {
      console.warn('Storage init fallback to memory defaults:', e);
      this.groups = INITIAL_GROUPS;
      this.campaigns = [INITIAL_CAMPAIGN];
      this.tasks = INITIAL_TASKS;
      this.logs = INITIAL_LOGS;
      this.settings = DEFAULT_SETTINGS;
      this.accounts = INITIAL_ACCOUNTS;
      this.notifications = INITIAL_NOTIFICATIONS;
      this.workerState = INITIAL_WORKER_STATE;
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
    this.persist(STORAGE_KEYS.ACCOUNTS, this.accounts);
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.persist(STORAGE_KEYS.WORKER, this.workerState);
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

  // --- Worker State & Control ---
  public getWorkerState(): WorkerState {
    return { ...this.workerState };
  }

  public setWorkerMode(mode: WorkerDeploymentMode) {
    this.workerState.mode = mode;
    this.settings.workerMode = mode;
    this.workerState.lastHeartbeat = new Date().toISOString();
    this.persist(STORAGE_KEYS.WORKER, this.workerState);
    this.persist(STORAGE_KEYS.SETTINGS, this.settings);
    this.addLog({
      type: 'worker_mode_changed',
      message: `Worker mode switched to: ${mode.replace('_', ' ').toUpperCase()}`,
    });
    this.notify();
  }

  public updateWorkerHeartbeat(updates?: Partial<WorkerState>) {
    this.workerState = {
      ...this.workerState,
      status: 'online',
      lastHeartbeat: new Date().toISOString(),
      ...updates,
    };
    this.persist(STORAGE_KEYS.WORKER, this.workerState);
    this.notify();
  }

  // --- Pre-Publish Group Check ---
  public runPrePublishCheck(
    groupIds: string[],
    metaAccountId?: string,
    mediaCount = 0
  ): PrePublishReport {
    const account =
      this.accounts.find((a) => a.id === metaAccountId) || this.getDefaultAccount();

    let readyCount = 0;
    let restrictedCount = 0;
    let requiresAttentionCount = 0;
    let unavailableCount = 0;

    const results: PrePublishGroupResult[] = groupIds.map((id) => {
      const group = this.groups.find((g) => g.id === id);
      if (!group) {
        unavailableCount++;
        return {
          groupId: id,
          groupName: 'Unknown Facebook Group',
          groupUrl: '',
          status: 'access_unavailable',
          issues: ['Group record could not be found in saved database.'],
          membershipConfirmed: false,
          canPostDirectly: false,
          requiresAdminApproval: false,
          mediaCompatible: false,
        };
      }

      const issues: string[] = [];
      let status: PrePublishStatus = 'ready';
      let membershipConfirmed = true;
      let canPostDirectly = true;
      let requiresAdminApproval = false;
      const mediaCompatible = true;

      // Check 1: Inactive Group
      if (group.status === 'inactive') {
        status = 'requires_attention';
        requiresAttentionCount++;
        issues.push('Group is marked as Inactive in directory.');
        canPostDirectly = false;
      }

      // Check 2: Invalid or broken URL
      if (
        !group.url.includes('facebook.com/groups/') &&
        !group.url.includes('fb.com/groups/')
      ) {
        status = 'access_unavailable';
        unavailableCount++;
        issues.push('Invalid Facebook Group URL format.');
        canPostDirectly = false;
        membershipConfirmed = false;
      }

      // Check 3: Group rules / known approval requirement
      if (
        group.name.toLowerCase().includes('marketing') ||
        group.category === 'Digital Marketing'
      ) {
        status = 'restricted';
        restrictedCount++;
        requiresAdminApproval = true;
        canPostDirectly = false;
        issues.push('Group rules require manual admin approval before posts appear to members.');
      } else if (
        group.name.toLowerCase().includes('trade') ||
        group.name.toLowerCase().includes('sme')
      ) {
        status = 'restricted';
        restrictedCount++;
        requiresAdminApproval = true;
        issues.push('Business keyword filter detected. Admin Assist moderation active.');
      }

      // Check 4: Media compatibility
      if (mediaCount > 4) {
        issues.push('Large media bundle: Facebook may take additional processing time.');
      }

      if (status === 'ready') {
        readyCount++;
      }

      return {
        groupId: group.id,
        groupName: group.name,
        groupUrl: group.url,
        status,
        issues,
        membershipConfirmed,
        canPostDirectly,
        requiresAdminApproval,
        mediaCompatible,
      };
    });

    const report: PrePublishReport = {
      timestamp: new Date().toISOString(),
      totalChecked: groupIds.length,
      readyCount,
      restrictedCount,
      requiresAttentionCount,
      unavailableCount,
      groups: results,
    };

    this.addLog({
      type: 'pre_publish_check',
      message: `Pre-publish check completed for ${groupIds.length} groups: ${readyCount} Ready, ${restrictedCount} Restricted, ${requiresAttentionCount} Attention Needed`,
    });

    return report;
  }

  // --- Meta Accounts (Facebook & Instagram) ---
  public getAccounts(): MetaAccount[] {
    return [...this.accounts];
  }

  public getDefaultAccount(): MetaAccount | undefined {
    return this.accounts.find((a) => a.isDefault && a.isConnected) || this.accounts.find((a) => a.isConnected);
  }

  public addAccount(accountData: Omit<MetaAccount, 'id' | 'connectedAt'>): MetaAccount {
    const newAccount: MetaAccount = {
      ...accountData,
      id: 'meta-' + (accountData.platform === 'facebook' ? 'fb-' : 'ig-') + Date.now().toString(36),
      connectedAt: new Date().toISOString(),
    };

    if (newAccount.isDefault) {
      this.accounts.forEach((a) => {
        a.isDefault = false;
      });
    }

    this.accounts.unshift(newAccount);
    this.persist(STORAGE_KEYS.ACCOUNTS, this.accounts);
    this.addLog({
      type: 'account_connected',
      message: `Connected ${newAccount.platform.toUpperCase()} ${newAccount.accountType}: "${newAccount.name}"`,
    });
    this.notify();
    return newAccount;
  }

  public updateAccount(id: string, updates: Partial<MetaAccount>): MetaAccount | null {
    const idx = this.accounts.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    if (updates.isDefault) {
      this.accounts.forEach((a) => {
        a.isDefault = false;
      });
    }

    this.accounts[idx] = { ...this.accounts[idx], ...updates };
    this.persist(STORAGE_KEYS.ACCOUNTS, this.accounts);
    this.notify();
    return this.accounts[idx];
  }

  public deleteAccount(id: string): boolean {
    const before = this.accounts.length;
    this.accounts = this.accounts.filter((a) => a.id !== id);
    if (this.accounts.length !== before) {
      if (this.accounts.length > 0 && !this.accounts.some((a) => a.isDefault)) {
        this.accounts[0].isDefault = true;
      }
      this.persist(STORAGE_KEYS.ACCOUNTS, this.accounts);
      this.notify();
      return true;
    }
    return false;
  }

  public setDefaultAccount(id: string) {
    this.accounts.forEach((a) => {
      a.isDefault = a.id === id;
    });
    this.persist(STORAGE_KEYS.ACCOUNTS, this.accounts);
    this.notify();
  }

  // --- Group Notifications & Post Approval/Deletion Tracker ---
  public getNotifications(): GroupNotification[] {
    return [...this.notifications];
  }

  public addNotification(notification: Omit<GroupNotification, 'id' | 'timestamp' | 'read'>): GroupNotification {
    const newNotif: GroupNotification = {
      ...notification,
      id: 'notif-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.notifications.unshift(newNotif);
    if (this.notifications.length > 150) {
      this.notifications = this.notifications.slice(0, 150);
    }
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.addLog({
      type: 'notification_received',
      message: `Notification: ${newNotif.groupName} - ${newNotif.message}`,
      taskId: newNotif.taskId,
    });
    this.notify();
    return newNotif;
  }

  public markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      this.notify();
    }
  }

  public markAllNotificationsRead() {
    this.notifications.forEach((n) => {
      n.read = true;
    });
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public clearNotifications() {
    this.notifications = [];
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public checkAndSyncNotifications(): { checkedCount: number; newUpdates: number } {
    let newUpdates = 0;
    const defaultAcc = this.getDefaultAccount();

    this.tasks.forEach((task) => {
      if (task.status === 'Published' || task.status === 'Post Link Unavailable') {
        if (!task.moderationStatus) {
          const isPending = task.groupId === 'grp-03' || task.groupName.toLowerCase().includes('marketing');
          const isDeclined = task.groupId === 'grp-08' || task.groupName.toLowerCase().includes('trade');

          let status: GroupPostModerationStatus = 'live_approved';
          let reason: string | undefined = undefined;
          let adminName: string | undefined = 'Group Admin';

          if (isPending) {
            status = 'pending_approval';
            reason = 'Awaiting admin review under group rule #2 (Link approval).';
          } else if (isDeclined) {
            status = 'declined';
            reason = 'Declined by Admin Assist: keyword restriction.';
          }

          task.moderationStatus = status;
          task.moderationReason = reason;
          task.moderationCheckedAt = new Date().toISOString();

          this.addNotification({
            metaAccountId: task.metaAccountId || defaultAcc?.id || 'meta-fb-01',
            metaAccountName: task.metaAccountName || defaultAcc?.name || 'TecTic Bd (Official Admin)',
            groupId: task.groupId,
            groupName: task.groupName,
            groupUrl: task.groupUrl,
            taskId: task.id,
            campaignName: task.campaignName,
            status,
            adminName,
            reason,
            message:
              status === 'live_approved'
                ? `Your post in "${task.groupName}" is approved and live.`
                : status === 'pending_approval'
                ? `Your post in "${task.groupName}" is pending admin review.`
                : `Your post in "${task.groupName}" was declined or removed.`,
            postSnippet: task.caption.substring(0, 75) + '...',
            postUrl: task.fbPostUrl,
          });
          newUpdates++;
        }
      }
    });

    this.persist(STORAGE_KEYS.TASKS, this.tasks);
    this.notify();
    return { checkedCount: this.tasks.length, newUpdates };
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
      if (!trimmed) return;

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

      if (existingUrls.has(normalized)) {
        duplicateCount++;
        errors.push({
          line: index + 1,
          rawUrl: trimmed,
          reason: 'Duplicate URL: already exists in your saved group list',
        });
        return;
      }

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
      'id' | 'createdAt' | 'updatedAt' | 'totalTasks' | 'completedTasks' | 'pendingTasks' | 'failedTasks' | 'skippedTasks' | 'verificationRequiredTasks'
    >,
    taskSchedules: { groupId: string; scheduledAt: string }[]
  ): { campaign: Campaign; tasks: PublishingTask[] } {
    const campaignId = 'camp-' + Date.now().toString(36);
    const now = new Date().toISOString();

    const selectedAcc =
      this.accounts.find((a) => a.id === campaignData.selectedMetaAccountId) ||
      this.getDefaultAccount();

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
        metaAccountId: selectedAcc?.id,
        metaAccountName: selectedAcc?.name,
        workerType: this.settings.workerMode,
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
      skippedTasks: 0,
      verificationRequiredTasks: 0,
      status: 'scheduled',
      selectedMetaAccountId: selectedAcc?.id,
    };

    this.campaigns.unshift(newCampaign);
    this.tasks.unshift(...createdTasks);

    this.persist(STORAGE_KEYS.CAMPAIGNS, this.campaigns);
    this.persist(STORAGE_KEYS.TASKS, this.tasks);

    this.addLog({
      type: 'campaign_created',
      message: `Started campaign "${newCampaign.name}" with ${createdTasks.length} queued tasks using ${selectedAcc?.name || 'Default Account'}`,
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
      skippedTasks: 0,
      verificationRequiredTasks: 0,
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
    task.scheduledAt = new Date().toISOString();
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
    camp.completedTasks = campTasks.filter(
      (t) => t.status === 'Published' || t.status === 'Post Link Unavailable'
    ).length;
    camp.failedTasks = campTasks.filter((t) => t.status === 'Failed').length;
    camp.skippedTasks = campTasks.filter((t) => t.status === 'Skipped').length;
    camp.verificationRequiredTasks = campTasks.filter(
      (t) => t.status === 'Verification Required'
    ).length;
    camp.pendingTasks = campTasks.filter(
      (t) => t.status === 'Scheduled' || t.status === 'Processing' || t.status === 'Paused'
    ).length;

    // Only mark completed when no pending tasks remain
    if (camp.totalTasks > 0 && camp.pendingTasks === 0) {
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
    if (updates.workerMode) {
      this.workerState.mode = updates.workerMode;
    }
    this.persist(STORAGE_KEYS.SETTINGS, this.settings);
    this.persist(STORAGE_KEYS.WORKER, this.workerState);
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
        version: '1.2.0',
        brand: 'TecTic Bd',
        groups: this.groups,
        campaigns: this.campaigns,
        tasks: this.tasks,
        accounts: this.accounts,
        notifications: this.notifications,
        workerState: this.workerState,
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
      if (Array.isArray(data.accounts)) this.accounts = data.accounts;
      if (Array.isArray(data.notifications)) this.notifications = data.notifications;
      if (Array.isArray(data.logs)) this.logs = data.logs;
      if (data.workerState) this.workerState = { ...INITIAL_WORKER_STATE, ...data.workerState };
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
    this.accounts = [...INITIAL_ACCOUNTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.workerState = { ...INITIAL_WORKER_STATE };
    this.logs = [...INITIAL_LOGS];
    this.settings = { ...DEFAULT_SETTINGS };
    this.persistAll();
    this.notify();
  }

  public clearAllData() {
    this.groups = [];
    this.campaigns = [];
    this.tasks = [];
    this.accounts = [];
    this.notifications = [];
    this.logs = [];
    this.workerState = { ...INITIAL_WORKER_STATE };
    this.settings = { ...DEFAULT_SETTINGS };
    this.persistAll();
    this.notify();
  }
}

export const storageService = new StorageService();
