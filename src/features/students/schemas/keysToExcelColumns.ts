import z from 'zod';

export const keysToExcelColumnsSchema = z
  .object({
    cin: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    name: z
      .string({ error: 'الاسم واللقب مطلوب' })
      .trim()
      .nonempty({ message: 'الاسم واللقب مطلوب' })
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' }),
    delegation: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    section: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    registrationNumber: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    registrationType: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    originalInstitute: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    punishmentReason: z
      .string()
      .trim()
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    violation: z
      .string({ error: 'العقوبة مطلوبة' })
      .trim()
      .nonempty({ message: 'العقوبة مطلوبة' })
      .max(1, { message: 'الحد الأقصى حرف واحد فقط' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'يُسمح فقط بالأحرف  (A-Z)' }),
  })
  .refine((data) => {
    const occObject: Record<string, number> = {};

    Object.values(data).forEach((value) => {
      if (value) {
        occObject[value] = (occObject[value] || 0) + 1;
      }
    });

    const hasDuplicates = Object.values(occObject).some((count) => count > 1);
    if (hasDuplicates) {
      return { value: false, message: 'Excel columns must be unique' };
    }
    return true;
  });

export type KeysToExcelColumnsInput = z.infer<typeof keysToExcelColumnsSchema>;
