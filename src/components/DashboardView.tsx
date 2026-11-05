import React from 'react';
import {
  Users,
  CheckCircle2,
  Megaphone,
  Clock,
  Send,
  AlertTriangle,
  Hourglass,
  Plus,
  FileUp,
  Download,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Activity,
  Play,
  RotateCw,
  Bell,
  UserCheck,
  Facebook,
  Instagram,
  XCircle,
} from 'lucide-react';
import {
  FacebookGroup,
  Campaign,
  PublishingTask,
  ActivityLog,
  AppSettings,
  MetaAccount,
  GroupNotification,
} from '../types';
import { formatDateTime } from '../utils/dateUtils';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  groups: FacebookGroup[];
  campaigns: Campaign[];
  tasks: PublishingTask[];
  logs: ActivityLog[];
  settings: AppSettings;
  isExtensionConnected: boolean;
  accounts: MetaAccount[];
  notifications: GroupNotification[];
  onNavigate: (tab: ActiveTab) => void;
  onRunTaskNow: (task: PublishingTask) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  groups,
  campaigns,
  tasks,
  logs,
  settings,
  isExtensionConnected,
  accounts,
  notifications,
  onNavigate,
  onRunTaskNow,
}) => {
  // Dynamic statistics
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status === 'active').length;
  const totalCampaigns = campaigns.length;
  const scheduledPosts = tasks.filter((t) => t.status === 'Scheduled').length;
  const successfullyPublished = tasks.filter((t) => t.status === 'Published').length;
  const failedPosts = tasks.filter((t) => t.status === 'Failed').length;
  const pendingPosts = tasks.filter(
    (t) => t.status === 'Scheduled' || t.status === 'Processing' || t.status === 'Paused'
  ).length;

  // Moderation status counts
  const approvedCount = notifications.filter((n) => n.status === 'live_approved').length;
  const pendingModerationCount = notifications.filter((n) => n.status === 'pending_approval').length;
  const declinedDeletedCount = notifications.filter(
    (n) => n.status === 'declined' || n.status === 'deleted_by_admin' || n.status === 'removed_by_system'
  ).length;

  const defaultAccount = accounts.find((a) => a.isDefault) || accounts[0];

  const upcomingTasks = tasks
    .filter((t) => t.status === 'Scheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const recentLogs = [...logs].slice(0, 6);
  const recentNotifications = [...notifications].slice(0, 4);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Hero Welcome */}
      <div className="bg-gradient-to-r from-[#111C2E] to-[#1a2c47] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold font-mono">
              Business Productivity Hub
            </span>
            <span className="text-slate-500 font-sans">·</span>
            <span className="text-xs text-slate-300">
              {settings.defaultTimezone} (UTC+6)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            TecTic Bd – Smart Group Publisher
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Centralized promotional distribution engine. Queue campaigns, automate group schedules via connected Facebook & Instagram IDs, and track live post approvals and deletions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('composer')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Campaign</span>
          </button>
          <button
            onClick={() => onNavigate('accounts')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Meta Accounts ({accounts.length})</span>
          </button>
        </div>
      </div>

      {/* 7 Required Metrics Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Groups */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Groups</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalGroups}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Permanent directory</div>
          </div>
        </div>

        {/* Active Groups */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Groups</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {activeGroups}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ready for campaign</div>
          </div>
        </div>

        {/* Total Campaigns */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Campaigns</span>
            <Megaphone className="w-4 h-4 text-[#527CE4]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalCampaigns}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Created batches</div>
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Scheduled</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-blue-600 tabular-nums">
              {scheduledPosts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Awaiting interval</div>
          </div>
        </div>

        {/* Published */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Published</span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {successfullyPublished}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Live on Facebook</div>
          </div>
        </div>

        {/* Failed Posts */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Failed</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
              {failedPosts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Requires retry</div>
          </div>
        </div>

        {/* Pending Posts */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Total</span>
            <Hourglass className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
              {pendingPosts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">In current queue</div>
          </div>
        </div>
      </div>

      {/* NEW META ACCOUNT & GROUP POST APPROVAL STATUS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Active Connected Meta Publisher */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-[#527CE4]" />
                <span>Connected Meta Account</span>
              </span>
              <button
                onClick={() => onNavigate('accounts')}
                className="text-xs text-[#527CE4] hover:underline font-semibold"
              >
                Switch / Manage
              </button>
            </div>

            {defaultAccount ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <img
                  src={defaultAccount.avatarUrl}
                  alt={defaultAccount.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="overflow-hidden min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {defaultAccount.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    @{defaultAccount.username}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Session Active · Auto-Publishing Identity</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-xs">
                No account connected. Connect Facebook/Instagram to start posting.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>{accounts.length} linked accounts</span>
            <span className="text-slate-600 font-medium">Auto-moderation ready</span>
          </div>
        </div>

        {/* Card 2: Group Post Approval Statuses */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Post Approvals & Moderation</span>
              </span>
              <button
                onClick={() => onNavigate('moderation')}
                className="text-xs text-[#527CE4] hover:underline font-semibold"
              >
                View Details
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-lg font-bold font-mono text-emerald-700">
                  {approvedCount}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Approved & Live
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-lg font-bold font-mono text-amber-700">
                  {pendingModerationCount}
                </div>
                <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                  Pending Review
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                <div className="text-lg font-bold font-mono text-rose-700">
                  {declinedDeletedCount}
                </div>
                <div className="text-[10px] text-rose-600 font-medium mt-0.5">
                  Declined / Deleted
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Facebook notifications checked</span>
            <button
              onClick={() => onNavigate('moderation')}
              className="text-blue-600 hover:underline font-medium text-[11px] flex items-center gap-1"
            >
              <span>Audit notifications</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Recent Group Notification Alert Feed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Latest Group Notifications
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Live Feed
              </span>
            </div>

            {recentNotifications.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                No notifications received yet.
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifications.slice(0, 2).map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                        {n.groupName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          n.status === 'live_approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : n.status === 'pending_approval'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {n.status === 'live_approved'
                          ? 'Approved'
                          : n.status === 'pending_approval'
                          ? 'Pending'
                          : 'Declined'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {n.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('moderation')}
            className="text-xs text-[#527CE4] hover:underline font-semibold flex items-center justify-between mt-3 pt-3 border-t border-slate-100"
          >
            <span>View all {notifications.length} alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Grid: Quick Actions & Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Quick Actions
            </h3>
            <span className="text-xs text-slate-500">Shortcuts</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onNavigate('composer')}
              className="p-3 rounded-lg border border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center text-[#527CE4] mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-800">New Campaign</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Compose & schedule</div>
            </button>

            <button
              onClick={() => onNavigate('accounts')}
              className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50 text-left transition-all group"
            >
              <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center text-[#1877F2] mb-2 group-hover:scale-105 transition-transform">
                <Facebook className="w-4 h-4 fill-[#1877F2]" />
              </div>
              <div className="text-xs font-semibold text-slate-800">Meta Accounts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Connect FB / IG</div>
            </button>

            <button
              onClick={() => onNavigate('moderation')}
              className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50 text-left transition-all group"
            >
              <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-105 transition-transform">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-800">Post Alerts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Approvals & deletes</div>
            </button>

            <button
              onClick={() => onNavigate('groups')}
              className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50 text-left transition-all group"
            >
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 mb-2 group-hover:scale-105 transition-transform">
                <FileUp className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-800">Bulk Import</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Paste group URLs</div>
            </button>
          </div>

          {/* Extension Status Callout */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-medium">
              <span className="text-slate-700">Automation Runner</span>
              <span
                className={`font-semibold ${
                  isExtensionConnected
                    ? 'text-emerald-600'
                    : settings.simulatedExtension
                    ? 'text-blue-600'
                    : 'text-amber-600'
                }`}
              >
                {isExtensionConnected
                  ? 'Chrome Connected'
                  : settings.simulatedExtension
                  ? 'In-Browser Simulation'
                  : 'Awaiting Extension'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When tasks reach their scheduled Dhaka time, the runner automatically submits posts using your connected Meta ID without manual copying.
            </p>
          </div>
        </div>

        {/* Recent Campaigns Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Recent Campaigns
                </h3>
                <p className="text-xs text-slate-500">Active distribution batches</p>
              </div>
              <button
                onClick={() => onNavigate('campaigns')}
                className="text-xs text-[#527CE4] hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View all campaigns
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentCampaigns.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No campaigns yet. Click "Create New Campaign" to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {recentCampaigns.map((camp) => {
                  const progress =
                    camp.totalTasks > 0
                      ? Math.round((camp.completedTasks / camp.totalTasks) * 100)
                      : 0;

                  return (
                    <div
                      key={camp.id}
                      className="p-3.5 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-900 truncate">
                            {camp.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{camp.groupIds.length} target groups</span>
                            <span>·</span>
                            <span>
                              {camp.scheduleMode === 'automatic'
                                ? `Auto (${camp.autoIntervalMinutes}m intervals)`
                                : 'Manual schedule'}
                            </span>
                            <span>·</span>
                            <span>{formatDateTime(camp.createdAt, settings.defaultTimezone)}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${
                              camp.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : camp.status === 'processing'
                                ? 'bg-blue-50 text-blue-700'
                                : camp.status === 'paused'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>
                            Progress: {camp.completedTasks} / {camp.totalTasks} published
                          </span>
                          <span className="font-semibold text-slate-700">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              camp.status === 'completed' ? 'bg-emerald-500' : 'bg-[#527CE4]'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Upcoming Scheduled Queue & Live Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Queue */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Upcoming Scheduled Tasks
              </h3>
              <p className="text-xs text-slate-500">Next posts in publication pipeline</p>
            </div>
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs text-[#527CE4] hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Full queue ({scheduledPosts})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No tasks currently scheduled in queue.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {task.groupName}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="truncate max-w-[180px]">{task.campaignName}</span>
                      <span>·</span>
                      <span className="font-mono text-blue-600 font-medium">
                        {formatDateTime(task.scheduledAt, settings.defaultTimezone)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onRunTaskNow(task)}
                      title="Run immediately"
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-[#527CE4] hover:text-white text-slate-700 rounded transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Post Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Publishing Activity
              </h3>
              <p className="text-xs text-slate-500">Live system audit trail</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-[#527CE4] hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Full history
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => {
              const isSuccess = log.type === 'task_published';
              const isFail = log.type === 'task_failed';
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isSuccess
                        ? 'bg-emerald-100 text-emerald-600'
                        : isFail
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-800 leading-snug">{log.message}</div>
                    {log.details && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{log.details}</div>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {formatDateTime(log.timestamp, settings.defaultTimezone)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
