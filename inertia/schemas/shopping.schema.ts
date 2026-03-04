import z from "zod";
import { ShoppingCategoryRules } from "#types/shopping";

export const ShoppingSchema = z.object({
	name: z.string().min(1, "Nom requis").max(180),
	category: z.enum(ShoppingCategoryRules),
	pinned: z.boolean(),
});
