import vine from "@vinejs/vine";
import { ShoppingCategoryRules } from "#types/shopping";

export const shoppingValidator = vine.create({
	name: vine.string().trim().minLength(1).maxLength(180),
	category: vine.enum([...ShoppingCategoryRules]),
	pinned: vine.boolean(),
});
