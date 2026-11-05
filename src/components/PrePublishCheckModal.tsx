import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  XCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowRight,
  X,
} from 'lucide-react';
import { PrePublishReport, PrePublishGroupResult, PrePublishStatus } from '../types';

interface PrePublishCheckModalProps {
  report: PrePublishReport;
  onConfirm: (eligibleGroupIds: string[]) => void;
  onCancel: () => void;
  metaAccountName?: string;
}

export const PrePublishCheckModal: React.FC<PrePublishCheckModalProps> = ({
  report,
  onConfirm,
  onCancel,
  metaAccountName,
}) => {
  // Selected IDs among all groups checked (user can uncheck risky groups)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // By default, select all except access_unavailable
    const initial = new Set<string>();
    report.groups.forEach((g) => {
      if (g.status !== 'access_unavailable') {
        initial.add(g.groupId);
      }
    });
    return initial;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | PrePublishStatus>('all');

  const filteredGroups = report.groups.filter((g) => {
    if (activeFilter === 'all') return true;
    return g.status === activeFilter;
  });

  const toggleGroup = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectOnlyReady = () => {
    const next = new Set<string>();
    report.groups.forEach((g) => {
      if (g.status === 'ready') {
        next.add(g.groupId);
      }
    });
    setSelectedIds(next);
  };

  const selectAllSafe = () => {
    const next = new Set<string>();
    report.groups.forEach((g) => {
      if (g.status !== 'access_unavailable') {
        next.add(g.groupId);
      }
    });
    setSelectedIds(next);
  };

  const getStatusBadge = (status: PrePublishStatus) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Ready to Publish
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Posting Restricted / Admin Moderated
          </span>
        );
      case 'requires_attention':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
            <HelpCircle className="w-3 h-3 text-orange-600" />
            Requires Attention
          </span>
        );
      case 'access_unavailable':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            Access Unavailable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
            Unable to Verify
          </span>
        );
    }
  };

  const readyTotal = report.readyCount;
  const restrictedTotal = report.restrictedCount;
  const attentionTotal = report.requiresAttentionCount;
  const unavailableTotal = report.unavailableCount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#527CE4]/20 text-[#527CE4]">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                Pre-Publish Verification Audit
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Verified {report.totalChecked} selected groups using connected identity:{' '}
              <span className="text-blue-300 font-semibold">{metaAccountName || 'Connected Profile'}</span>
            </p>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveFilter(activeFilter === 'ready' ? 'all' : 'ready')}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeFilter === 'ready'
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-700">Ready to Publish</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{readyTotal}</div>
            <div className="text-[10px] text-emerald-600">Full posting access</div>
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'restricted' ? 'all' : 'restricted')}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeFilter === 'restricted'
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-700">Posting Restricted</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-700 mt-1">{restrictedTotal}</div>
            <div className="text-[10px] text-amber-600">Admin review required</div>
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'requires_attention' ? 'all' : 'requires_attention')}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeFilter === 'requires_attention'
                ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-400/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-orange-700">Requires Attention</span>
              <HelpCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-xl font-bold font-mono text-orange-700 mt-1">{attentionTotal}</div>
            <div className="text-[10px] text-orange-600">Inactive or missing info</div>
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'access_unavailable' ? 'all' : 'access_unavailable')}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeFilter === 'access_unavailable'
                ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20 shadow-xs'
                : 'bg-white border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-700">Access Unavailable</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-700 mt-1">{unavailableTotal}</div>
            <div className="text-[10px] text-rose-600">Auto-excluded by default</div>
          </button>
        </div>

        {/* Quick Selection Actions Strip */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-slate-600">
            Selected for campaign: <span className="font-bold text-slate-900">{selectedIds.size}</span> of{' '}
            {report.totalChecked} groups
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectOnlyReady}
              className="px-2.5 py-1 text-[11px] rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium"
            >
              Select Only Ready ({readyTotal})
            </button>
            <button
              onClick={selectAllSafe}
              className="px-2.5 py-1 text-[11px] rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium"
            >
              Select All Eligible ({readyTotal + restrictedTotal + attentionTotal})
            </button>
          </div>
        </div>

        {/* Detailed Group Audit Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
          {filteredGroups.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No groups match the current category filter.
            </div>
          ) : (
            filteredGroups.map((grp) => {
              const isChecked = selectedIds.has(grp.groupId);
              const isBlocked = grp.status === 'access_unavailable';

              return (
                <div
                  key={grp.groupId}
                  className={`py-3 flex items-start gap-3 transition-colors ${
                    !isChecked ? 'opacity-50 bg-slate-50/50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isBlocked}
                    onChange={() => toggleGroup(grp.groupId)}
                    className="mt-1 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs truncate max-w-md">
                        {grp.groupName}
                      </span>
                      {getStatusBadge(grp.status)}
                    </div>

                    <a
                      href={grp.groupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                    >
                      <span className="truncate max-w-sm">{grp.groupUrl}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>

                    {grp.issues.length > 0 && (
                      <div className="mt-1.5 space-y-0.5">
                        {grp.issues.map((issue, idx) => (
                          <div key={idx} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {selectedIds.size === 0 ? (
              <span className="text-rose-600 font-semibold">Select at least one group to start campaign.</span>
            ) : (
              <span>
                Campaign will publish sequentially with anti-rate-limit spacing across{' '}
                <strong className="text-slate-900">{selectedIds.size} groups</strong>.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
            >
              Back to Composer
            </button>
            <button
              disabled={selectedIds.size === 0}
              onClick={() => onConfirm(Array.from(selectedIds))}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Confirm & Launch Campaign ({selectedIds.size})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
