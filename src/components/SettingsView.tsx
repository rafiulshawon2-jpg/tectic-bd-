import React, { useState } from 'react';
import {
  Settings,
  Database,
  Save,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  Shield,
  Key,
  Globe,
  Clock,
  Radio,
  FileCode,
  Copy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AppSettings } from '../types';
import { storageService } from '../services/storage';

interface SettingsViewProps {
  settings: AppSettings;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings }) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Suggested Firestore Security Rules
  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check auth
    function isAuthenticated() {
      return request.auth != null;
    }

    // TecTic Bd collections
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }

    match /groups/{groupId} {
      allow read, write: if isAuthenticated();
    }

    match /campaigns/{campaignId} {
      allow read, write: if isAuthenticated();
    }

    match /publishingTasks/{taskId} {
      allow read, write: if isAuthenticated();
    }

    match /activityLogs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
    }

    match /settings/{settingId} {
      allow read, write: if isAuthenticated();
    }
  }
}`;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tectic_bd_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importData(content);
      if (success) {
        alert('Data imported and restored successfully!');
      } else {
        setImportError('Invalid JSON format or corrupted file structure.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 1500);
  };

  const handleResetSample = () => {
    if (confirm('Reset all groups, campaigns, and queue tasks to TecTic Bd defaults?')) {
      storageService.resetToSampleData();
      alert('Sample dataset loaded!');
    }
  };

  const handleClearAll = () => {
    if (
      confirm(
        'WARNING: This will erase all saved groups, campaigns, and queue records from local storage. Are you sure?'
      )
    ) {
      storageService.clearAllData();
      alert('Local data cleared.');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Application & Integration Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure default scheduling parameters, browser extension bridges, Firestore database, and backups.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Application settings saved successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Brand & User Profile */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Profile & Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Business / Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Admin User Email
              </label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Scheduling Preferences */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Scheduling & Automation Rules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Timezone
              </label>
              <select
                value={formData.defaultTimezone}
                onChange={(e) => setFormData({ ...formData, defaultTimezone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (BST, UTC+6)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Interval (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.defaultIntervalMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultIntervalMinutes: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auto-Retry on Throttling / Failure
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="autoRetry"
                  checked={formData.autoRetryOnFail}
                  onChange={(e) =>
                    setFormData({ ...formData, autoRetryOnFail: e.target.checked })
                  }
                  className="rounded text-blue-600 w-4 h-4"
                />
                <label htmlFor="autoRetry" className="text-slate-700 font-medium cursor-pointer">
                  Enable auto-retries (Max {formData.maxRetries} attempts)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Extension Bridge Token */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Chrome Extension Bridge Settings</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Security Bridge Token
              </label>
              <input
                type="text"
                value={formData.extensionBridgeToken}
                onChange={(e) =>
                  setFormData({ ...formData, extensionBridgeToken: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Used to authenticate window.postMessage packets between web dashboard and Chrome Extension content scripts.
              </span>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Cloud Firestore & Security Rules Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#527CE4]" />
              <span>Cloud Firestore Database Architecture</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Structured schema mapping for scalable production deployment.
            </p>
          </div>

          <button
            onClick={handleCopyRules}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedRules ? 'Copied Rules!' : 'Copy Firestore Rules'}</span>
          </button>
        </div>

        {/* Schema Blueprint Diagram */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
            <div className="font-bold text-blue-600">/groups</div>
            <div className="text-[10px] text-slate-500">Facebook groups directory</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
            <div className="font-bold text-blue-600">/campaigns</div>
            <div className="text-[10px] text-slate-500">Promotions & creatives</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
            <div className="font-bold text-blue-600">/publishingTasks</div>
            <div className="text-[10px] text-slate-500">Individual group tasks</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px]">
            <div className="font-bold text-blue-600">/activityLogs</div>
            <div className="text-[10px] text-slate-500">Audit logs & receipts</div>
          </div>
        </div>

        {/* Rules Code Viewer */}
        <div className="bg-[#0f172a] text-slate-200 p-4 rounded-lg font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
          <pre>{firestoreRulesText}</pre>
        </div>
      </div>

      {/* Backup, Import & Reset Controls */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900">
          Data Backup & Local Maintenance
        </h3>

        {importError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export Backup</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Save all groups, campaigns, and queues as a JSON file.
            </p>
          </button>

          {/* Import JSON */}
          <label className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-colors flex flex-col justify-between cursor-pointer">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Restore Backup</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Load previously exported JSON backup.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          {/* Reset to Sample Data */}
          <button
            onClick={handleResetSample}
            className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Reset Samples</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Reload standard TecTic Bd groups & demo campaign.
            </p>
          </button>

          {/* Clear Local Data */}
          <button
            onClick={handleClearAll}
            className="p-3 rounded-lg border border-rose-200 hover:bg-rose-50 text-left transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 font-bold text-rose-700">
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
            </div>
            <p className="text-[11px] text-rose-600/80 mt-2">
              Erase all records from browser storage.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
