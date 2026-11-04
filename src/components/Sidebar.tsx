import React from 'react';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Megaphone,
  ListOrdered,
  FileText,
  Puzzle,
  Settings,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { AppSettings } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'groups'
  | 'composer'
  | 'campaigns'
  | 'queue'
  | 'history'
  | 'extension'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingCount: number;
  totalGroupsCount: number;
  isExtensionConnected: boolean;
  settings: AppSettings;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  totalGroupsCount,
  isExtensionConnected,
  settings,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'groups' as ActiveTab,
      label: 'Facebook Groups',
      icon: Users,
      badge: totalGroupsCount > 0 ? String(totalGroupsCount) : null,
    },
    {
      id: 'composer' as ActiveTab,
      label: 'New Campaign',
      icon: PlusCircle,
      badge: 'Create',
      highlight: true,
    },
    {
      id: 'campaigns' as ActiveTab,
      label: 'Campaign Manager',
      icon: Megaphone,
      badge: null,
    },
    {
      id: 'queue' as ActiveTab,
      label: 'Publishing Queue',
      icon: ListOrdered,
      badge: pendingCount > 0 ? String(pendingCount) : null,
      badgeAlert: pendingCount > 0,
    },
    {
      id: 'history' as ActiveTab,
      label: 'History & Reports',
      icon: FileText,
      badge: null,
    },
    {
      id: 'extension' as ActiveTab,
      label: 'Chrome Extension',
      icon: Puzzle,
      badge: isExtensionConnected ? 'Active' : 'Setup',
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#111C2E] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800/80 select-none z-20">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#527CE4] flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
          <span className="text-base tracking-tighter">TB</span>
        </div>
        <div className="overflow-hidden">
          <div className="font-bold text-white text-[15px] tracking-tight leading-tight truncate">
            {settings.brandName || 'TecTic Bd'}
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            Smart Group Publisher
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Publishing Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#527CE4] text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              } ${item.highlight && !isActive ? 'border border-blue-500/30 text-blue-300 bg-blue-500/5' : ''}`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-blue-400'
                      : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeAlert
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Extension Status Live Box */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#527CE4]" />
            Extension Bridge
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              isExtensionConnected || settings.simulatedExtension
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isExtensionConnected
              ? 'Chrome Connected'
              : settings.simulatedExtension
              ? 'Web Simulator'
              : 'Disconnected'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {isExtensionConnected
            ? 'Background automation is active on Facebook.'
            : settings.simulatedExtension
            ? 'Browser runner is executing scheduled tasks.'
            : 'Load extension unpacked to automate posting.'}
        </p>
      </div>

      {/* Account Info Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="overflow-hidden flex-1">
          <div className="text-xs font-semibold text-white truncate">
            {settings.userEmail || 'admin@tecticbd.com'}
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Admin · {settings.defaultTimezone}
          </div>
        </div>
      </div>
    </aside>
  );
};
