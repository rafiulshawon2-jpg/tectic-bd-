import React, { useEffect, useState } from 'react';
import {
  Clock,
  Plus,
  RefreshCw,
  Layers,
  Sparkles,
  Bell,
  UserCheck,
  Facebook,
  Instagram,
} from 'lucide-react';
import { getCurrentDhakaTime } from '../utils/dateUtils';
import { queueRunner } from '../services/queueRunner';
import { MetaAccount } from '../types';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  currentTitle: string;
  onNewCampaign: () => void;
  isExtensionConnected: boolean;
  isSimulatedExtension: boolean;
  defaultAccount?: MetaAccount;
  unreadNotificationsCount: number;
  onNavigate: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  onNewCampaign,
  isExtensionConnected,
  isSimulatedExtension,
  defaultAccount,
  unreadNotificationsCount,
  onNavigate,
}) => {
  const [dhakaTime, setDhakaTime] = useState(getCurrentDhakaTime());
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDhakaTime(getCurrentDhakaTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePing = () => {
    setIsPinging(true);
    queueRunner.testExtensionConnection();
    setTimeout(() => setIsPinging(false), 800);
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-10 shrink-0">
      {/* Zone 1: Contextual Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Layers className="w-3.5 h-3.5 text-[#527CE4]" />
          <span>TecTic Bd</span>
          <span className="text-slate-300">/</span>
        </div>
        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Zone 2: Dhaka Local Timezone, Meta Account & Status */}
      <div className="hidden md:flex items-center gap-3 text-xs">
        {/* Connected Meta Account Pill */}
        {defaultAccount ? (
          <button
            onClick={() => onNavigate('accounts')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            title="Click to manage connected Meta Accounts"
          >
            <img
              src={defaultAccount.avatarUrl}
              alt={defaultAccount.name}
              className="w-4 h-4 rounded-full object-cover shrink-0"
            />
            <span className="text-[11px] font-bold text-slate-800 truncate max-w-[140px]">
              {defaultAccount.name}
            </span>
            <span className="text-[9px] bg-blue-100 text-blue-700 font-mono px-1 py-0.5 rounded uppercase font-semibold">
              {defaultAccount.platform === 'facebook' ? 'FB' : 'IG'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('accounts')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Connect Meta ID</span>
          </button>
        )}

        {/* Dhaka Time Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] tabular-nums">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-sans font-medium">Dhaka:</span>
          <span className="font-semibold text-slate-900">{dhakaTime}</span>
        </div>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => onNavigate('moderation')}
          title="Group Post Status & Notifications"
          className="relative p-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center font-mono animate-pulse">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Extension Bridge Status Button */}
        <button
          onClick={handlePing}
          title="Click to ping extension bridge"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isExtensionConnected
                ? 'bg-emerald-500'
                : isSimulatedExtension
                ? 'bg-blue-500'
                : 'bg-amber-400'
            }`}
          />
          <span className="text-[11px] font-medium">
            {isExtensionConnected
              ? 'Extension Connected'
              : isSimulatedExtension
              ? 'Simulator Active'
              : 'Standby'}
          </span>
          <RefreshCw
            className={`w-3 h-3 text-slate-400 ${
              isPinging ? 'animate-spin text-blue-600' : ''
            }`}
          />
        </button>
      </div>

      {/* Zone 3: Primary Action CTA */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onNewCampaign}
          className="flex items-center gap-2 px-4 py-2 bg-[#527CE4] hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>
    </header>
  );
};
