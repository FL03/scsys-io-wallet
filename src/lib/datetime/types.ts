/**
 * Created At: 2025-04-04:19:24:16
 * @author - @FL03
 * @file - types.ts
 */
export type DayLiteral = 
  | string
  | (
      | 'Sunday'
      | 'Monday'
      | 'Tuesday'
      | 'Wednesday'
      | 'Thursday'
      | 'Friday'
      | 'Saturday'
    );

export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAYS_OF_WEEK: DayLiteral[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export type Day = DayLiteral | DayNumber;

export interface Time {
  hour: number;
  minute: number;
}

export type Timestamptz = Date | number | string;

export enum Days {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}
