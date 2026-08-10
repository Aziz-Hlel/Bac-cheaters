import z from 'zod';

export const keysToExcelColumnsSchema = z
  .object({
    cin: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    name: z
      .string({ error: 'الاسم واللقب مطلوب' })
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null)),
    delegation: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    section: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    registrationNumber: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    registrationType: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    originalInstitute: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    punishmentReason: z
      .string()
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null))
      .nullable(),
    violation: z
      .string({ error: 'العقوبة مطلوبة' })
      .max(1, { message: 'too many carachters' })
      .toUpperCase()
      .regex(/^[A-Za-z]?$/, { message: 'Only letters are allowed' })
      .transform((val) => (val !== '' ? val : null)),
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
