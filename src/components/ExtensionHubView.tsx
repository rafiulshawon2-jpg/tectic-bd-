import React, { useState } from 'react';
import {
  Puzzle,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Code,
  Layers,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Play,
  FileCode,
} from 'lucide-react';
import { EXTENSION_FILES, ExtensionFile } from '../services/extensionSource';
import { downloadExtensionZip } from '../utils/zipExport';
import { AppSettings } from '../types';
import { storageService } from '../services/storage';
import { queueRunner } from '../services/queueRunner';

interface ExtensionHubViewProps {
  settings: AppSettings;
  isExtensionConnected: boolean;
}

export const ExtensionHubView: React.FC<ExtensionHubViewProps> = ({
  settings,
  isExtensionConnected,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTestingBridge, setIsTestingBridge] = useState(false);

  const activeFile = EXTENSION_FILES[selectedFileIndex] || EXTENSION_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 1500);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadExtensionZip();
    } catch (err) {
      console.error('Error downloading zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTestBridge = () => {
    setIsTestingBridge(true);
    queueRunner.testExtensionConnection();
    setTimeout(() => setIsTestingBridge(false), 1000);
  };

  const toggleSimulation = () => {
    storageService.saveSettings({
      simulatedExtension: !settings.simulatedExtension,
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero / Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#527CE4] font-bold font-mono">
              Manifest V3 Automation Extension
            </span>
            <span className="text-slate-300">·</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isExtensionConnected
                  ? 'bg-emerald-50 text-emerald-700'
                  : settings.simulatedExtension
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {isExtensionConnected
                ? 'Chrome Connected'
                : settings.simulatedExtension
                ? 'Web Simulator Active'
                : 'Awaiting Extension'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            TecTic Bd Chrome Extension Integration Hub
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Download and unpack the complete Chrome Extension to automate Facebook group posting directly through your browser session, or use the integrated Web Simulator.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#527CE4] hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-blue-500/20 transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Building Zip...' : 'Download Extension (.zip)'}</span>
          </button>

          <button
            onClick={handleTestBridge}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isTestingBridge ? 'animate-spin text-blue-600' : ''}`}
            />
            <span>Test Connection</span>
          </button>
        </div>
      </div>

      {/* Simulator Switch Callout */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              In-Browser Runner Simulator
            </span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
              Instant Testing Mode
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            When enabled, the dashboard runs scheduled tasks directly inside this web tab without requiring you to install the Chrome Extension first. Great for rapid verification!
          </p>
        </div>

        <button
          onClick={toggleSimulation}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            settings.simulatedExtension
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {settings.simulatedExtension ? 'Simulator: Enabled' : 'Simulator: Disabled'}
        </button>
      </div>

      {/* 30-Second Installation Guide */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          How to Install the Chrome Extension (30 Seconds)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#527CE4] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div className="font-bold text-slate-900">Download & Unzip</div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Click the "Download Extension (.zip)" button above and extract the contents to a folder.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#527CE4] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div className="font-bold text-slate-900">Open Chrome Extensions</div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Type <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">chrome://extensions</code> in your Chrome browser URL bar.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#527CE4] text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div className="font-bold text-slate-900">Enable Developer Mode</div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Toggle the "Developer mode" switch in the top-right corner of Chrome's Extensions page.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-[#527CE4] text-white flex items-center justify-center font-bold text-xs">
              4
            </div>
            <div className="font-bold text-slate-900">Click "Load unpacked"</div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Click "Load unpacked" and select the unzipped extension directory. Done!
            </p>
          </div>
        </div>
      </div>

      {/* Extension Source Code Explorer */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Extension Architecture & Source Files
            </h3>
            <p className="text-[11px] text-slate-500">
              All 8 modular components structured for Google Chrome Manifest V3 compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedFile ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Tab Headers for 8 Files */}
        <div className="flex items-center overflow-x-auto border-b border-slate-200 bg-slate-100/70 px-3 pt-2 gap-1">
          {EXTENSION_FILES.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-3 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedFileIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#527CE4]" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* File Description */}
        <div className="px-5 py-2.5 bg-slate-900/95 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{activeFile.description}</span>
          <span className="font-mono text-slate-500">/chrome-extension/{activeFile.path}</span>
        </div>

        {/* Code Content Window */}
        <div className="bg-[#0f172a] text-slate-200 p-5 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed">
          <pre>{activeFile.content}</pre>
        </div>
      </div>
    </div>
  );
};
