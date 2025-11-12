import {
  GOAL_VALUES,
  WEIGHT_MIN,
  WEIGHT_MAX,
  HEIGHT_MIN,
  HEIGHT_MAX,
} from "@/app/consts/userInfo";
import { z } from "zod";

export const schema = z.object({
  sex: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["MALE", "FEMALE"], {
      required_error: "To pole jest wymagane",
      invalid_type_error: "To pole jest wymagane",
    })
  ),

  birthDate: z.preprocess(
    (val) => {
      if (!val) return undefined;
      const d = new Date(String(val));
      return isNaN(d.getTime()) ? undefined : d;
    },
    z
      .date({
        required_error: "To pole jest wymagane",
        invalid_type_error: "To pole jest wymagane",
      })
      .max(new Date(), {
        message: "Data urodzenia nie może być z przyszłości.",
      })
  ),

  weight: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Number(val)),
    z
      .number({
        required_error: "To pole jest wymagane",
        invalid_type_error: "To pole jest wymagane",
      })
      .min(WEIGHT_MIN, { message: `Waga jest za niska (min ${WEIGHT_MIN} kg)` })
      .max(WEIGHT_MAX, {
        message: `Waga jest za wysoka (max ${WEIGHT_MAX} kg)`,
      })
  ),

  height: z.preprocess(
    (val) => (val === "" || val == null ? undefined : Math.floor(Number(val))),
    z
      .number({
        required_error: "To pole jest wymagane",
        invalid_type_error: "To pole jest wymagane",
      })
      .int()
      .min(HEIGHT_MIN, {
        message: `Wzrost jest za niski (min ${HEIGHT_MIN} cm)`,
      })
      .max(HEIGHT_MAX, {
        message: `Wzrost jest za wysoki (max ${HEIGHT_MAX} cm)`,
      })
  ),

  goal: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(GOAL_VALUES, {
      required_error: "To pole jest wymagane",
      invalid_type_error: "To pole jest wymagane",
    })
  ),

  activityLevel: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["LOW", "MEDIUM", "HIGH"], {
      required_error: "To pole jest wymagane",
      invalid_type_error: "To pole jest wymagane",
    })
  ),
});

export type FormValues = z.infer<typeof schema>;