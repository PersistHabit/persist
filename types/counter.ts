import {
	CalendarDays,
	MousePointerClick,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import type { ColorPickerOption, PickerOptionWithIcon } from "./form.ts";

export type CounterDirectionSlug = (typeof CounterDirectionRules)[number];
export type CounterTriggerSlug = (typeof CounterTriggerRules)[number];
export type CounterColorSlug = (typeof CounterColorRules)[number];
export const CounterDirectionRules = ["increment", "decrement"] as const;
export const CounterTriggerRules = ["daily", "manual"] as const;
export const CounterColorRules = [
	"streak-0",
	"streak-1",
	"streak-2",
	"countdown-0",
	"countdown-1",
	"countdown-2",
] as const;
export type CounterDirectionPickerInput =
	PickerOptionWithIcon<CounterDirectionSlug>;
export type CounterTriggerPickerInput =
	PickerOptionWithIcon<CounterTriggerSlug>;

export const CounterDirections = {
	increment: {
		kind: "icon",
		slug: "increment",
		label: "Incrémenter",
		icon: TrendingUp,
		iconColor: "text-primary",
		bgColor: "bg-primary/10",
		ringColor: "ring-primary",
	},
	decrement: {
		kind: "icon",
		slug: "decrement",
		label: "Décrémenter",
		icon: TrendingDown,
		iconColor: "text-primary",
		bgColor: "bg-primary/10",
		ringColor: "ring-primary",
	},
} as const satisfies Record<CounterDirectionSlug, CounterDirectionPickerInput>;

export const CounterTriggers = {
	daily: {
		kind: "icon",
		slug: "daily",
		label: "Chaque jour",
		icon: CalendarDays,
		iconColor: "text-primary",
		bgColor: "bg-primary/10",
		ringColor: "ring-primary",
	},
	manual: {
		kind: "icon",
		slug: "manual",
		label: "Manuellement",
		icon: MousePointerClick,
		iconColor: "text-primary",
		bgColor: "bg-primary/10",
		ringColor: "ring-primary",
	},
} as const satisfies Record<CounterTriggerSlug, CounterTriggerPickerInput>;

export const CounterColors = {
	increment: [
		{
			slug: "streak-0",
			color: "bg-counter-streak-0",
		},
		{
			slug: "streak-1",
			color: "bg-counter-streak-1",
		},
		{
			slug: "streak-2",
			color: "bg-counter-streak-2",
		},
	],
	decrement: [
		{
			slug: "countdown-0",
			color: "bg-counter-countdown-0",
		},
		{
			slug: "countdown-1",
			color: "bg-counter-countdown-1",
		},
		{
			slug: "countdown-2",
			color: "bg-counter-countdown-2",
		},
	],
} as const satisfies Record<CounterDirectionSlug, ColorPickerOption[]>;

export type NewCounterFormData = {
	title: string;
	value: number;
	direction: CounterDirectionSlug;
	trigger: CounterTriggerSlug;
	color: CounterColorSlug;
	pinned: boolean;
};

export type CounterPayload = {
	title: string;
	pinned: boolean;
	value: number;
	direction: CounterDirectionSlug;
	trigger: CounterTriggerSlug;
	color: CounterColorSlug;
};

export type Counter = {
	id: number;
	title: string;
	pinned: boolean;
	value: number;
	direction: CounterDirectionSlug;
	trigger: CounterTriggerSlug;
	color: CounterColorSlug;
};
