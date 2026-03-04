import {
	Bubbles,
	Gift,
	House,
	Music,
	Shirt,
	ShoppingCart,
	Wrench,
	Zap,
} from "lucide-react";
import type { Icon } from "./app.ts";
import type { PickerOptionWithIcon, TwClass } from "./form.ts";

export type ShoppingCategorySlug = (typeof ShoppingCategoryRules)[number];
export type ShoppingCategoryPickerInput =
	PickerOptionWithIcon<ShoppingCategorySlug>;
export const ShoppingCategoryRules = [
	"general",
	"electronics",
	"household",
	"music",
	"clothing",
	"personal",
	"tools",
	"gifts",
] as const;

export const ShoppingCategories = {
	general: {
		kind: "icon",
		slug: "general",
		label: "Général",
		icon: ShoppingCart,
		iconColor: "text-shopping-category-general",
		bgColor: "bg-shopping-category-general/15",
		ringColor: "ring-shopping-category-general",
	},
	electronics: {
		kind: "icon",
		slug: "electronics",
		label: "Électronique",
		icon: Zap,
		iconColor: "text-shopping-category-electronics",
		bgColor: "bg-shopping-category-electronics/15",
		ringColor: "ring-shopping-category-electronics",
	},
	household: {
		kind: "icon",
		slug: "household",
		label: "Maison",
		icon: House,
		iconColor: "text-shopping-category-household",
		bgColor: "bg-shopping-category-household/15",
		ringColor: "ring-shopping-category-household",
	},
	music: {
		kind: "icon",
		slug: "music",
		label: "Musique",
		icon: Music,
		iconColor: "text-shopping-category-music",
		bgColor: "bg-shopping-category-music/15",
		ringColor: "ring-shopping-category-music",
	},
	clothing: {
		kind: "icon",
		slug: "clothing",
		label: "Vêtements",
		icon: Shirt,
		iconColor: "text-shopping-category-clothing",
		bgColor: "bg-shopping-category-clothing/15",
		ringColor: "ring-shopping-category-clothing",
	},
	personal: {
		kind: "icon",
		slug: "personal",
		label: "Soins",
		icon: Bubbles,
		iconColor: "text-shopping-category-personal",
		bgColor: "bg-shopping-category-personal/15",
		ringColor: "ring-shopping-category-personal",
	},
	tools: {
		kind: "icon",
		slug: "tools",
		label: "Outils",
		icon: Wrench,
		iconColor: "text-shopping-category-tools",
		bgColor: "bg-shopping-category-tools/15",
		ringColor: "ring-shopping-category-tools",
	},
	gifts: {
		kind: "icon",
		slug: "gifts",
		label: "Cadeau",
		icon: Gift,
		iconColor: "text-shopping-category-gifts",
		bgColor: "bg-shopping-category-gifts/15",
		ringColor: "ring-shopping-category-gifts",
	},
} as const satisfies Record<ShoppingCategorySlug, ShoppingCategoryPickerInput>;

export const ShoppingCategoryBadges = {
	general: {
		icon: ShoppingCart,
		color: "text-shopping-category-general",
	},
	electronics: {
		icon: Zap,
		color: "text-shopping-category-electronics",
	},
	household: {
		icon: House,
		color: "text-shopping-category-household",
	},
	music: {
		icon: Music,
		color: "text-shopping-category-music",
	},
	clothing: {
		icon: Shirt,
		color: "text-shopping-category-clothing",
	},
	personal: {
		icon: Bubbles,
		color: "text-shopping-category-personal",
	},
	tools: {
		icon: Wrench,
		color: "text-shopping-category-tools",
	},
	gifts: {
		icon: Gift,
		color: "text-shopping-category-gifts",
	},
} as const satisfies Record<
	ShoppingCategorySlug,
	{ icon: Icon; color: TwClass }
>;

export type NewShoppingElementFormData = {
	name: string;
	category: ShoppingCategorySlug;
	pinned: boolean;
};

export type ShoppingElementPayload = {
	name: string;
	category: ShoppingCategorySlug;
	pinned: boolean;
};

export type ShoppingElement = {
	id: number;
	name: string;
	category: ShoppingCategorySlug;
	pinned: boolean;
	done: boolean;
};
