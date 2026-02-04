import { differenceInCalendarDays, differenceInMinutes, differenceInMonths, differenceInYears, Duration, endOfMonth, getDay, intervalToDuration, isAfter, isSameMonth, isThisMonth, Locale, parse, parseISO, startOfMonth, startOfToday } from 'date-fns';
declare const formatDate: (date: string | number | Date, dateFormat?: string) => string;
declare const subDate: (date: Date | number, duration: Duration) => Date;
declare const addDate: (date: Date | number, duration: Duration) => Date;
declare const differenceInDays: (date1: string | number | Date, date2: string | number | Date) => number;
declare const startOfWeek: (date: number | Date, options?: {
    locale?: Locale | undefined;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
} | undefined) => Date;
declare const endOfWeek: (date: number | Date, options?: {
    locale?: Locale | undefined;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
} | undefined) => Date;
declare const isTimeBetween7and9UTC: (date: Date) => boolean;
declare const getLocalTimeWithTimeZone: (dateTime: string, timeZone: string, format?: string) => string;
export declare const getDateDifference: (date: string | Date | null | undefined) => {
    years: number;
    months: number;
    days: number;
};
export declare const formatUsingMoment: (date: string | Date | null | undefined, format?: string) => string | null;
export { formatDate, subDate, differenceInDays, addDate, startOfWeek, endOfWeek, getDay, startOfToday, parse, endOfMonth, isThisMonth, startOfMonth, isAfter, parseISO, isTimeBetween7and9UTC, getLocalTimeWithTimeZone, differenceInCalendarDays, differenceInMonths, differenceInYears, intervalToDuration, isSameMonth, differenceInMinutes, };
//# sourceMappingURL=date-helper.d.ts.map