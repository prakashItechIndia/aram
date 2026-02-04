import parsePhoneNumber from 'libphonenumber-js';
import { z } from 'zod';
export const optional = z.string().optional();
export const optional_boolean = z.boolean().optional();
export const simple_boolean = z.boolean().optional();
export const simple_email = z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Invalid email address');
export const simple_password_login = z
    .string()
    .trim()
    .nonempty('Password is required')
    .min(8, 'Password must be at least 8 characters'); // login password should not have all validation rules
export const simple_password = z
    .string()
    .nonempty(`Password is required`)
    .min(8, { message: '' })
    .max(50, { message: '' })
    .regex(/[a-z]/, {
    message: '',
})
    .regex(/[A-Z]/, {
    message: '',
})
    .regex(/\d/, { message: '' })
    .regex(/[@$!%*?&]/, {
    message: '',
});
export const simple_retype_password = z
    .string()
    .nonempty(`Password is required`);
export const simple_first_name = z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'Name must be less than 50 characters long' });
export const z_email_name = z
    .string()
    .trim()
    .min(1, { message: 'Email Id is required' })
    .max(50, { message: 'Name must be less than 50 characters long' });
export const simple_name = z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters long' });
export const simple_last_name = z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Name must be less than 50 characters long' });
export const simple_user_type = z
    .string()
    .trim()
    .min(1, { message: 'Role type is required' });
export const simple_location = z
    .string()
    .trim()
    .min(1, { message: 'Location is required' });
export const contract_date = z.preprocess((arg) => {
    if (!arg)
        return undefined; // Treat empty, null, or undefined as missing (optional)
    if (typeof arg === 'string' || arg instanceof Date) {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date; // Only return valid dates
    }
    return undefined;
}, z.date({ invalid_type_error: 'Enter a valid date' }).optional());
export const contract_amount = z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
    message: 'Contract amount must be a valid decimal number with up to two decimal places',
});
export const simple_phone = z
    .string({ required_error: 'Phone number is required' })
    .transform((value, ctx) => {
    // Allow empty value (optional phone)
    if (!value || value === '') {
        return value;
    }
    const phoneNumber = parsePhoneNumber(value, {
        defaultCountry: 'IN',
    });
    if (!phoneNumber?.number) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }
    // Accept valid phone numbers from ANY country
    if (!phoneNumber.isValid()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid phone number',
        });
        return z.NEVER;
    }
    return phoneNumber.number;
});
export const expiration_date = z.preprocess((arg) => {
    if (arg && (typeof arg === 'string' || arg instanceof Date)) {
        const parsedDate = new Date(arg);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate; // Check if the date is valid
    }
    return undefined;
}, z.date({ invalid_type_error: 'Enter a valid date' }).optional());
export const simple_file_upload = z
    .instanceof(File)
    .optional()
    .refine((file) => !file ||
    (file instanceof File &&
        ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)), {
    message: 'Please upload only one PNG, JPG, or JPEG file',
})
    .refine((file) => !file || (file instanceof File && file.size <= 1024 * 1024), // 1MB = 1024*1024 bytes
{
    message: 'File size must be less than or equal to 1MB',
});
