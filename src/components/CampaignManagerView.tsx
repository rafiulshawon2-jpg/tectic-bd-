import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  XCircle,
  Eye,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  ExternalLink,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Campaign, PublishingTask } from '../types';
import { storageService } from '../services/storage';
import { formatDateTime } from '../utils/dateUtils';
import { exportTasksToCsv } from '../utils/csvExport';
import { ActiveTab } from './Sidebar';

interface CampaignManagerViewProps {
  campaigns: Campaign[];
  tasks: PublishingTask[];
  timeZone: string;
  onNavigate: (tab: ActiveTab) => void;
}

export const CampaignManagerView: React.FC<CampaignManagerViewProps> = ({
  campaigns,
  tasks,
  timeZone,
  onNavigate,
}) => {
  const [selectedCampaignForDetails, setSelectedCampaignForDetails] = useState<Campaign | null>(null);

  const handlePause = (camp: Campaign) => {
    storageService.updateCampaignStatus(camp.id, 'paused');
  };

  const handleResume = (camp: Campaign) => {
    storageService.updateCampaignStatus(camp.id, 'scheduled');
  };

  const handleCancel = (camp: Campaign) => {
    if (confirm(`Cancel campaign "${camp.name}" and all its pending tasks?`)) {
      storageService.updateCampaignStatus(camp.id, 'cancelled');
    }
  };

  const handleDuplicate = (camp: Campaign) => {
    storageService.duplicateCampaign(camp.id);
  };

  const handleDelete = (camp: Campaign) => {
    if (confirm(`Permanently delete campaign "${camp.name}" and remove all its tasks?`)) {
      storageService.deleteCampaign(camp.id);
      if (selectedCampaignForDetails?.id === camp.id) {
        setSelectedCampaignForDetails(null);
      }
    }
  };

  const handleExportCampaignCsv = (camp: Campaign) => {
    const campTasks = tasks.filter((t) => t.campaignId === camp.id);
    exportTasksToCsv(
      campTasks,
      `${camp.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_tasks.csv`,
      timeZone
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Campaign Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee all scheduled, active, and completed promotional campaigns and their group task distributions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('composer')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-sm text-xs">
          <Megaphone className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No campaigns created yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Create your first promotional campaign to begin publishing across your Facebook groups.
          </p>
          <button
            onClick={() => onNavigate('composer')}
            className="px-4 py-2 bg-[#527CE4] text-white rounded-lg font-semibold"
          >
            Create First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map((camp) => {
            const progress =
              camp.totalTasks > 0
                ? Math.round((camp.completedTasks / camp.totalTasks) * 100)
                : 0;

            const campTasks = tasks.filter((t) => t.campaignId === camp.id);

            return (
              <div
                key={camp.id}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Row: Name and Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {camp.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Created {formatDateTime(camp.createdAt, timeZone)}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-600">
                          {camp.scheduleMode === 'automatic'
                            ? `Every ${camp.autoIntervalMinutes}m`
                            : 'Manual intervals'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded capitalize shrink-0 ${
                        camp.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : camp.status === 'processing'
                          ? 'bg-blue-50 text-blue-700'
                          : camp.status === 'paused'
                          ? 'bg-amber-50 text-amber-700'
                          : camp.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  {/* Caption snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {camp.caption}
                  </p>

                  {/* 6-Metric Coverage Breakdown */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1 text-center">
                    <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-100">
                      <div className="text-xs font-bold text-slate-800 font-mono">
                        {camp.totalTasks}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">Total Groups</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-1.5 border border-emerald-100">
                      <div className="text-xs font-bold text-emerald-700 font-mono">
                        {camp.completedTasks}
                      </div>
                      <div className="text-[9px] text-emerald-700 truncate font-semibold">Published</div>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-1.5 border border-rose-100">
                      <div className="text-xs font-bold text-rose-700 font-mono">
                        {camp.failedTasks}
                      </div>
                      <div className="text-[9px] text-rose-700 truncate font-semibold">Failed</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-1.5 border border-purple-100">
                      <div className="text-xs font-bold text-purple-700 font-mono">
                        {camp.skippedTasks || 0}
                      </div>
                      <div className="text-[9px] text-purple-700 truncate font-semibold">Skipped</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-1.5 border border-blue-100">
                      <div className="text-xs font-bold text-blue-700 font-mono">
                        {camp.pendingTasks}
                      </div>
                      <div className="text-[9px] text-blue-700 truncate">Pending</div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-1.5 border border-amber-100">
                      <div className="text-xs font-bold text-amber-700 font-mono">
                        {camp.verificationRequiredTasks || 0}
                      </div>
                      <div className="text-[9px] text-amber-700 truncate font-semibold">Verify Req.</div>
                    </div>
                  </div>

                  {/* Progress & Accurate Success Rate */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Execution Progress ({progress}%)</span>
                      <span className="font-semibold text-emerald-700">
                        Success Rate: {camp.completedTasks + camp.failedTasks > 0
                          ? Math.round((camp.completedTasks / (camp.completedTasks + camp.failedTasks)) * 100)
                          : 100}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          camp.status === 'completed'
                            ? 'bg-emerald-500'
                            : camp.status === 'paused'
                            ? 'bg-amber-400'
                            : 'bg-[#527CE4]'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedCampaignForDetails(camp)}
                    className="flex items-center gap-1 font-semibold text-[#527CE4] hover:text-blue-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Tasks ({campTasks.length})</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {camp.status === 'paused' ? (
                      <button
                        onClick={() => handleResume(camp)}
                        title="Resume campaign"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    ) : camp.status === 'scheduled' || camp.status === 'processing' ? (
                      <button
                        onClick={() => handlePause(camp)}
                        title="Pause campaign"
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded"
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleDuplicate(camp)}
                      title="Duplicate campaign"
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleExportCampaignCsv(camp)}
                      title="Export CSV report"
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(camp)}
                      title="Delete campaign"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Campaign Details Modal */}
      {selectedCampaignForDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200 text-xs">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedCampaignForDetails.name}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Detailed task distribution and post copy
                </span>
              </div>
              <button
                onClick={() => setSelectedCampaignForDetails(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {/* Post Caption Box */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                  Post Caption
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap text-slate-800 leading-relaxed font-sans max-h-40 overflow-y-auto">
                  {selectedCampaignForDetails.caption}
                </div>
              </div>

              {/* Tasks List Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Associated Group Tasks ({selectedCampaignForDetails.groupIds.length})
                  </label>
                  <button
                    onClick={() => handleExportCampaignCsv(selectedCampaignForDetails)}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    <span>Export Tasks to CSV</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Facebook Group</th>
                        <th className="py-2.5 px-3">Scheduled</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tasks
                        .filter((t) => t.campaignId === selectedCampaignForDetails.id)
                        .map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-900 truncate max-w-xs">
                              {t.groupName}
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                              {formatDateTime(t.scheduledAt, timeZone)}
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                                  t.status === 'Published'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : t.status === 'Processing'
                                    ? 'bg-amber-50 text-amber-800'
                                    : t.status === 'Failed'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              {t.fbPostUrl ? (
                                <a
                                  href={t.fbPostUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-[11px] flex items-center justify-end gap-1"
                                >
                                  <span>Post</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCampaignForDetails(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
