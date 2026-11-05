export interface FacebookGroup {
  id: string;
  name: string;
  url: string;
  category: string;
  description?: string;
  status: 'active' | 'inactive';
  dateAdded: string; // ISO
  memberCount?: number;
}

export type TaskStatus =
  | 'Draft'
  | 'Scheduled'
  | 'Processing'
  | 'Published'
  | 'Failed'
  | 'Paused'
  | 'Cancelled'
  | 'Verification Required'
  | 'Skipped'
  | 'Post Link Unavailable';

export type GroupPostModerationStatus =
  | 'live_approved'
  | 'pending_approval'
  | 'declined'
  | 'deleted_by_admin'
  | 'removed_by_system';

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'processing'
  | 'completed'
  | 'paused'
  | 'cancelled';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
  size?: number;
}

export interface MetaAccount {
  id: string;
  platform: 'facebook' | 'instagram';
  name: string;
  username?: string;
  accountType: 'profile' | 'page' | 'business_instagram';
  avatarUrl: string;
  profileUrl: string;
  isConnected: boolean;
  connectedAt: string; // ISO
  tokenExpiry?: string;
  accessTokenSnippet?: string;
  permissions: string[];
  isDefault?: boolean;
}

export interface GroupNotification {
  id: string;
  metaAccountId: string;
  metaAccountName: string;
  groupId: string;
  groupName: string;
  groupUrl: string;
  taskId?: string;
  campaignName?: string;
  timestamp: string; // ISO
  status: GroupPostModerationStatus;
  adminName?: string;
  reason?: string;
  message: string;
  read: boolean;
  postSnippet?: string;
  postUrl?: string;
}

export type PrePublishStatus =
  | 'ready'
  | 'access_unavailable'
  | 'restricted'
  | 'requires_attention'
  | 'unable_to_verify';

export interface PrePublishGroupResult {
  groupId: string;
  groupName: string;
  groupUrl: string;
  status: PrePublishStatus;
  issues: string[];
  membershipConfirmed: boolean;
  canPostDirectly: boolean;
  requiresAdminApproval: boolean;
  mediaCompatible: boolean;
}

export interface PrePublishReport {
  timestamp: string; // ISO
  totalChecked: number;
  readyCount: number;
  restrictedCount: number;
  requiresAttentionCount: number;
  unavailableCount: number;
  groups: PrePublishGroupResult[];
}

export type WorkerDeploymentMode = 'browser_extension' | 'local_windows' | 'cloud_vps';

export interface WorkerState {
  mode: WorkerDeploymentMode;
  status: 'online' | 'offline' | 'busy' | 'reconnecting';
  lastHeartbeat: string; // ISO
  currentTaskId?: string;
  currentGroupName?: string;
  completedTasks: number;
  failedTasks: number;
  profileName: string;
  workerEndpoint?: string;
  vpsProvider?: string;
  systemUptime?: string;
}

export interface Campaign {
  id: string;
  name: string;
  caption: string;
  media: MediaItem[];
  groupIds: string[];
  scheduleMode: 'automatic' | 'manual';
  autoIntervalMinutes?: number;
  startDateTime?: string; // ISO
  timezone: string;
  status: CampaignStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  failedTasks: number;
  skippedTasks: number;
  verificationRequiredTasks: number;
  selectedMetaAccountId?: string;
}

export interface PublishingTask {
  id: string;
  campaignId: string;
  campaignName: string;
  groupId: string;
  groupName: string;
  groupUrl: string;
  caption: string;
  mediaUrls: string[];
  scheduledAt: string; // ISO
  executedAt?: string; // ISO
  status: TaskStatus;
  retryCount: number;
  errorMessage?: string;
  fbPostUrl?: string; // Verified exact Facebook Post URL
  verifiedAt?: string; // ISO
  verificationNotes?: string;
  lastUpdated: string; // ISO
  metaAccountId?: string;
  metaAccountName?: string;
  moderationStatus?: GroupPostModerationStatus;
  moderationReason?: string;
  moderationCheckedAt?: string; // ISO
  workerType?: WorkerDeploymentMode;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO
  type:
    | 'campaign_created'
    | 'task_published'
    | 'task_failed'
    | 'task_retried'
    | 'task_skipped'
    | 'task_verified'
    | 'pre_publish_check'
    | 'group_imported'
    | 'group_added'
    | 'queue_paused'
    | 'queue_resumed'
    | 'extension_connected'
    | 'worker_heartbeat'
    | 'worker_mode_changed'
    | 'settings_updated'
    | 'account_connected'
    | 'notification_received'
    | 'post_moderated';
  message: string;
  details?: string;
  campaignId?: string;
  taskId?: string;
  groupId?: string;
}

export interface AppSettings {
  brandName: string;
  userEmail: string;
  defaultTimezone: string;
  defaultIntervalMinutes: number;
  extensionBridgeToken: string;
  simulatedExtension: boolean;
  autoRetryOnFail: boolean;
  maxRetries: number;
  isFirebaseConfigured: boolean;
  notificationPollingIntervalMinutes?: number;
  workerMode: WorkerDeploymentMode;
  workerPort?: number;
  workerSecret?: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}
