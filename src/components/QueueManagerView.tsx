import React, { useState, useMemo } from 'react';
import {
  ListOrdered,
  Search,
  Filter,
  Play,
  RotateCw,
  Pause,
  PlayCircle,
  XCircle,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  HelpCircle,
  FastForward,
} from 'lucide-react';
import { PublishingTask, TaskStatus } from '../types';
import { storageService } from '../services/storage';
import { formatDateTime } from '../utils/dateUtils';

interface QueueManagerViewProps {
  tasks: PublishingTask[];
  timeZone: string;
  onRunTaskNow: (task: PublishingTask) => void;
  activeProcessingTaskId: string | null;
}

export const QueueManagerView: React.FC<QueueManagerViewProps> = ({
  tasks,
  timeZone,
  onRunTaskNow,
  activeProcessingTaskId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [rescheduleModalTask, setRescheduleModalTask] = useState<PublishingTask | null>(null);
  const [newScheduleIso, setNewScheduleIso] = useState<string>('');
  const [copiedUrlTaskId, setCopiedUrlTaskId] = useState<string | null>(null);

  // Extract unique campaign names for filter
  const campaignNames = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.campaignName)));
  }, [tasks]);

  // Counts
  const totalCount = tasks.length;
  const scheduledCount = tasks.filter((t) => t.status === 'Scheduled').length;
  const processingCount = tasks.filter((t) => t.status === 'Processing').length;
  const publishedWithLinkCount = tasks.filter(
    (t) => t.status === 'Published' && Boolean(t.fbPostUrl)
  ).length;
  const linkUnavailableCount = tasks.filter(
    (t) => t.status === 'Post Link Unavailable' || (t.status === 'Published' && !t.fbPostUrl)
  ).length;
  const verificationRequiredCount = tasks.filter(
    (t) => t.status === 'Verification Required'
  ).length;
  const skippedCount = tasks.filter((t) => t.status === 'Skipped').length;
  const failedCount = tasks.filter((t) => t.status === 'Failed').length;
  const pausedCount = tasks.filter((t) => t.status === 'Paused').length;

  const isGlobalPaused = pausedCount > 0 && scheduledCount === 0;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.metaAccountName && t.metaAccountName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.fbPostUrl && t.fbPostUrl.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'published_with_link') {
          matchesStatus = t.status === 'Published' && Boolean(t.fbPostUrl);
        } else if (statusFilter === 'link_unavailable') {
          matchesStatus = t.status === 'Post Link Unavailable' || (t.status === 'Published' && !t.fbPostUrl);
        } else {
          matchesStatus = t.status.toLowerCase() === statusFilter.toLowerCase();
        }
      }

      const matchesCampaign =
        campaignFilter === 'all' ? true : t.campaignName === campaignFilter;

      return matchesSearch && matchesStatus && matchesCampaign;
    });
  }, [tasks, searchQuery, statusFilter, campaignFilter]);

  const handleCopyUrl = (taskId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlTaskId(taskId);
    setTimeout(() => setCopiedUrlTaskId(null), 1500);
  };

  const handleOpenReschedule = (task: PublishingTask) => {
    setRescheduleModalTask(task);
    const d = new Date(task.scheduledAt);
    const pad = (n: number) => n.toString().padStart(2, '0');
    setNewScheduleIso(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}`
    );
  };

  const handleSaveReschedule = () => {
    if (!rescheduleModalTask || !newScheduleIso) return;
    const iso = new Date(newScheduleIso).toISOString();
    storageService.updateTask(rescheduleModalTask.id, {
      scheduledAt: iso,
      status: 'Scheduled',
    });
    setRescheduleModalTask(null);
  };

  const handleManualResolveVerification = (task: PublishingTask, confirmed: boolean) => {
    if (confirmed) {
      const manualUrl = prompt(
        'Paste the confirmed Facebook post URL (or leave blank if post is live but URL unavailable):',
        task.groupUrl + '/posts/confirmed'
      );
      if (manualUrl && manualUrl.includes('facebook.com')) {
        storageService.updateTask(task.id, {
          status: 'Published',
          fbPostUrl: manualUrl.trim(),
          verifiedAt: new Date().toISOString(),
          verificationNotes: 'Manually verified by operator.',
        });
      } else {
        storageService.updateTask(task.id, {
          status: 'Post Link Unavailable',
          verifiedAt: new Date().toISOString(),
          verificationNotes: 'Confirmed published by operator without external URL.',
        });
      }
    } else {
      storageService.updateTask(task.id, {
        status: 'Failed',
        errorMessage: 'Verification check failed: post was not located on Facebook group feed.',
      });
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Global Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Campaign Publishing Queue & Post Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every published post records verified links, connected Meta accounts, and live [VIEW POST] actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isGlobalPaused ? (
            <button
              onClick={() => storageService.resumeAllTasks()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Resume Queue</span>
            </button>
          ) : (
            <button
              onClick={() => storageService.pauseAllTasks()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Status Strip with Verified Link Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-white border-[#527CE4] ring-1 ring-[#527CE4] shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-slate-500">All Tasks</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">{totalCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('published_with_link')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'published_with_link'
              ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Success [Link]</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{publishedWithLinkCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('scheduled')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'scheduled'
              ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-blue-600 font-medium">Scheduled</div>
          <div className="text-xl font-bold font-mono text-blue-600 mt-1">{scheduledCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('link_unavailable')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'link_unavailable'
              ? 'bg-slate-100 border-slate-400 ring-1 ring-slate-400 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-slate-600 font-medium">Link Unavailable</div>
          <div className="text-xl font-bold font-mono text-slate-700 mt-1">{linkUnavailableCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('verification required')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'verification required'
              ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Verify Required</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">{verificationRequiredCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('skipped')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'skipped'
              ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-purple-700 font-medium flex items-center gap-1">
            <FastForward className="w-3 h-3 text-purple-600" />
            <span>Skipped</span>
          </div>
          <div className="text-xl font-bold font-mono text-purple-700 mt-1">{skippedCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('failed')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'failed'
              ? 'bg-white border-rose-500 ring-1 ring-rose-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-rose-600 font-medium">Failed</div>
          <div className="text-xl font-bold font-mono text-rose-600 mt-1">{failedCount}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by group name, campaign, account, or verified post URL..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Campaigns</option>
            {campaignNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Task / Identity</th>
                <th className="py-3.5 px-3">Facebook Group</th>
                <th className="py-3.5 px-3">Publishing Status</th>
                <th className="py-3.5 px-3">Verified Post Details</th>
                <th className="py-3.5 px-3">Schedule / Execution ({timeZone})</th>
                <th className="py-3.5 pr-4 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ListOrdered className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No tasks match your filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isProcessing =
                    task.id === activeProcessingTaskId || task.status === 'Processing';
                  const hasVerifiedPost =
                    task.status === 'Published' && Boolean(task.fbPostUrl);

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isProcessing ? 'bg-blue-50/40 animate-pulse' : ''
                      }`}
                    >
                      {/* Task ID & Account */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] text-slate-500 font-semibold">
                          {task.id}
                        </div>
                        <div className="text-[10px] text-blue-700 font-medium truncate mt-0.5">
                          Account: {task.metaAccountName || 'TecTic Bd (Official Admin)'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          Campaign: {task.campaignName}
                        </div>
                      </td>

                      {/* Group Name & URL */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 max-w-[210px] truncate">
                          {task.groupName}
                        </div>
                        <a
                          href={task.groupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-blue-600 text-[10px] font-mono flex items-center gap-1 mt-0.5 truncate max-w-[200px]"
                        >
                          <span className="truncate">{task.groupUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </td>

                      {/* Publishing Status Badge */}
                      <td className="py-3.5 px-3">
                        {hasVerifiedPost ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-bold text-[11px] bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              SUCCESS
                            </span>
                          </div>
                        ) : task.status === 'Post Link Unavailable' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-300">
                              SUCCESS — POST LINK UNAVAILABLE
                            </span>
                            <div className="text-[10px] text-slate-500">
                              Post published; direct URL inaccessible
                            </div>
                          </div>
                        ) : task.status === 'Verification Required' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              VERIFICATION REQUIRED
                            </span>
                            <div className="text-[10px] text-amber-700">
                              Result ambiguous; auto-publishing paused
                            </div>
                          </div>
                        ) : task.status === 'Skipped' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-purple-100 text-purple-800">
                              <FastForward className="w-3 h-3 text-purple-600" />
                              SKIPPED
                            </span>
                            <div className="text-[10px] text-purple-700 truncate max-w-[150px]">
                              Inaccessible / restricted
                            </div>
                          </div>
                        ) : (
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                              task.status === 'Processing'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : task.status === 'Scheduled'
                                ? 'bg-blue-50 text-blue-700'
                                : task.status === 'Failed'
                                ? 'bg-rose-50 text-rose-700'
                                : task.status === 'Paused'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.status}
                          </span>
                        )}

                        {/* Moderation Tag */}
                        {task.moderationStatus && (
                          <div
                            className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded w-fit ${
                              task.moderationStatus === 'live_approved'
                                ? 'bg-emerald-50 text-emerald-800'
                                : task.moderationStatus === 'pending_approval'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {task.moderationStatus === 'live_approved'
                              ? '✓ Feed Approved'
                              : task.moderationStatus === 'pending_approval'
                              ? '⏳ Pending Review'
                              : '✗ Moderated Out'}
                          </div>
                        )}
                      </td>

                      {/* Verified Post Details & VIEW POST Button */}
                      <td className="py-3.5 px-3">
                        {hasVerifiedPost && task.fbPostUrl ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={task.fbPostUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-xs transition-colors"
                              >
                                <span>VIEW POST</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>

                              <button
                                onClick={() => handleCopyUrl(task.id, task.fbPostUrl!)}
                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                title="Copy verified post link"
                              >
                                {copiedUrlTaskId === task.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[220px]" title={task.fbPostUrl}>
                              {task.fbPostUrl}
                            </div>
                          </div>
                        ) : task.status === 'Post Link Unavailable' ? (
                          <div className="text-[11px] text-slate-500 max-w-xs">
                            <span className="text-slate-600 italic">
                              Published successfully. Direct URL could not be verified by browser engine.
                            </span>
                          </div>
                        ) : task.status === 'Verification Required' ? (
                          <div className="space-y-1 max-w-xs">
                            <p className="text-[11px] text-amber-800">
                              {task.verificationNotes || 'Post outcome pending confirmation.'}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5">
                              <button
                                onClick={() => handleManualResolveVerification(task, true)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold"
                              >
                                Confirm Live
                              </button>
                              <button
                                onClick={() => handleManualResolveVerification(task, false)}
                                className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-medium"
                              >
                                Mark Failed
                              </button>
                            </div>
                          </div>
                        ) : task.status === 'Failed' && task.errorMessage ? (
                          <div className="text-rose-600 max-w-xs truncate font-medium text-[11px]">
                            {task.errorMessage} (Retries: {task.retryCount})
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            Retries: {task.retryCount || 0}
                          </span>
                        )}
                      </td>

                      {/* Scheduled / Executed Time */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 text-[11px]">
                        <div>{formatDateTime(task.scheduledAt, timeZone)}</div>
                        {task.executedAt && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Published: {formatDateTime(task.executedAt, timeZone)}
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 pr-4 pl-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {task.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => onRunTaskNow(task)}
                                title="Run this task right now"
                                className="px-2 py-1 bg-slate-100 hover:bg-[#527CE4] hover:text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3" />
                                <span>Run</span>
                              </button>
                              <button
                                onClick={() => handleOpenReschedule(task)}
                                title="Reschedule time"
                                className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded text-[11px] font-medium text-slate-600 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => storageService.cancelTask(task.id)}
                                title="Cancel task"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {task.status === 'Failed' && (
                            <button
                              onClick={() => storageService.retryTask(task.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Retry</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalTask && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4 border border-slate-200 text-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Reschedule Publishing Task
            </h3>
            <p className="text-slate-500">
              Target Group: <span className="font-semibold text-slate-800">{rescheduleModalTask.groupName}</span>
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                New Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                value={newScheduleIso}
                onChange={(e) => setNewScheduleIso(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setRescheduleModalTask(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-4 py-1.5 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg font-semibold"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
