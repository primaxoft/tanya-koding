import { z } from 'zod';

export const createQuestionSchema = z.object({
  question: z
    .string()
    .min(10, 'Panjangkan sikit soalan tu')
    .max(300, 'Jangan panjang sangat soalannya, Jenuh nak baca.'),
});

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;
