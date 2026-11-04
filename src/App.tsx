import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GroupManagerView } from './components/GroupManagerView';
import { PostComposerView } from './components/PostComposerView';
import { CampaignManagerView } from './components/CampaignManagerView';
import { QueueManagerView } from './components/QueueManagerView';
import { HistoryReportsView } from './components/HistoryReportsView';
import { ExtensionHubView } from './components/ExtensionHubView';
import { SettingsView } from './components/SettingsView';
import { storageService } from './services/storage';
import { queueRunner, QueueRunnerStatus } from './services/queueRunner';
import {
  FacebookGroup,
  Campaign,
  PublishingTask,
  ActivityLog,
  AppSettings,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [groups, setGroups] = useState<FacebookGroup[]>(storageService.getGroups());
  const [campaigns, setCampaigns] = useState<Campaign[]>(storageService.getCampaigns());
  const [tasks, setTasks] = useState<PublishingTask[]>(storageService.getTasks());
  const [logs, setLogs] = useState<ActivityLog[]>(storageService.getLogs());
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings());
  const [queueStatus, setQueueStatus] = useState<QueueRunnerStatus>(queueRunner.getStatus());

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribeStorage = storageService.subscribe(() => {
      setGroups(storageService.getGroups());
      setCampaigns(storageService.getCampaigns());
      setTasks(storageService.getTasks());
      setLogs(storageService.getLogs());
      setSettings(storageService.getSettings());
    });

    const unsubscribeQueue = queueRunner.subscribe((status) => {
      setQueueStatus(status);
    });

    return () => {
      unsubscribeStorage();
      unsubscribeQueue();
    };
  }, []);

  const handleRunTaskNow = async (task: PublishingTask) => {
    await queueRunner.executeTask(task, true);
  };

  const getTabTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'dashboard':
        return 'Operational Dashboard';
      case 'groups':
        return 'Facebook Group Directory';
      case 'composer':
        return 'Post Composer & Campaign Wizard';
      case 'campaigns':
        return 'Campaign Manager';
      case 'queue':
        return 'Live Publishing Queue';
      case 'history':
        return 'Posting History & Reports';
      case 'extension':
        return 'Chrome Extension Integration';
      case 'settings':
        return 'System & Database Settings';
      default:
        return 'TecTic Bd Publisher';
    }
  };

  const pendingCount = tasks.filter(
    (t) => t.status === 'Scheduled' || t.status === 'Processing'
  ).length;

  return (
    <div className="flex h-screen bg-[#F3F6FB] overflow-hidden">
      {/* Permanent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        pendingCount={pendingCount}
        totalGroupsCount={groups.length}
        isExtensionConnected={queueStatus.isExtensionConnected}
        settings={settings}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          currentTitle={getTabTitle(activeTab)}
          onNewCampaign={() => setActiveTab('composer')}
          isExtensionConnected={queueStatus.isExtensionConnected}
          isSimulatedExtension={settings.simulatedExtension}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              groups={groups}
              campaigns={campaigns}
              tasks={tasks}
              logs={logs}
              settings={settings}
              isExtensionConnected={queueStatus.isExtensionConnected}
              onNavigate={setActiveTab}
              onRunTaskNow={handleRunTaskNow}
            />
          )}

          {activeTab === 'groups' && (
            <GroupManagerView
              groups={groups}
              timeZone={settings.defaultTimezone}
            />
          )}

          {activeTab === 'composer' && (
            <PostComposerView
              groups={groups}
              settings={settings}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignManagerView
              campaigns={campaigns}
              tasks={tasks}
              timeZone={settings.defaultTimezone}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'queue' && (
            <QueueManagerView
              tasks={tasks}
              timeZone={settings.defaultTimezone}
              onRunTaskNow={handleRunTaskNow}
              activeProcessingTaskId={queueStatus.activeProcessingTaskId}
            />
          )}

          {activeTab === 'history' && (
            <HistoryReportsView
              tasks={tasks}
              timeZone={settings.defaultTimezone}
            />
          )}

          {activeTab === 'extension' && (
            <ExtensionHubView
              settings={settings}
              isExtensionConnected={queueStatus.isExtensionConnected}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView settings={settings} />
          )}
        </main>
      </div>
    </div>
  );
}
