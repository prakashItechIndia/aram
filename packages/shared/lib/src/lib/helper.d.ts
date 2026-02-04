export declare function wait(ms: number): Promise<unknown>;
export declare function doNothing(..._args: unknown[]): unknown[];
export declare class DummyMoney {
    static amountToStringComma: (amount: number) => string;
    static getRandomAmount: (range?: number, offset?: number) => number;
    static getRandomMoney(range?: number, offset?: number): string;
}
export declare function getSelectOptions(obj: Record<string, string>): {
    label: string;
    value: string;
}[];
export declare function getParsedPhone(phone: string): string | undefined;
export declare function isNullOrUndefined(value: unknown): value is null | undefined;
export declare function formatePhoneNumber(phone: string): string;
export declare function isMatchingRoutePath(pathName: string, routeName: string): boolean;
export declare const isEmpty: (value: string | number | object) => boolean;
export declare const getEventColorByType: (data: any) => "#FF4E4E" | "#FFB3B3" | "#FFBF56" | "#FFE5BB";
export declare const truncateString: (str: string, num: number) => string;
export declare const roundOfHundered: (val1: number | 0, val2: number | 0) => number;
/**
 * Formats a number with thousand separators.
 * @param value - The number to format.
 * @param locale - The locale to use for formatting (default: 'en-IN').
 * @returns The formatted number as a string.
 */
export declare const formatNumberWithSeparator: (value: number, locale?: string) => string;
export declare const getCheckInQuestionMetaData: (signalTypeCheck: string, answerMetaData: string) => string;
export declare const getThroughtRelatedAnswer: (answer: string) => string;
type Input = string | Date | null | undefined;
/**
 * Formats "MM/dd/yyyy - hh:mm am", or:
 *  - if includeCountdown is true and the time is < thresholdHours (default 24) in the future:
 *      returns "X Hours Left"
 *  - if includeCountdown is false and the time is < thresholdHours in the future:
 *      returns undefined
 * Returns undefined for missing/invalid input.
 */
export declare function formatTimestampOrHoursLeft(input: Input, includeCountdown?: boolean, opts?: {
    thresholdHours?: number;
    formatStr?: string;
    now?: Date;
}): string | undefined;
export declare function darkClassWrap(classname: string): string;
export {};
//# sourceMappingURL=helper.d.ts.map