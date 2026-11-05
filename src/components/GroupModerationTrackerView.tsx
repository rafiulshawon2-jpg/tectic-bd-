import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ThumbsUp,
  MessageSquare,
  Facebook,
  Trash2,
  Eye,
  Check,
} from 'lucide-react';
import { GroupNotification, GroupPostModerationStatus, PublishingTask } from '../types';
import { storageService } from '../services/storage';
import { queueRunner } from '../services/queueRunner';
import { formatDateTime } from '../utils/dateUtils';

interface GroupModerationTrackerViewProps {
  notifications: GroupNotification[];
  tasks: PublishingTask[];
  timeZone: string;
}

export const GroupModerationTrackerView: React.FC<GroupModerationTrackerViewProps> = ({
  notifications,
  tasks,
  timeZone,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | GroupPostModerationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Status counts
  const approvedCount = notifications.filter((n) => n.status === 'live_approved').length;
  const pendingCount = notifications.filter((n) => n.status === 'pending_approval').length;
  const declinedCount = notifications.filter(
    (n) => n.status === 'declined' || n.status === 'deleted_by_admin' || n.status === 'removed_by_system'
  ).length;

  const handleSyncNotifications = () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    setTimeout(() => {
      const res = queueRunner.syncNotificationsNow(true);
      setIsSyncing(false);
      setSyncFeedback(
        `Checked Facebook ID notifications: ${res.checkedCount} posts audited, ${res.newUpdates} new status updates received.`
      );
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1200);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.campaignName && n.campaignName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'declined'
          ? n.status === 'declined' || n.status === 'deleted_by_admin' || n.status === 'removed_by_system'
          : n.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [notifications, searchQuery, statusFilter]);

  const handleMarkRead = (id: string) => {
    storageService.markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead();
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Group Post Approvals & Deletion Monitor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Facebook ID notification inspector. Detects which groups approved your promotional post, which have it in pending review, and which declined or deleted it.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncNotifications}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Checking Notifications...' : 'Sync Facebook Notifications'}</span>
          </button>

          {notifications.some((n) => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-white border-[#527CE4] ring-1 ring-[#527CE4] shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Audited Posts</span>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {notifications.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tracked notifications</div>
        </button>

        <button
          onClick={() => setStatusFilter('live_approved')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'live_approved'
              ? 'bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 text-xs">
            <span>Approved & Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-2">
            {approvedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Confirmed visible to members</div>
        </button>

        <button
          onClick={() => setStatusFilter('pending_approval')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'pending_approval'
              ? 'bg-white border-amber-500 ring-1 ring-amber-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 text-xs">
            <span>Pending Admin Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-2">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting moderator approval</div>
        </button>

        <button
          onClick={() => setStatusFilter('declined')}
          className={`p-4 rounded-xl border text-left transition-all ${
            statusFilter === 'declined'
              ? 'bg-white border-rose-500 ring-1 ring-rose-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 text-xs">
            <span>Declined / Deleted</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-2">
            {declinedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Rejected by group moderation</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications by group name, campaign, or keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Segmented Filter Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setStatusFilter('live_approved')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === 'live_approved'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending_approval')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === 'pending_approval'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('declined')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === 'declined'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Declined / Deleted ({declinedCount})
          </button>
        </div>
      </div>

      {/* Notifications Audit List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-sm text-xs">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No notifications found</p>
            <p className="text-slate-400 mt-1">
              Click "Sync Facebook Notifications" to check for latest group post status updates.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isApproved = notif.status === 'live_approved';
            const isPending = notif.status === 'pending_approval';
            const isDeclined =
              notif.status === 'declined' ||
              notif.status === 'deleted_by_admin' ||
              notif.status === 'removed_by_system';

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl p-4 border transition-all text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  !notif.read ? 'border-blue-300 bg-blue-50/20 shadow-xs' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Status Indicator Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-600'
                        : isPending
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isPending ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Header line: Group & Meta Account */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {notif.groupName}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Facebook className="w-3 h-3 text-[#1877F2] fill-[#1877F2]" />
                        <span>Posted as: {notif.metaAccountName}</span>
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDateTime(notif.timestamp, timeZone)}
                      </span>
                    </div>

                    {/* Status Message */}
                    <div className="text-slate-800 font-medium leading-relaxed">
                      {notif.message}
                    </div>

                    {/* Moderation reason or admin name */}
                    {notif.reason && (
                      <div className="p-2 rounded bg-rose-50 border border-rose-100 text-rose-700 text-[11px] flex items-start gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{notif.reason}</span>
                      </div>
                    )}

                    {notif.adminName && !notif.reason && (
                      <div className="text-[11px] text-slate-500">
                        Reviewer: <span className="font-medium text-slate-700">{notif.adminName}</span>
                      </div>
                    )}

                    {/* Post snippet */}
                    {notif.postSnippet && (
                      <div className="text-[11px] text-slate-500 font-sans italic truncate max-w-xl">
                        "{notif.postSnippet}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {notif.postUrl && isApproved && (
                    <a
                      href={notif.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live Post</span>
                    </a>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                      title="Mark as read"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
