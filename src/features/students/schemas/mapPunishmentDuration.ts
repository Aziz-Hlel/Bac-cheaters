import z from 'zod';

export const mapPunishmentDurationSchema = z.array(
  z.object({
    text: z.string(),
    value: z.number().int().min(0).max(10).nullable(),
  }),
);

export type MapPunishmentDurationInput = z.infer<typeof mapPunishmentDurationSchema>;
