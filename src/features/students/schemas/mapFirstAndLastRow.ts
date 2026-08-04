import z from 'zod';

export const firstAndLastRowSchema = z
  .object({
    firstRow: z.number().int().positive({ message: 'First row must be at least 1' }),
    lastRow: z.number().int().positive({ message: 'Last row must be at least 1' }),
  })
  .refine((data) => data.lastRow >= data.firstRow, {
    message: 'Last row must be greater than or equal to first row',
    path: ['lastRow'],
  });

export type FirstAndLastRowInput = z.infer<typeof firstAndLastRowSchema>;
