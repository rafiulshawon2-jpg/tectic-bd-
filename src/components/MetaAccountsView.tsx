import React, { useState } from 'react';
import {
  Facebook,
  Instagram,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trash2,
  RefreshCw,
  Key,
  Lock,
  Layers,
  Sparkles,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import { MetaAccount } from '../types';
import { storageService } from '../services/storage';
import { formatDateTime } from '../utils/dateUtils';

interface MetaAccountsViewProps {
  accounts: MetaAccount[];
  timeZone: string;
}

export const MetaAccountsView: React.FC<MetaAccountsViewProps> = ({
  accounts,
  timeZone,
}) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<'facebook' | 'instagram'>('facebook');
  const [accountType, setAccountType] = useState<'profile' | 'page' | 'business_instagram'>('profile');
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');
  const [accessTokenInput, setAccessTokenInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleOpenConnect = (platform: 'facebook' | 'instagram') => {
    setConnectPlatform(platform);
    setAccountType(platform === 'facebook' ? 'profile' : 'business_instagram');
    setAccountName(platform === 'facebook' ? 'TecTic Bd Marketing Admin' : 'tecticbd_official');
    setUsername(platform === 'facebook' ? 'tecticbd.admin' : 'tecticbd_official');
    setAccessTokenInput('EAAGNO' + Math.random().toString(36).substring(2, 10).toUpperCase() + '...');
    setIsConnectModalOpen(true);
  };

  const handleExecuteConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      const isFb = connectPlatform === 'facebook';
      storageService.addAccount({
        platform: connectPlatform,
        name: accountName.trim() || (isFb ? 'TecTic Bd Profile' : '@tecticbd'),
        username: username.trim(),
        accountType: accountType,
        avatarUrl: isFb
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        profileUrl: isFb
          ? `https://facebook.com/${username.trim() || 'profile'}`
          : `https://instagram.com/${username.trim() || 'profile'}`,
        isConnected: true,
        accessTokenSnippet: accessTokenInput.slice(0, 8) + '...' + accessTokenInput.slice(-4),
        permissions: isFb
          ? ['groups_access_member_info', 'publish_to_groups', 'read_notifications', 'pages_read_engagement']
          : ['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments'],
        isDefault: accounts.length === 0,
      });

      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        setIsConnectModalOpen(false);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#527CE4] font-bold font-mono">
              Meta Graph & Session Management
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Facebook & Instagram Connected IDs
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Connected Facebook & Instagram Accounts
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Connect your Facebook profiles, business pages, and Instagram accounts. All scheduled group posts will be deployed using your authenticated identity, allowing automatic notification monitoring for post approvals and deletions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleOpenConnect('facebook')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Facebook className="w-4 h-4 fill-white" />
            <span>Connect Facebook</span>
          </button>

          <button
            onClick={() => handleOpenConnect('instagram')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#E1306C] to-[#833AB4] hover:opacity-90 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>Connect Instagram</span>
          </button>
        </div>
      </div>

      {/* Connected Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Active Connected Identities ({accounts.length})
          </h3>
          <span className="text-xs text-slate-500">
            Select an account to set as default publisher
          </span>
        </div>

        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200/80 shadow-sm text-xs">
            <UserCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No Meta accounts connected yet</p>
            <p className="text-slate-400 mt-1 max-w-md mx-auto mb-4">
              Connect your Facebook or Instagram profile to start automated publishing across groups with live notification approval checks.
            </p>
            <button
              onClick={() => handleOpenConnect('facebook')}
              className="px-4 py-2 bg-[#1877F2] text-white rounded-lg font-semibold"
            >
              Connect Facebook ID
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {accounts.map((acc) => {
              const isFb = acc.platform === 'facebook';
              return (
                <div
                  key={acc.id}
                  className={`bg-white rounded-xl p-5 border transition-all relative flex flex-col justify-between ${
                    acc.isDefault
                      ? 'border-[#527CE4] ring-1 ring-[#527CE4] shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Default Publisher Badge */}
                  {acc.isDefault && (
                    <div className="absolute top-3 right-3 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Default Publisher</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Header Profile Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={acc.avatarUrl}
                          alt={acc.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                            isFb ? 'bg-[#1877F2]' : 'bg-[#E1306C]'
                          }`}
                        >
                          {isFb ? <Facebook className="w-3 h-3 fill-white" /> : <Instagram className="w-3 h-3" />}
                        </div>
                      </div>

                      <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {acc.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono truncate">
                          @{acc.username || 'user'}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                          {acc.accountType.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    {/* Status & Token */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Session Status</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Connected & Valid</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Connected</span>
                        <span>{formatDateTime(acc.connectedAt, timeZone)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Access Token</span>
                        <span>{acc.accessTokenSnippet || 'Session Token'}</span>
                      </div>
                    </div>

                    {/* Permissions list */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Authorized Permissions
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {acc.permissions.map((p) => (
                          <span
                            key={p}
                            className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {!acc.isDefault ? (
                      <button
                        onClick={() => storageService.setDefaultAccount(acc.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Primary Account</span>
                    )}

                    <div className="flex items-center gap-2">
                      <a
                        href={acc.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Open profile on Facebook/Instagram"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm(`Disconnect and remove account "${acc.name}"?`)) {
                            storageService.deleteAccount(acc.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Disconnect account"
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
      </div>

      {/* Security & Notification Verification Guide */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 text-xs space-y-3">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>How TecTic Bd Publishes & Checks Group Approvals</span>
        </h4>
        <p className="text-slate-600 leading-relaxed">
          1. <strong>Identity Mapping:</strong> When you start a campaign, posts are attributed to your selected connected Facebook/Instagram identity.
          <br />
          2. <strong>Auto-Scheduling Throttling:</strong> Tasks trigger sequentially according to your configured intervals, protecting your account from Facebook's anti-spam radar.
          <br />
          3. <strong>Group Notification Audit:</strong> The app periodically inspects notifications from your connected Facebook account to detect whether group admins have <strong>Approved & Made Live</strong>, <strong>Placed in Pending Review</strong>, or <strong>Declined/Deleted</strong> your post.
        </p>
      </div>

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {connectPlatform === 'facebook' ? (
                  <Facebook className="w-4 h-4 text-[#1877F2] fill-[#1877F2]" />
                ) : (
                  <Instagram className="w-4 h-4 text-[#E1306C]" />
                )}
                <h3 className="text-sm font-bold text-slate-900">
                  Connect {connectPlatform === 'facebook' ? 'Facebook' : 'Instagram'} Account
                </h3>
              </div>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteConnect} className="p-5 space-y-4">
              {authSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Account authenticated and linked successfully!</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  {connectPlatform === 'facebook' ? (
                    <>
                      <option value="profile">Personal Facebook Profile</option>
                      <option value="page">Facebook Business Page</option>
                    </>
                  ) : (
                    <option value="business_instagram">Instagram Business / Creator</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. TecTic Bd Official"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username / Handle
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. tecticbd.official"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Meta Access Token / Session Identifier
                </label>
                <input
                  type="text"
                  value={accessTokenInput}
                  onChange={(e) => setAccessTokenInput(e.target.value)}
                  placeholder="EAAGNO..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Autofilled via Facebook Login SDK or Chrome Extension session bridge.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="px-4 py-1.5 bg-[#1877F2] hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm flex items-center gap-1.5"
                >
                  {isAuthenticating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isAuthenticating ? 'Authorizing...' : 'Authorize & Connect'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
