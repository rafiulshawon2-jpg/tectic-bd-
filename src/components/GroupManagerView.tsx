import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  FileUp,
  Search,
  Filter,
  CheckSquare,
  Square,
  Trash2,
  ExternalLink,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Tag,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { FacebookGroup } from '../types';
import { storageService } from '../services/storage';
import { formatDateTime } from '../utils/dateUtils';

interface GroupManagerViewProps {
  groups: FacebookGroup[];
  timeZone: string;
}

export const GroupManagerView: React.FC<GroupManagerViewProps> = ({
  groups,
  timeZone,
}) => {
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FacebookGroup | null>(null);

  // Manual Add Form State
  const [manualName, setManualName] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualCategory, setManualCategory] = useState('Technology & IT');
  const [manualDesc, setManualDesc] = useState('');
  const [manualStatus, setManualStatus] = useState<'active' | 'inactive'>('active');
  const [manualFormError, setManualFormError] = useState<string | null>(null);

  // Bulk Import Form State
  const [bulkUrlsText, setBulkUrlsText] = useState('');
  const [bulkCategory, setBulkCategory] = useState('General Business');
  const [bulkResult, setBulkResult] = useState<{
    importedCount: number;
    duplicateCount: number;
    invalidCount: number;
    errors: { line: number; rawUrl: string; reason: string }[];
  } | null>(null);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set(groups.map((g) => g.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [groups]);

  // Filtered groups
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : g.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' ? true : g.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [groups, searchQuery, statusFilter, categoryFilter]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedGroupIds.size === filteredGroups.length && filteredGroups.length > 0) {
      setSelectedGroupIds(new Set());
    } else {
      setSelectedGroupIds(new Set(filteredGroups.map((g) => g.id)));
    }
  };

  const handleToggleGroup = (id: string) => {
    const next = new Set(selectedGroupIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedGroupIds(next);
  };

  // Add Single Group Submit
  const handleSaveManualGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setManualFormError(null);

    const trimmedUrl = manualUrl.trim();
    if (!trimmedUrl) {
      setManualFormError('Facebook Group URL is required.');
      return;
    }

    if (!trimmedUrl.includes('facebook.com/groups/') && !trimmedUrl.includes('fb.com/groups/')) {
      setManualFormError('Please enter a valid Facebook Group URL (e.g. https://www.facebook.com/groups/yourgroup)');
      return;
    }

    const trimmedName = manualName.trim() || 'FB Group ' + Math.floor(Math.random() * 1000);

    if (editingGroup) {
      storageService.updateGroup(editingGroup.id, {
        name: trimmedName,
        url: trimmedUrl,
        category: manualCategory,
        description: manualDesc,
        status: manualStatus,
      });
      setEditingGroup(null);
    } else {
      storageService.addGroup({
        name: trimmedName,
        url: trimmedUrl,
        category: manualCategory,
        description: manualDesc,
        status: manualStatus,
      });
    }

    // Reset form
    setManualName('');
    setManualUrl('');
    setManualDesc('');
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleStartEdit = (group: FacebookGroup) => {
    setEditingGroup(group);
    setManualName(group.name);
    setManualUrl(group.url);
    setManualCategory(group.category);
    setManualDesc(group.description || '');
    setManualStatus(group.status);
    setIsAddModalOpen(true);
  };

  // Bulk Import Submit
  const handleRunBulkImport = () => {
    if (!bulkUrlsText.trim()) return;

    const result = storageService.bulkImportGroups(bulkUrlsText, bulkCategory);
    setBulkResult({
      importedCount: result.importedCount,
      duplicateCount: result.duplicateCount,
      invalidCount: result.invalidCount,
      errors: result.errors,
    });

    if (result.importedCount > 0 && result.errors.length === 0) {
      setTimeout(() => {
        setIsBulkModalOpen(false);
        setBulkUrlsText('');
        setBulkResult(null);
      }, 1800);
    }
  };

  // Bulk Actions on Selected
  const handleBulkDelete = () => {
    if (selectedGroupIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedGroupIds.size} selected Facebook groups?`)) {
      selectedGroupIds.forEach((id) => storageService.deleteGroup(id));
      setSelectedGroupIds(new Set());
    }
  };

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    selectedGroupIds.forEach((id) => storageService.updateGroup(id, { status }));
    setSelectedGroupIds(new Set());
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Facebook Group Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain your permanent repository of promotional Facebook Groups, categories, and target audiences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingGroup(null);
              setManualName('');
              setManualUrl('');
              setManualDesc('');
              setManualFormError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Group</span>
          </button>

          <button
            onClick={() => {
              setBulkResult(null);
              setBulkUrlsText('');
              setIsBulkModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <FileUp className="w-4 h-4 text-slate-500" />
            <span>Bulk Import URLs</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups by name or URL..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Controls (Segmented Tabs & Dropdown) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Status Segmented Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              {(['all', 'active', 'inactive'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Selection Action Bar (appears when items are selected) */}
        {selectedGroupIds.size > 0 && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900 animate-fadeIn">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#527CE4]" />
              <span>
                {selectedGroupIds.size} group{selectedGroupIds.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('active')}
                className="px-2.5 py-1 bg-white border border-blue-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded text-xs font-medium"
              >
                Set Active
              </button>
              <button
                onClick={() => handleBulkStatusChange('inactive')}
                className="px-2.5 py-1 bg-white border border-blue-200 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium"
              >
                Set Inactive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded text-xs font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 pl-4 pr-2 w-10">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-slate-500 hover:text-slate-700"
                    title={
                      selectedGroupIds.size === filteredGroups.length
                        ? 'Deselect All'
                        : 'Select All'
                    }
                  >
                    {selectedGroupIds.size === filteredGroups.length &&
                    filteredGroups.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#527CE4]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3">Group Name</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Facebook URL</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Date Added</th>
                <th className="py-3.5 pr-4 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No Facebook Groups found</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {searchQuery
                        ? 'Try adjusting your search or filters.'
                        : 'Add groups manually or use Bulk Import to get started.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => {
                  const isSelected = selectedGroupIds.has(group.id);
                  return (
                    <tr
                      key={group.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2">
                        <button
                          onClick={() => handleToggleGroup(group.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#527CE4]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 max-w-xs truncate">
                          {group.name}
                        </div>
                        {group.description && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {group.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-600 font-medium">
                          {group.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <a
                          href={group.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline max-w-[220px] truncate flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span className="truncate">{group.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() =>
                            storageService.updateGroup(group.id, {
                              status: group.status === 'active' ? 'inactive' : 'active',
                            })
                          }
                          className={`text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            group.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {group.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {formatDateTime(group.dateAdded, timeZone)}
                      </td>
                      <td className="py-3 pr-4 pl-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(group)}
                            title="Edit group details"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete group "${group.name}"?`)) {
                                storageService.deleteGroup(group.id);
                              }
                            }}
                            title="Delete group"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Count */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{filteredGroups.length}</span>{' '}
            of <span className="font-semibold text-slate-700">{groups.length}</span> saved groups
          </div>
          {selectedGroupIds.size > 0 && (
            <div className="font-mono text-blue-600 font-medium">
              {selectedGroupIds.size} selected
            </div>
          )}
        </div>
      </div>

      {/* Manual Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingGroup ? 'Edit Facebook Group' : 'Add Facebook Group'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualGroup} className="p-5 space-y-4 text-xs">
              {manualFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{manualFormError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Facebook Group URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://www.facebook.com/groups/yourcommunity"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Must be a valid facebook.com/groups/ URL
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Bangladesh Tech Entrepreneurs"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    placeholder="e.g. Digital Marketing"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Description
                </label>
                <textarea
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  rows={2}
                  placeholder="Notes about posting rules, admin contact, or audience niche..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg font-semibold shadow-sm"
                >
                  {editingGroup ? 'Update Group' : 'Save Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Bulk Facebook Group URL Import
                </h3>
                <p className="text-[11px] text-slate-500">
                  Paste multiple Facebook Group URLs (one URL per line)
                </p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Default Category
                </label>
                <input
                  type="text"
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  placeholder="e.g. Bangladesh Business & Marketing"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Group URLs (One per line)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {bulkUrlsText.split('\n').filter((l) => l.trim()).length} URLs entered
                  </span>
                </div>
                <textarea
                  value={bulkUrlsText}
                  onChange={(e) => setBulkUrlsText(e.target.value)}
                  rows={7}
                  placeholder={`https://www.facebook.com/groups/dhaka.startups
https://www.facebook.com/groups/bangladesh.ecommerce
https://www.facebook.com/groups/freelancers.bangladesh`}
                  className="w-full p-3 font-mono text-[11px] border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Import Results / Errors Report */}
              {bulkResult && (
                <div className="p-3 rounded-lg border bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {bulkResult.importedCount} Imported Successfully
                    </span>
                    <span className="text-amber-700">
                      {bulkResult.duplicateCount} Duplicates Skipped
                    </span>
                    {bulkResult.invalidCount > 0 && (
                      <span className="text-rose-700">
                        {bulkResult.invalidCount} Invalid
                      </span>
                    )}
                  </div>

                  {bulkResult.errors.length > 0 && (
                    <div className="max-h-28 overflow-y-auto space-y-1 pt-1 border-t border-slate-200">
                      {bulkResult.errors.map((err, i) => (
                        <div key={i} className="text-[10px] text-rose-600 flex items-start gap-1">
                          <span className="font-mono font-bold">Line {err.line}:</span>
                          <span className="truncate">{err.rawUrl}</span>
                          <span className="text-slate-500 font-sans">— {err.reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRunBulkImport}
                  disabled={!bulkUrlsText.trim()}
                  className="px-4 py-2 bg-[#527CE4] hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-semibold shadow-sm"
                >
                  Process & Import URLs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
