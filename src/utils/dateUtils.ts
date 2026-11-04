// Date and timezone formatting helpers

export function formatDateTime(
  isoString?: string,
  timeZone = 'Asia/Dhaka',
  includeSeconds = false
): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(
  isoString?: string,
  timeZone = 'Asia/Dhaka'
): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function getCurrentDhakaTime(): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString();
  }
}

/**
 * Calculates scheduled dates staggered by intervals in minutes
 */
export function generateAutoSchedules(
  startIso: string,
  intervalMinutes: number,
  count: number
): string[] {
  const startDate = new Date(startIso);
  const baseTime = isNaN(startDate.getTime()) ? Date.now() : startDate.getTime();
  const schedules: string[] = [];

  for (let i = 0; i < count; i++) {
    const nextTime = new Date(baseTime + i * intervalMinutes * 60 * 1000);
    schedules.push(nextTime.toISOString());
  }

  return schedules;
}
