import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Video,
  Copy,
  Trash2,
  Smile,
  Sparkles,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  AlertCircle,
  ThumbsUp,
  MessageCircle,
  Share2,
  Globe,
  UploadCloud,
  Check,
} from 'lucide-react';
import { FacebookGroup, MediaItem, AppSettings } from '../types';
import { storageService } from '../services/storage';
import { generateAutoSchedules, formatDateTime } from '../utils/dateUtils';
import { ActiveTab } from './Sidebar';

interface PostComposerViewProps {
  groups: FacebookGroup[];
  settings: AppSettings;
  onNavigate: (tab: ActiveTab) => void;
}

export const PostComposerView: React.FC<PostComposerViewProps> = ({
  groups,
  settings,
  onNavigate,
}) => {
  // Wizard Steps: 1 = Creative & Content, 2 = Group Selection, 3 = Scheduling & Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Creative & Content
  const [campaignName, setCampaignName] = useState(
    'TecTic Bd – Promotional Outreach ' + new Date().toLocaleDateString()
  );
  const [caption, setCaption] = useState(
    `🔥 Special Announcement from TecTic Bd!

Boost your business presence with our customized digital solutions and enterprise automation services in Bangladesh.

✅ Enterprise Web & App Development
✅ Custom Automation & CRM Systems
✅ Scalable Cloud Infrastructure

Visit our official portal: https://tecticbd.com
Direct WhatsApp: +880 1700-000000 | contact@tecticbd.com
#TecTicBd #SoftwareBangladesh #DigitalServices`
  );

  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 'm-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      name: 'tectic_dashboard_preview.jpg',
    },
    {
      id: 'm-2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      name: 'business_strategy.jpg',
    },
  ]);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Step 2: Selected Groups
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(
    new Set(groups.filter((g) => g.status === 'active').map((g) => g.id))
  );
  const [groupSearch, setGroupSearch] = useState('');
  const [groupCategoryFilter, setGroupCategoryFilter] = useState('all');

  // Step 3: Scheduling Mode & Configuration
  const [scheduleMode, setScheduleMode] = useState<'automatic' | 'manual'>('automatic');
  const [autoIntervalMinutes, setAutoIntervalMinutes] = useState(
    settings.defaultIntervalMinutes || 5
  );
  const [selectedTimezone, setSelectedTimezone] = useState(
    settings.defaultTimezone || 'Asia/Dhaka'
  );

  // Default start time: 5 minutes from now rounded to next minute
  const defaultStartTime = useMemo(() => {
    const d = new Date(Date.now() + 5 * 60000);
    d.setSeconds(0, 0);
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }, []);

  const [startDateTimeLocal, setStartDateTimeLocal] = useState<string>(defaultStartTime);

  // Manual Schedules Map: groupId -> ISO string
  const [manualSchedules, setManualSchedules] = useState<Record<string, string>>({});

  // Form error
  const [validationError, setValidationError] = useState<string | null>(null);

  // Common emoji palette for business copywriters
  const emojis = ['🚀', '🔥', '✨', '✅', '📲', '💼', '💡', '🌟', '🎯', '📈', '🤝', '🇧🇩'];

  const handleAddEmoji = (emoji: string) => {
    setCaption((prev) => prev + ' ' + emoji);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 1500);
  };

  const handleClearCaption = () => {
    if (confirm('Clear entire post caption?')) {
      setCaption('');
    }
  };

  const handleAddSampleImage = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
    ];
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    const newItem: MediaItem = {
      id: 'm-' + Date.now(),
      type: 'image',
      url: randomUrl,
      name: `sample_media_${mediaList.length + 1}.jpg`,
    };
    setMediaList([...mediaList, newItem]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = Array.from(files).map((file, idx) => ({
      id: 'upload-' + Date.now() + '-' + idx,
      type: file.type.startsWith('video') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setMediaList((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // Group selection helpers
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
        g.url.toLowerCase().includes(groupSearch.toLowerCase());
      const matchCat =
        groupCategoryFilter === 'all' || g.category === groupCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [groups, groupSearch, groupCategoryFilter]);

  const toggleGroupSelection = (id: string) => {
    const next = new Set(selectedGroupIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedGroupIds(next);
  };

  const selectAllFilteredGroups = () => {
    const next = new Set(selectedGroupIds);
    filteredGroups.forEach((g) => next.add(g.id));
    setSelectedGroupIds(next);
  };

  const deselectAllFilteredGroups = () => {
    const next = new Set(selectedGroupIds);
    filteredGroups.forEach((g) => next.delete(g.id));
    setSelectedGroupIds(next);
  };

  // Calculate generated schedules for review
  const generatedTaskSchedules = useMemo(() => {
    const selectedList = groups.filter((g) => selectedGroupIds.has(g.id));
    const startIso = new Date(startDateTimeLocal).toISOString();

    if (scheduleMode === 'automatic') {
      const autoTimes = generateAutoSchedules(
        startIso,
        autoIntervalMinutes,
        selectedList.length
      );
      return selectedList.map((g, idx) => ({
        groupId: g.id,
        groupName: g.name,
        groupUrl: g.url,
        scheduledAt: autoTimes[idx],
      }));
    } else {
      // Manual mode
      return selectedList.map((g, idx) => {
        const manualTime =
          manualSchedules[g.id] ||
          new Date(Date.now() + (idx + 1) * 15 * 60000).toISOString();
        return {
          groupId: g.id,
          groupName: g.name,
          groupUrl: g.url,
          scheduledAt: manualTime,
        };
      });
    }
  }, [
    groups,
    selectedGroupIds,
    scheduleMode,
    startDateTimeLocal,
    autoIntervalMinutes,
    manualSchedules,
  ]);

  // Validation before step changes
  const handleProceedToStep2 = () => {
    if (!campaignName.trim()) {
      setValidationError('Please enter a campaign name.');
      return;
    }
    if (!caption.trim()) {
      setValidationError('Please write a post caption.');
      return;
    }
    setValidationError(null);
    setCurrentStep(2);
  };

  const handleProceedToStep3 = () => {
    if (selectedGroupIds.size === 0) {
      setValidationError('Please select at least one Facebook Group.');
      return;
    }
    setValidationError(null);
    setCurrentStep(3);
  };

  // Start Campaign Final Action
  const handleStartCampaign = () => {
    if (selectedGroupIds.size === 0) {
      setValidationError('Please select target Facebook groups.');
      return;
    }

    const { campaign } = storageService.createCampaign(
      {
        name: campaignName.trim(),
        caption: caption.trim(),
        media: mediaList,
        groupIds: Array.from(selectedGroupIds),
        scheduleMode,
        autoIntervalMinutes:
          scheduleMode === 'automatic' ? autoIntervalMinutes : undefined,
        startDateTime: new Date(startDateTimeLocal).toISOString(),
        timezone: selectedTimezone,
        status: 'scheduled',
      },
      generatedTaskSchedules.map((s) => ({
        groupId: s.groupId,
        scheduledAt: s.scheduledAt,
      }))
    );

    // Redirect to queue to watch execution live!
    onNavigate('queue');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Wizard Step Stepper */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6 text-xs">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              currentStep === 1
                ? 'text-[#527CE4]'
                : currentStep > 1
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 1
                  ? 'bg-blue-100 text-[#527CE4]'
                  : currentStep > 1
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </div>
            <span>1. Creative & Caption</span>
          </button>

          <span className="text-slate-300">→</span>

          {/* Step 2 */}
          <button
            onClick={() => currentStep >= 2 && setCurrentStep(2)}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              currentStep === 2
                ? 'text-[#527CE4]'
                : currentStep > 2
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 2
                  ? 'bg-blue-100 text-[#527CE4]'
                  : currentStep > 2
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </div>
            <span>2. Select Groups ({selectedGroupIds.size})</span>
          </button>

          <span className="text-slate-300">→</span>

          {/* Step 3 */}
          <button
            onClick={() => currentStep >= 3 && setCurrentStep(3)}
            className={`flex items-center gap-2 font-semibold transition-colors ${
              currentStep === 3
                ? 'text-[#527CE4]'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                currentStep === 3
                  ? 'bg-blue-100 text-[#527CE4]'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span>3. Smart Scheduling & Review</span>
          </button>
        </div>

        {/* Wizard Step Controls */}
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {currentStep === 1 && (
            <button
              onClick={handleProceedToStep2}
              className="px-4 py-1.5 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>Next: Select Groups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              onClick={handleProceedToStep3}
              className="px-4 py-1.5 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>Next: Configure Scheduling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleStartCampaign}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Start Campaign</span>
            </button>
          )}
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: CONTENT & POST COMPOSER */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Editor (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. TecTic Bd - Winter Software Promo 2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Caption Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 uppercase tracking-wider">
                  Post Caption & Promotional Copy
                </label>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>{caption.length} characters</span>
                  <span>·</span>
                  <span>{caption.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>

              {/* Textarea toolbar */}
              <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-500">
                <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs">
                  {/* Emoji Quick Palette */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded flex items-center gap-1 text-[11px]"
                    >
                      <Smile className="w-3.5 h-3.5" />
                      <span>Emojis</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-0.5 ml-2">
                      {emojis.slice(0, 7).map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => handleAddEmoji(emo)}
                          className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-sm"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCaption}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded flex items-center gap-1 text-[11px]"
                      title="Copy caption"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCaption ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearCaption}
                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1 text-[11px]"
                      title="Clear caption"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Emoji Drawer */}
                {isEmojiPickerOpen && (
                  <div className="p-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap gap-1.5">
                    {emojis.map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => handleAddEmoji(emo)}
                        className="w-7 h-7 flex items-center justify-center bg-white hover:scale-110 rounded border border-slate-200 text-base transition-transform"
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={8}
                  placeholder="Write your business promotional announcement, contact links, hashtags, and offer details..."
                  className="w-full p-3.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* Media Upload Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Attached Media ({mediaList.length})
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload promotional banners, flyers, product screenshots, or videos.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddSampleImage}
                    className="px-2.5 py-1 text-[11px] border border-slate-200 hover:bg-slate-50 text-slate-700 rounded font-medium"
                  >
                    + Sample Image
                  </button>

                  <label className="cursor-pointer px-3 py-1 text-[11px] bg-[#527CE4] hover:bg-blue-600 text-white rounded font-medium shadow-xs flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Uploaded media previews */}
              {mediaList.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 text-xs">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  No media uploaded. Click "Upload Files" or "+ Sample Image" to attach visuals.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {mediaList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 aspect-video flex items-center justify-center"
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-slate-600">
                          <Video className="w-6 h-6 mb-1 text-blue-500" />
                          <span className="text-[10px] truncate max-w-[100px]">{item.name}</span>
                        </div>
                      )}

                      {/* Remove Button Overlay */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove media"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-mono">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Realistic Live Facebook Post Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden sticky top-20">
            {/* Facebook Mockup Header Bar */}
            <div className="bg-[#1877F2] px-4 py-2.5 text-white flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide">Live Facebook Preview</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                Group Post Mockup
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Group / Page Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#111C2E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  TB
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 hover:underline cursor-pointer">
                    TecTic Bd Official · Promotion
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>Just now</span>
                    <span>·</span>
                    <Globe className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Caption Text Render */}
              <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto pr-1">
                {caption || <span className="text-slate-400 italic">Caption is empty...</span>}
              </div>

              {/* Responsive Facebook Multi-Image Layout Preview */}
              {mediaList.length > 0 && (
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-black">
                  {mediaList.length === 1 && (
                    <img
                      src={mediaList[0].url}
                      alt="preview"
                      className="w-full max-h-80 object-cover"
                    />
                  )}

                  {mediaList.length === 2 && (
                    <div className="grid grid-cols-2 gap-0.5">
                      <img
                        src={mediaList[0].url}
                        alt="preview"
                        className="w-full h-48 object-cover"
                      />
                      <img
                        src={mediaList[1].url}
                        alt="preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {mediaList.length === 3 && (
                    <div className="grid grid-cols-2 gap-0.5">
                      <img
                        src={mediaList[0].url}
                        alt="preview"
                        className="col-span-2 w-full h-44 object-cover"
                      />
                      <img
                        src={mediaList[1].url}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />
                      <img
                        src={mediaList[2].url}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {mediaList.length >= 4 && (
                    <div className="grid grid-cols-2 gap-0.5 relative">
                      <img
                        src={mediaList[0].url}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />
                      <img
                        src={mediaList[1].url}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />
                      <img
                        src={mediaList[2].url}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />
                      <div className="relative w-full h-32">
                        <img
                          src={mediaList[3].url}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        {mediaList.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold">
                            +{mediaList.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Realistic Facebook Engagement Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <button
                  type="button"
                  className="flex-1 py-1.5 hover:bg-slate-50 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Like</span>
                </button>
                <button
                  type="button"
                  className="flex-1 py-1.5 hover:bg-slate-50 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Comment</span>
                </button>
                <button
                  type="button"
                  className="flex-1 py-1.5 hover:bg-slate-50 rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MULTIPLE GROUP SELECTION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Select Target Facebook Groups
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose 10, 20, 50, or 100+ groups to receive this promotional campaign. Individual tasks will be generated.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllFilteredGroups}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAllFilteredGroups}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={groupSearch}
              onChange={(e) => setGroupSearch(e.target.value)}
              placeholder="Search target groups..."
              className="flex-1 px-3.5 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />

            <select
              value={groupCategoryFilter}
              onChange={(e) => setGroupCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {Array.from(new Set(groups.map((g) => g.category))).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Groups Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1">
            {filteredGroups.map((group) => {
              const isSelected = selectedGroupIds.has(group.id);
              return (
                <div
                  key={group.id}
                  onClick={() => toggleGroupSelection(group.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#527CE4] bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-[#527CE4] border-[#527CE4] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="overflow-hidden min-w-0 flex-1">
                    <div className="font-semibold text-slate-900 text-xs truncate">
                      {group.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {group.category}
                    </div>
                    <div className="text-[10px] text-blue-600 truncate font-mono mt-0.5">
                      {group.url}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-800">{selectedGroupIds.size}</span> groups
              selected for this campaign
            </div>
            <button
              onClick={handleProceedToStep3}
              className="px-4 py-2 bg-[#527CE4] hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
            >
              <span>Continue to Scheduling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SMART SCHEDULING SYSTEM */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Smart Scheduling Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose between Automatic interval spacing (anti-spam protection) or Manual per-group scheduling.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setScheduleMode('automatic')}
              className={`p-3 rounded-lg border text-left transition-all ${
                scheduleMode === 'automatic'
                  ? 'border-[#527CE4] bg-blue-50/50 ring-1 ring-[#527CE4]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">
                A. Automatic Scheduling (Recommended)
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Stagger posts evenly with intervals (e.g. every 5 minutes).
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScheduleMode('manual')}
              className={`p-3 rounded-lg border text-left transition-all ${
                scheduleMode === 'manual'
                  ? 'border-[#527CE4] bg-blue-50/50 ring-1 ring-[#527CE4]'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="text-xs font-bold text-slate-900">
                B. Manual Scheduling
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Set individual dates and times for each group.
              </div>
            </button>
          </div>

          {/* Automatic Controls */}
          {scheduleMode === 'automatic' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Starting Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDateTimeLocal}
                  onChange={(e) => setStartDateTimeLocal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Interval Between Groups (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={autoIntervalMinutes}
                  onChange={(e) => setAutoIntervalMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Recommended: 3–10 minutes to respect Facebook rate limits.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Timezone
                </label>
                <select
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (BST, UTC+6)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          )}

          {/* Schedule Preview & Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Generated Task Schedules ({generatedTaskSchedules.length} Tasks)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Every selected group is assigned its individual publishing schedule.
                </p>
              </div>

              <span className="text-xs text-blue-600 font-mono font-semibold">
                Timezone: {selectedTimezone}
              </span>
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 font-mono">#</th>
                    <th className="py-2.5 px-3">Facebook Group</th>
                    <th className="py-2.5 px-3">Scheduled Publishing Time</th>
                    {scheduleMode === 'manual' && (
                      <th className="py-2.5 px-3 text-right">Edit Time</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {generatedTaskSchedules.map((schedule, idx) => (
                    <tr key={schedule.groupId} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-400">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 truncate max-w-xs">
                        {schedule.groupName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-blue-700 font-medium">
                        {formatDateTime(schedule.scheduledAt, selectedTimezone)}
                      </td>
                      {scheduleMode === 'manual' && (
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="datetime-local"
                            onChange={(e) => {
                              const iso = new Date(e.target.value).toISOString();
                              setManualSchedules((prev) => ({
                                ...prev,
                                [schedule.groupId]: iso,
                              }));
                            }}
                            className="px-2 py-1 text-[11px] border border-slate-200 rounded font-mono"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Launch Campaign Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Ready to deploy campaign: <span className="font-bold text-slate-900">{campaignName}</span> with{' '}
              <span className="font-bold text-blue-600">{generatedTaskSchedules.length}</span> automated group tasks.
            </div>

            <button
              onClick={handleStartCampaign}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Start Campaign Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
