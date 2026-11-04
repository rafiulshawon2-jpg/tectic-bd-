import { PublishingTask } from '../types';
import { formatDateTime } from './dateUtils';

export function exportTasksToCsv(
  tasks: PublishingTask[],
  filename = 'tectic-bd-posting-history.csv',
  timeZone = 'Asia/Dhaka'
): void {
  const headers = [
    'Task ID',
    'Campaign Name',
    'Group Name',
    'Group URL',
    'Scheduled Time',
    'Actual Published Time',
    'Status',
    'Retry Count',
    'Facebook Post URL',
    'Error Details',
  ];

  const escapeCsv = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = tasks.map((t) => [
    escapeCsv(t.id),
    escapeCsv(t.campaignName),
    escapeCsv(t.groupName),
    escapeCsv(t.groupUrl),
    escapeCsv(formatDateTime(t.scheduledAt, timeZone)),
    escapeCsv(t.executedAt ? formatDateTime(t.executedAt, timeZone) : 'N/A'),
    escapeCsv(t.status),
    escapeCsv(t.retryCount || 0),
    escapeCsv(t.fbPostUrl || 'N/A'),
    escapeCsv(t.errorMessage || 'None'),
  ]);

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
