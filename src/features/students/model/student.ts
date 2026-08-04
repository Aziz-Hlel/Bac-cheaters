import z from 'zod';

export const studentSchema = z.object({
  id: z.uuid(),

  cin: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // رقم بطاقة التعريف
  name: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // الاسم واللقب
  delegation: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // المندوبية
  section: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // الشعبة

  schoolYear: z.number().int().min(2020).max(2030), // الدورة

  registrationNumber: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // رقم التسجيل
  registrationType: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // نوع التسجيل

  originalInstitute: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // المعهد الأصلي

  punishmentReason: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // سبب العقوبة

  violation: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v !== '' ? v : null))
    .nullable(), // العقوبة

  punishmentDuration: z.number().int().min(0).max(10).nullable(), // مدة العقوبة

  createdAt: z.string().transform(() => new Date().toISOString()),
});

export type Student = z.infer<typeof studentSchema>;

export type StudentWithScore = Student & { score: number };

export const createStduentSchema = studentSchema.omit({ createdAt: true });
export type CreateStudentInput = z.infer<typeof createStduentSchema>;

export const updateStudentSchema = studentSchema.omit({ createdAt: true });
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
