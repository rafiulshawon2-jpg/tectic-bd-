import React, { useState } from 'react';
import {
  Cpu,
  Server,
  Laptop,
  Puzzle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Power,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  Info,
  ExternalLink,
  Copy,
  Check,
  HardDrive,
  Clock,
  Play,
  Square,
  FileCode,
  Download,
} from 'lucide-react';
import { WorkerState, WorkerDeploymentMode, AppSettings, ActivityLog } from '../types';
import { storageService } from '../services/storage';
import { formatDateTime } from '../utils/dateUtils';

interface WorkerControlPanelViewProps {
  settings: AppSettings;
  timeZone: string;
  logs: ActivityLog[];
}

export const WorkerControlPanelView: React.FC<WorkerControlPanelViewProps> = ({
  settings,
  timeZone,
  logs,
}) => {
  const [workerState, setWorkerState] = useState<WorkerState>(storageService.getWorkerState());
  const [isPinging, setIsPinging] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [isWorkerActive, setIsWorkerActive] = useState(workerState.status === 'online');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 1600);
  };

  const handleSelectMode = (mode: WorkerDeploymentMode) => {
    storageService.setWorkerMode(mode);
    setWorkerState(storageService.getWorkerState());
  };

  const handleToggleWorkerPower = () => {
    const nextStatus = isWorkerActive ? 'offline' : 'online';
    setIsWorkerActive(!isWorkerActive);
    storageService.updateWorkerHeartbeat({
      status: nextStatus,
    });
    setWorkerState(storageService.getWorkerState());
  };

  const handlePingHeartbeat = () => {
    setIsPinging(true);
    setTimeout(() => {
      storageService.updateWorkerHeartbeat({
        status: 'online',
        lastHeartbeat: new Date().toISOString(),
      });
      setWorkerState(storageService.getWorkerState());
      setIsPinging(false);
    }, 700);
  };

  const windowsBatCode = `@echo off
title TecTic Bd - Smart Group Publisher Local Worker
echo ========================================================
echo   TecTic Bd: Persistent Windows Chrome Automation Worker
echo   Profile Path: C:\\TecTicBd_Worker_Profile
echo ========================================================
cd /d "%~dp0"
if not exist "node_modules" (
  echo Installing worker dependencies...
  npm install
)
echo Starting Puppeteer Worker Engine...
node worker.js
pause`;

  const systemdServiceCode = `[Unit]
Description=TecTic Bd Group Publisher Cloud Automation Worker
After=network.target

[Service]
Type=simple
User=tectic
WorkingDirectory=/opt/tecticbd-worker
ExecStart=/usr/bin/node /opt/tecticbd-worker/worker.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=WORKER_PORT=4892
Environment=WORKER_PROFILE_DIR=/var/lib/tecticbd/profile

[Install]
WantedBy=multi-user.target`;

  const workerLogs = logs.filter(
    (l) =>
      l.type === 'worker_heartbeat' ||
      l.type === 'worker_mode_changed' ||
      l.type === 'task_published' ||
      l.type === 'task_skipped' ||
      l.type === 'pre_publish_check'
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-100 text-[#527CE4]">
              <Cpu className="w-5 h-5 text-blue-600" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Automation Worker Engine & Control Panel
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Choose between running automated publishing tasks on your local Windows laptop, a persistent Cloud VPS, or the Chrome extension.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePingHeartbeat}
            disabled={isPinging}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isPinging ? 'Pinging Worker...' : 'Ping Heartbeat'}</span>
          </button>

          <button
            onClick={handleToggleWorkerPower}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isWorkerActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-slate-200'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isWorkerActive ? 'Worker Active (Running)' : 'Worker Stopped'}</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Local Windows Worker */}
        <div
          onClick={() => handleSelectMode('local_windows')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            workerState.mode === 'local_windows'
              ? 'bg-blue-50/60 border-[#527CE4] ring-2 ring-[#527CE4]/30 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          {workerState.mode === 'local_windows' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-[#527CE4] text-white">
              ACTIVE MODE
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-blue-100 text-[#527CE4]">
                <Laptop className="w-5 h-5 text-blue-600" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Local Windows Worker</h3>
                <span className="text-[11px] text-slate-500">Dedicated Chrome Profile</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Runs directly on your Windows laptop. Uses an isolated, persistent Chrome profile so your personal browsing remains untouched while preserving Facebook login cookies.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700">Startup: Manual or Windows Task</span>
            <span className="font-bold text-emerald-600">Zero Cloud Cost</span>
          </div>
        </div>

        {/* Option 2: Cloud VPS Worker */}
        <div
          onClick={() => handleSelectMode('cloud_vps')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            workerState.mode === 'cloud_vps'
              ? 'bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          {workerState.mode === 'cloud_vps' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
              ACTIVE MODE
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                <Server className="w-5 h-5 text-indigo-600" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cloud VPS Worker</h3>
                <span className="text-[11px] text-slate-500">Persistent Linux VM (24/7)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Runs 24/7 on a cloud server without keeping your laptop open. Supports Oracle Cloud Always Free (4 OCPU ARM) or Hetzner VPS.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700">Autonomous 24/7 Runner</span>
            <span className="font-bold text-indigo-600">Free Tier Compatible</span>
          </div>
        </div>

        {/* Option 3: Browser Extension */}
        <div
          onClick={() => handleSelectMode('browser_extension')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
            workerState.mode === 'browser_extension'
              ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          {workerState.mode === 'browser_extension' && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
              ACTIVE MODE
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                <Puzzle className="w-5 h-5 text-emerald-600" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Chrome Extension</h3>
                <span className="text-[11px] text-slate-500">In-Browser DOM Automation</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Automates posting right inside your current Google Chrome browser tab through our Manifest V3 extension bridge without installing Node.js.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="font-medium text-slate-700">No Installation</span>
            <span className="font-bold text-emerald-600">Native Session</span>
          </div>
        </div>
      </div>

      {/* Live Worker Telemetry & Health Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                workerState.status === 'online'
                  ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Worker Status:</span>
                <span
                  className={`capitalize px-2 py-0.5 rounded text-[10px] font-bold ${
                    workerState.status === 'online'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {workerState.status.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Last Heartbeat:{' '}
                <span className="font-mono font-medium text-slate-700">
                  {formatDateTime(workerState.lastHeartbeat, timeZone)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tasks Completed</div>
              <div className="font-mono font-bold text-slate-900 text-base">{workerState.completedTasks}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Failed / Retried</div>
              <div className="font-mono font-bold text-rose-600 text-base">{workerState.failedTasks}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Success Rate</div>
              <div className="font-mono font-bold text-emerald-600 text-base">
                {workerState.completedTasks + workerState.failedTasks > 0
                  ? Math.round(
                      (workerState.completedTasks /
                        (workerState.completedTasks + workerState.failedTasks)) *
                        100
                    )
                  : 100}
                %
              </div>
            </div>
          </div>
        </div>

        {/* MODE DETAILS & STEP-BY-STEP DEPLOYMENT GUIDES */}
        {workerState.mode === 'local_windows' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Windows Local Runner Active:</span> Your laptop uses a dedicated persistent Chrome user profile (`C:\TecTicBd_Worker_Profile`). You only need to log in to Facebook once in this dedicated profile; all future scheduled campaigns run autonomously without needing manual credentials.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Batch Launcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <span>start-local-worker.bat (Double-Click Launcher)</span>
                  </span>
                  <button
                    onClick={() => handleCopy('bat', windowsBatCode)}
                    className="p-1 hover:bg-slate-100 text-slate-500 rounded flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copiedSnippet === 'bat' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'bat' ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800">
                  {windowsBatCode}
                </pre>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                  How to Run on Windows
                </h4>
                <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                  <li>
                    Ensure <span className="font-semibold text-slate-800">Node.js (v18+)</span> and Google Chrome are installed.
                  </li>
                  <li>
                    Save <span className="font-mono text-blue-700 bg-blue-50 px-1 rounded">worker.js</span> and <span className="font-mono text-blue-700 bg-blue-50 px-1 rounded">start-local-worker.bat</span> inside a folder named <span className="font-mono">C:\TecTicBd_Worker</span>.
                  </li>
                  <li>
                    Double-click <span className="font-semibold text-slate-800">start-local-worker.bat</span> to launch. The dedicated Chrome profile will open.
                  </li>
                  <li>
                    Log in to your Facebook Account once. Cookies are permanently remembered.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800">Optional Windows Auto-Start:</span> Press <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono">Win + R</kbd>, type <span className="font-mono">shell:startup</span>, and paste a shortcut to <span className="font-mono">start-local-worker.bat</span>.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {workerState.mode === 'cloud_vps' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Serverless Explanation Box */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-950">
                  Why Serverless (Firebase Functions / AWS Lambda) Cannot Run Persistent Facebook Puppeteer:
                </div>
                <p className="leading-relaxed text-amber-900">
                  Facebook monitors browser fingerprints, rotating cloud datacenters, and transient IP addresses. Serverless functions spin up ephemeral containers that discard state after execution, wiping out login cookies and immediately triggering checkpoint 2FA challenges on every single request. Furthermore, staggered campaigns take hours, which exceeds serverless execution limits. A persistent Cloud VM (VPS) maintains sticky cookies and permanent browser profiles.
                </p>
              </div>
            </div>

            {/* Recommended Free & Cheap VPS Providers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>1. Oracle Cloud Always Free</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    $0 / Forever Free
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Ampere A1 ARM Compute with up to 4 OCPUs and 24GB RAM. Ideal for persistent Headless Puppeteer automation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>2. Hetzner Cloud (CX22)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    ~€3.79 / mo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  High-speed European/US datacenters with static IPv4. Excellent reliability and persistent disk profiles.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>3. DigitalOcean Droplet</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                    $4.00 / mo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Simple 1-click Docker or Ubuntu droplet with persistent volumes and easy backup snapshots.
                </p>
              </div>
            </div>

            {/* Security Isolation Notice */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white">Security & Credential Isolation</div>
                <p className="text-slate-400 leading-relaxed">
                  Facebook session cookies and credentials are saved <strong className="text-slate-200">ONLY</strong> inside the secure file system of your private VPS (`/var/lib/tecticbd/profile`). No authentication cookies or passwords are ever stored or transmitted to public Firebase Firestore, protecting your accounts from unauthorized exposure.
                </p>
              </div>
            </div>

            {/* Systemd Daemon Config */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>VPS Systemd Service (/etc/systemd/system/tecticbd-worker.service)</span>
                </span>
                <button
                  onClick={() => handleCopy('service', systemdServiceCode)}
                  className="p-1 hover:bg-slate-100 text-slate-500 rounded flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedSnippet === 'service' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet === 'service' ? 'Copied!' : 'Copy Service File'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800">
                {systemdServiceCode}
              </pre>
            </div>
          </div>
        )}

        {workerState.mode === 'browser_extension' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Chrome Extension Bridge Active:</span> Tasks are processed directly through your active Google Chrome browser sessions without requiring background terminal processes.
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
              <h4 className="font-bold text-slate-900">Extension Bridge Connection Token:</h4>
              <div className="flex items-center gap-2">
                <code className="p-2 bg-white border border-slate-300 rounded font-mono text-blue-700 flex-1">
                  {settings.extensionBridgeToken}
                </code>
                <button
                  onClick={() => handleCopy('token', settings.extensionBridgeToken)}
                  className="px-3 py-2 bg-[#527CE4] hover:bg-blue-600 text-white rounded font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet === 'token' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Worker Activity Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Worker Event & Telemetry Logs</span>
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
          {workerLogs.length === 0 ? (
            <div className="text-slate-400 py-6 text-center">No worker events logged yet.</div>
          ) : (
            workerLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-700"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-medium truncate">{log.message}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3">
                  {formatDateTime(log.timestamp, timeZone)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
