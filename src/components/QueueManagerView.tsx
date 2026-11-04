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

  // Extract unique campaign names for filter
  const campaignNames = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.campaignName)));
  }, [tasks]);

  // Counts
  const totalCount = tasks.length;
  const scheduledCount = tasks.filter((t) => t.status === 'Scheduled').length;
  const processingCount = tasks.filter((t) => t.status === 'Processing').length;
  const publishedCount = tasks.filter((t) => t.status === 'Published').length;
  const failedCount = tasks.filter((t) => t.status === 'Failed').length;
  const pausedCount = tasks.filter((t) => t.status === 'Paused').length;

  const isGlobalPaused = pausedCount > 0 && scheduledCount === 0;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : t.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesCampaign =
        campaignFilter === 'all' ? true : t.campaignName === campaignFilter;
      return matchesSearch && matchesStatus && matchesCampaign;
    });
  }, [tasks, searchQuery, statusFilter, campaignFilter]);

  const handleOpenReschedule = (task: PublishingTask) => {
    setRescheduleModalTask(task);
    // Format to local date-time string
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

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Global Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Campaign Publishing Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time task execution across all target Facebook groups without leaving the dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isGlobalPaused ? (
            <button
              onClick={() => storageService.resumeAllTasks()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Resume Queue</span>
            </button>
          ) : (
            <button
              onClick={() => storageService.pauseAllTasks()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
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
          onClick={() => setStatusFilter('processing')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'processing'
              ? 'bg-white border-amber-500 ring-1 ring-amber-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-amber-600 font-medium">Processing</div>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1">{processingCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter('published')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'published'
              ? 'bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-emerald-600 font-medium">Published</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">{publishedCount}</div>
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

        <button
          onClick={() => setStatusFilter('paused')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'paused'
              ? 'bg-white border-slate-400 ring-1 ring-slate-400 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] text-slate-500 font-medium">Paused</div>
          <div className="text-xl font-bold font-mono text-slate-600 mt-1">{pausedCount}</div>
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
            placeholder="Search by group name, campaign, or task ID..."
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
                <th className="py-3.5 px-4">Task ID</th>
                <th className="py-3.5 px-3">Facebook Group</th>
                <th className="py-3.5 px-3">Campaign</th>
                <th className="py-3.5 px-3">Scheduled Time ({timeZone})</th>
                <th className="py-3.5 px-3">Current Status</th>
                <th className="py-3.5 px-3">Retries / Details</th>
                <th className="py-3.5 pr-4 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ListOrdered className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No tasks match your filter</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isProcessing =
                    task.id === activeProcessingTaskId || task.status === 'Processing';

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isProcessing ? 'bg-blue-50/40 animate-pulse' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {task.id}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 max-w-[200px] truncate">
                          {task.groupName}
                        </div>
                        <a
                          href={task.groupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-[10px] font-mono flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate max-w-[180px]">{task.groupUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700 max-w-[180px] truncate">
                          {task.campaignName}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-700 text-[11px]">
                        <div>{formatDateTime(task.scheduledAt, timeZone)}</div>
                        {task.executedAt && (
                          <div className="text-[10px] text-slate-400">
                            Done: {formatDateTime(task.executedAt, timeZone)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                            task.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : task.status === 'Processing'
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
                      </td>

                      <td className="py-3 px-3 text-[11px] text-slate-500">
                        {task.status === 'Failed' && task.errorMessage ? (
                          <div className="text-rose-600 max-w-xs truncate font-medium">
                            {task.errorMessage} (Retries: {task.retryCount})
                          </div>
                        ) : task.fbPostUrl ? (
                          <a
                            href={task.fbPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <span>View Live Post</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-mono">
                            Retries: {task.retryCount || 0}
                          </span>
                        )}
                      </td>

                      <td className="py-3 pr-4 pl-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {task.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => onRunTaskNow(task)}
                                title="Run this task right now"
                                className="px-2 py-1 bg-slate-100 hover:bg-[#527CE4] hover:text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                              >
                                <Play className="w-3 h-3" />
                                <span>Run</span>
                              </button>
                              <button
                                onClick={() => handleOpenReschedule(task)}
                                title="Reschedule time"
                                className="px-2 py-1 border border-slate-200 hover:bg-slate-50 rounded text-[11px] font-medium text-slate-600"
                              >
                                Edit Time
                              </button>
                              <button
                                onClick={() => storageService.cancelTask(task.id)}
                                title="Cancel task"
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {task.status === 'Failed' && (
                            <button
                              onClick={() => storageService.retryTask(task.id)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-medium flex items-center gap-1"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Retry Task</span>
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
