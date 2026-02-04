import parsePhoneNumber, { AsYouType } from 'libphonenumber-js';
export async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function doNothing(..._args) {
    return _args;
}
export class DummyMoney {
    static getRandomMoney(range = 1000, offset = 1000) {
        return ('$' +
            DummyMoney.amountToStringComma(DummyMoney.getRandomAmount(range, offset)));
    }
}
Object.defineProperty(DummyMoney, "amountToStringComma", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
});
Object.defineProperty(DummyMoney, "getRandomAmount", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (range = 1000, offset = 1000) => {
        return Math.floor(Math.random() * range) + offset;
    }
});
export function getSelectOptions(obj) {
    return Object.entries(obj).map(([key, value]) => ({
        label: value,
        value: key,
    }));
}
export function getParsedPhone(phone) {
    return parsePhoneNumber(phone, 'IN')?.formatNational();
}
export function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
export function formatePhoneNumber(phone) {
    if (!phone)
        return '';
    phone = phone.toString();
    if (phone.includes('(') && !phone.includes(')')) {
        return phone.replace('(', '');
    }
    if (phone.includes('+91')) {
        return new AsYouType('IN').input(phone.replace('+1', ''));
    }
    return new AsYouType('IN').input(phone);
}
export function isMatchingRoutePath(pathName, routeName) {
    const pathArr = pathName.split('/');
    const routhPath = routeName.replace('/', '');
    return pathArr.includes(routhPath);
}
export const isEmpty = (value) => {
    if (value === null) {
        return true;
    }
    else if (typeof value !== 'number' && value === '') {
        return true;
    }
    else if (typeof value === 'undefined' || value === undefined) {
        return true;
    }
    else if (value !== null &&
        typeof value === 'object' &&
        !Object.keys(value).length) {
        return true;
    }
    else {
        return false;
    }
};
export const getEventColorByType = (data) => {
    switch (data.signalStatus) {
        case 'critical':
            return data.signalResolutionStatus === 'open' ? '#FF4E4E' : '#FFB3B3';
        default:
            return data.signalResolutionStatus === 'open' ? '#FFBF56' : '#FFE5BB';
    }
};
export const truncateString = (str, num) => {
    if (str.length > num) {
        return str.slice(0, num) + '...';
    }
    else {
        return str;
    }
};
export const roundOfHundered = (val1, val2) => {
    const num = Number(val1 || val2 ? (val1 / val2) * 100 : 0);
    return num >= 100 ? 100 : num;
};
/**
 * Formats a number with thousand separators.
 * @param value - The number to format.
 * @param locale - The locale to use for formatting (default: 'en-IN').
 * @returns The formatted number as a string.
 */
export const formatNumberWithSeparator = (value, locale = 'en-IN') => {
    return value.toLocaleString(locale);
};
export const getCheckInQuestionMetaData = (signalTypeCheck, answerMetaData) => {
    const drinkMetaData = {
        ['yes']: 'Help needed',
        ['no']: 'No help needed',
    };
    const feelingMetaData = {
        ['stressed']: 'Stressed',
        ['tired']: 'Tired',
        ['anxious']: 'Anxious',
        ['hopeless']: 'Hopeless',
        ['triggered']: 'Triggered',
    };
    const thoughtMetaData = {
        ['feelings']: 'Feelings',
        ['boredom']: 'Boredom',
        ['isolated']: 'Isolated',
        ['socialPressure']: 'Social Pressure',
        ['revisitingOldEnvironment']: 'Revisiting Old Environment',
    };
    const groupMetaData = {
        ['notEnough']: 'Not Enough',
        ['enough']: 'Enough',
    };
    switch (signalTypeCheck) {
        case 'drink':
        case 'drink_related':
            return drinkMetaData[answerMetaData] || answerMetaData;
        case 'feeling':
        case 'feeling_related':
            return feelingMetaData[answerMetaData] || answerMetaData;
        case 'thought':
        case 'thought_related':
            return thoughtMetaData[answerMetaData] || answerMetaData;
        case 'group':
            return groupMetaData[answerMetaData] || answerMetaData;
        default:
            return answerMetaData;
    }
};
export const getThroughtRelatedAnswer = (answer) => {
    switch (answer) {
        case '1':
            return '1 Not at all';
        case '2':
            return '2 Some';
        case '3':
            return '3 Moderately';
        case '4':
            return '4 More';
        case '5':
            return '5 Strongly';
        default:
            return answer;
    }
};
import { parseISO, parse, format, isValid } from 'date-fns';
function parseTimestamp(input) {
    if (input == null)
        return undefined;
    if (input instanceof Date)
        return isValid(input) ? input : undefined;
    const s = String(input).trim();
    if (!s)
        return undefined;
    // Try ISO first (e.g., "2024-08-12T10:44:00+00:00")
    let d = parseISO(s);
    if (isValid(d))
        return d;
    // Common Postgres formats with space + offset
    d = parse(s, 'yyyy-MM-dd HH:mm:ssXXX', new Date()); // e.g., +05:30
    if (isValid(d))
        return d;
    d = parse(s, 'yyyy-MM-dd HH:mm:ssX', new Date()); // e.g., +00 or +05
    if (isValid(d))
        return d;
    return undefined;
}
/**
 * Formats "MM/dd/yyyy - hh:mm am", or:
 *  - if includeCountdown is true and the time is < thresholdHours (default 24) in the future:
 *      returns "X Hours Left"
 *  - if includeCountdown is false and the time is < thresholdHours in the future:
 *      returns undefined
 * Returns undefined for missing/invalid input.
 */
export function formatTimestampOrHoursLeft(input, includeCountdown = false, opts = {}) {
    const date = parseTimestamp(input);
    if (!date)
        return undefined;
    const now = opts.now ?? new Date();
    const fmt = opts.formatStr ?? 'MM/dd/yyyy - hh:mm a';
    const thresholdMs = (opts.thresholdHours ?? 24) * 60 * 60 * 1000;
    const diffMs = date.getTime() - now.getTime(); // >0 => future
    const hourMs = 60 * 60 * 1000;
    // Only treat future times within threshold as "countdown" candidates
    if (diffMs > 0 && diffMs < thresholdMs) {
        if (includeCountdown) {
            const hoursLeft = Math.ceil(diffMs / hourMs);
            return `${hoursLeft} ${hoursLeft === 1 ? 'Hour' : 'Hours'} Left`;
        }
        return undefined; // within threshold but countdown disabled
    }
    // Otherwise, show absolute date/time
    return format(date, fmt).toLowerCase();
}
export function darkClassWrap(classname) {
    return `${classname}  dark:text-darkDarkIconColor`;
}
