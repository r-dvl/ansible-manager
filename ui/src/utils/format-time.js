import { format, getTime, formatDistanceToNow } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';


const timeZone = 'Europe/Madrid';

export function fDate(date, newFormat) {
  if (!date) return '';

  // Date to UTC
  const utcDate = zonedTimeToUtc(new Date(date), timeZone);

  // UTC to TZ
  const zonedDate = utcToZonedTime(utcDate, timeZone);

  const fm = newFormat || 'dd MMM yyyy';
  return format(zonedDate, fm);
}

export function fDateTime(date, newFormat) {
  if (!date) return '';

  // Date to UTC
  const utcDate = zonedTimeToUtc(new Date(date), timeZone);

  // UTC to TZ
  const zonedDate = utcToZonedTime(utcDate, timeZone);

  const fm = newFormat || 'dd MMM yyyy p';
  return format(zonedDate, fm);
}

export function fTimestamp(date) {
  if (!date) return '';

  // Date to UTC
  const utcDate = zonedTimeToUtc(new Date(date), timeZone);

  // UTC to TZ
  const zonedDate = utcToZonedTime(utcDate, timeZone);

  return getTime(zonedDate);
}

export function fToNow(date) {
  if (!date) return '';

  // Date to UTC
  const utcDate = zonedTimeToUtc(new Date(date), timeZone);

  // UTC to TZ
  const zonedDate = utcToZonedTime(utcDate, timeZone);

  return formatDistanceToNow(zonedDate, {
    addSuffix: true,
  });
}
