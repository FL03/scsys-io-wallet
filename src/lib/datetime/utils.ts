/**
 * Created At: 2025-04-04:19:23:31
 * @author - @FL03
 * @description - datetime utilities for the platform
 * @file - utils.ts
 */
import { Days, DayLiteral } from './types';

import { TZDate } from '@date-fns/tz';
import { UTCDate } from '@date-fns/utc';

export const coerceUtcDate = (value?: string | number | Date) => {
  const date = new Date(value ?? Date.now());
  return new UTCDate(date);
}

export const dateWithTimezone = (
  value?: string | number | Date,
  timezone: string = 'America/Chicago'
) => {
  const date = value ? new Date(value) : new Date();
  return new TZDate(date, timezone);
};

export const coerceAnyDate = (value?: any | null) => {
  if (!value) return null;
  return new Date(value);
};

export const isDay = (day: number): day is Days => {
  return Object.values(Days).includes(day as Days);
};

/** This method tries to resolve the input into a particular DayLiteral */
export const resolveDayLiteral = (day: string): DayLiteral => {
  const formattedDay = day.trim().toLowerCase();
  if (formattedDay.startsWith('sun')) return 'Sunday';
  else if (formattedDay.startsWith('mon')) return 'Monday';
  else if (formattedDay.startsWith('tue')) return 'Tuesday';
  else if (formattedDay.startsWith('wed')) return 'Wednesday';
  else if (formattedDay.startsWith('thu')) return 'Thursday';
  else if (formattedDay.startsWith('fri')) return 'Friday';
  else if (formattedDay.startsWith('sat')) return 'Saturday';
  else {
    throw new Error(`Invalid day: ${day}`);
  }
};

export const stringToDay = (day: string): Days | null => {
  switch (day.toLowerCase()) {
    case 'sunday':
      return Days.Sunday;
    case 'monday':
      return Days.Monday;
    case 'tuesday':
      return Days.Tuesday;
    case 'wednesday':
      return Days.Wednesday;
    case 'thursday':
      return Days.Thursday;
    case 'friday':
      return Days.Friday;
    case 'saturday':
      return Days.Saturday;

    default:
      return null;
  }
};
