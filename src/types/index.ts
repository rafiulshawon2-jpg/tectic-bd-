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
  | 'Cancelled';

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
  fbPostUrl?: string;
  lastUpdated: string; // ISO
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO
  type:
    | 'campaign_created'
    | 'task_published'
    | 'task_failed'
    | 'task_retried'
    | 'group_imported'
    | 'group_added'
    | 'queue_paused'
    | 'queue_resumed'
    | 'extension_connected'
    | 'settings_updated';
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
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}
