import { z } from "zod";

export const schema = z.object({
  phone: z
    .string({
      required_error: 'To pole jest wymagane'
    })
    .trim()
    .regex(
      /^(\+48\s?)?(\d{3}\s\d{3}\s\d{3})$/,
      "Podaj numer w formacie +48 123 456 789 lub 123 456 789"
    ),
});

export type FormValues = z.infer<typeof schema>;