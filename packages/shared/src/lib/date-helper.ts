import {
  add,
  differenceInCalendarDays,
  differenceInDays as diff,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  Duration,
  endOfMonth,
  endOfWeek as getEndOfWeek,
  format,
  getDay,
  intervalToDuration,
  isAfter,
  isBefore,
  isSameMonth,
  isThisMonth,
  Locale,
  parse,
  parseISO,
  setDefaultOptions,
  setHours,
  setMinutes,
  setSeconds,
  startOfMonth,
  startOfToday,
  startOfWeek as getStartOfWeek,
  sub,
} from 'date-fns';
import { enIN, enUS } from 'date-fns/locale';
import { format as formatUtc, toZonedTime } from 'date-fns-tz';
import moment from 'moment';

setDefaultOptions({ locale: enUS });

const formatDate = (
  date: string | number | Date,
  dateFormat = 'yyyy-MM-dd',
) => {
  return format(date, dateFormat);
};

const subDate = (date: Date | number, duration: Duration) => {
  return sub(date, duration);
};

const addDate = (date: Date | number, duration: Duration) => {
  return add(date, duration);
};

const differenceInDays = (
  date1: string | number | Date,
  date2: string | number | Date,
) => {
  return diff(new Date(date1), new Date(date2));
};

const startOfWeek = (
  date: number | Date,
  options?:
    | {
        locale?: Locale | undefined;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
      }
    | undefined,
) => {
  return getStartOfWeek(date, options);
};

const endOfWeek = (
  date: number | Date,
  options?:
    | {
        locale?: Locale | undefined;
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
      }
    | undefined,
) => {
  return getEndOfWeek(date, options);
};

const isTimeBetween7and9UTC = (date: Date) => {
  // Convert the provided date to UTC
  const utcDate = toZonedTime(date, 'UTC');

  // Set the start time to 7:00 AM UTC
  const startTime = setSeconds(setMinutes(setHours(utcDate, 7), 0), 0);

  // Set the end time to 9:00 AM UTC
  const endTime = setSeconds(setMinutes(setHours(utcDate, 9), 0), 0);

  // Check if the time is between 7:00 AM and 9:00 AM UTC
  return isAfter(utcDate, startTime) && isBefore(utcDate, endTime);
};

const getLocalTimeWithTimeZone = (
  dateTime: string,
  timeZone: string,
  format = 'M/dd/yy h:mmaaa zzz',
) => {
  const indianTz = ['Asia/Kolkata', 'Asia/Calcutta'];
  const utcDate = parseISO(dateTime);
  const zonedTime = toZonedTime(utcDate, timeZone);
  return formatUtc(zonedTime, format, {
    timeZone,
    locale: indianTz.includes(timeZone) ? enIN : enUS,
  });
  // .replace(/([CPME])DT/g, '$1ST') to replace CST, PST, MST, EST
};

export const getDateDifference = (
  date: string | Date | null | undefined,
): { years: number; months: number; days: number } => {
  if (!date) {
    return { days: 0, months: 0, years: 0 };
  }
  const now = moment(); // Current date
  const pastDate = moment(date); // Given date
  const years = now.diff(pastDate, 'years');
  pastDate.add(years, 'years'); // Adjust pastDate to remove counted years
  const months = now.diff(pastDate, 'months');
  pastDate.add(months, 'months'); // Adjust pastDate to remove counted months
  const days = now.diff(pastDate, 'days');
  return { days, months, years };
};

export const formatUsingMoment = (
  date: string | Date | null | undefined,
  format = 'M/D/YYYY',
) => {
  if (!date) {
    return null;
  }
  return moment(date).format(format);
};

export {
  formatDate,
  subDate,
  differenceInDays,
  addDate,
  startOfWeek,
  endOfWeek,
  getDay,
  startOfToday,
  parse,
  endOfMonth,
  isThisMonth,
  startOfMonth,
  isAfter,
  parseISO,
  isTimeBetween7and9UTC,
  getLocalTimeWithTimeZone,
  differenceInCalendarDays,
  differenceInMonths,
  differenceInYears,
  intervalToDuration,
  isSameMonth,
  differenceInMinutes,
};
