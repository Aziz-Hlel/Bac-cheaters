import z from 'zod';

export const firstAndLastRowSchema = z
  .object({
    firstRow: z.number({ error: 'السطر الأول مطلوب' }).int().positive({ message: 'يجب أن يكون السطر الأول 1 على الأقل' }),
    lastRow: z.number({ error: 'السطر الأخير مطلوب' }).int().positive({ message: 'يجب أن يكون السطر الأخير 1 على الأقل' }),
  })
  .refine((data) => data.lastRow > data.firstRow, {
    message: 'يجب أن يكون السطر الأخير أكبر من السطر الأول',
    path: ['lastRow'],
  });

export type FirstAndLastRowInput = z.infer<typeof firstAndLastRowSchema>;
