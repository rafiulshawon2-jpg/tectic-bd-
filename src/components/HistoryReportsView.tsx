import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { PublishingTask } from '../types';
import { formatDateTime } from '../utils/dateUtils';
import { exportTasksToCsv } from '../utils/csvExport';

interface HistoryReportsViewProps {
  tasks: PublishingTask[];
  timeZone: string;
}

export const HistoryReportsView: React.FC<HistoryReportsViewProps> = ({
  tasks,
  timeZone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');

  // Filter options
  const campaignOptions = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.campaignName)));
  }, [tasks]);

  // Historical records: all tasks that have been executed, published, or failed
  const historyTasks = useMemo(() => {
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

  // Analytics Metrics
  const totalTasksCount = tasks.length;
  const publishedCount = tasks.filter((t) => t.status === 'Published').length;
  const failedCount = tasks.filter((t) => t.status === 'Failed').length;
  const successRate =
    totalTasksCount > 0 ? Math.round((publishedCount / totalTasksCount) * 100) : 100;

  const handleDownloadCsv = () => {
    exportTasksToCsv(
      historyTasks,
      `tectic_bd_publishing_history_${new Date().toISOString().slice(0, 10)}.csv`,
      timeZone
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Posting History & Analytics Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit logs of all executed promotional posts, timestamps, delivery receipts, and error analytics.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          disabled={historyTasks.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#527CE4] hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          <span>Export to CSV ({historyTasks.length})</span>
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
          <div className="text-[11px] text-slate-500 font-medium">Historical Records</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {totalTasksCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">All created tasks</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
          <div className="text-[11px] text-emerald-600 font-medium">Successfully Published</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {publishedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Confirmed on Facebook</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
          <div className="text-[11px] text-rose-600 font-medium">Failed Attempts</div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {failedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Rate throttled or blocked</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
          <div className="text-[11px] text-blue-600 font-medium">Success Rate</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {successRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Delivery reliability</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by group, campaign, or task ID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none max-w-[200px] truncate"
          >
            <option value="all">All Campaigns</option>
            {campaignOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Task ID</th>
                <th className="py-3.5 px-3">Campaign</th>
                <th className="py-3.5 px-3">Facebook Group</th>
                <th className="py-3.5 px-3">Scheduled Time</th>
                <th className="py-3.5 px-3">Actual Published Time</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Retry Count</th>
                <th className="py-3.5 pr-4 pl-3">Post Link / Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No records found matching filters</p>
                  </td>
                </tr>
              ) : (
                historyTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {t.id}
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-900 max-w-[160px] truncate">
                      {t.campaignName}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 max-w-[180px] truncate">
                        {t.groupName}
                      </div>
                      <a
                        href={t.groupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-[10px] font-mono flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[160px]">{t.groupUrl}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {formatDateTime(t.scheduledAt, timeZone)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {t.executedAt ? formatDateTime(t.executedAt, timeZone) : '—'}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                          t.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : t.status === 'Failed'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500">
                      {t.retryCount || 0}
                    </td>

                    <td className="py-3 pr-4 pl-3">
                      {t.fbPostUrl ? (
                        <a
                          href={t.fbPostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline font-medium text-[11px] flex items-center gap-1"
                        >
                          <span>Confirmed Post</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : t.errorMessage ? (
                        <span className="text-rose-600 text-[11px] max-w-xs truncate block" title={t.errorMessage}>
                          {t.errorMessage}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
