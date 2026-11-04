import React, { useEffect, useState } from 'react';
import {
  Clock,
  Plus,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getCurrentDhakaTime } from '../utils/dateUtils';
import { queueRunner } from '../services/queueRunner';

interface HeaderProps {
  currentTitle: string;
  onNewCampaign: () => void;
  isExtensionConnected: boolean;
  isSimulatedExtension: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  onNewCampaign,
  isExtensionConnected,
  isSimulatedExtension,
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

      {/* Zone 2: Dhaka Local Timezone & Realtime Status */}
      <div className="hidden md:flex items-center gap-4 text-xs">
        {/* Dhaka Time Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] tabular-nums">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-sans font-medium">Dhaka (BST):</span>
          <span className="font-semibold text-slate-900">{dhakaTime}</span>
        </div>

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
              ? 'Web Simulator Active'
              : 'Extension Standby'}
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
