import { format, getTime, formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// ----------------------------------------------------------------------

const timeZone = 'Europe/Madrid';

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';
  const zonedDate = utcToZonedTime(new Date(date), timeZone);

  return date ? format(zonedDate, fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';
  const zonedDate = utcToZonedTime(new Date(date), timeZone);

  return date ? format(zonedDate, fm) : '';
}

export function fTimestamp(date) {
  const zonedDate = utcToZonedTime(new Date(date), timeZone);

  return date ? getTime(zonedDate) : '';
}

export function fToNow(date) {
  const zonedDate = utcToZonedTime(new Date(date), timeZone);

  return date
    ? formatDistanceToNow(zonedDate, {
        addSuffix: true,
      })
    : '';
}
