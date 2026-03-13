import { z } from "zod";

//post d'un award
export const awardCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titre requis")
    .max(150, "Titre trop long"),

  award_rank: z.coerce
    .number()
    .int("Rank invalide")
    .min(0, "Rank invalide")
    .max(9999, "Rank trop grand"),

  description: z
    .string()
    .trim()
    .max(4000, "Description trop longue")
    .nullable()
    .optional(),

  // si on accepte  cover en string
  cover: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),
}).strict();

//put d'un award
export const awardUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titre requis")
    .max(150),

  award_rank: z.coerce
    .number()
    .int()
    .min(0)
    .max(9999),

  description: z
    .string()
    .trim()
    .max(4000)
    .nullable()
    .optional(),

  cover: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),

}).strict();

//ajout d'une soumission à un award (put d'un award)
export const awardSetSubmissionSchema = z.object({
  submission_id: z
    .coerce
    .number()
    .int()
    .positive()
    .nullable(),
});