import type { PickerOptionTextOnly, PickerOptionWithIcon } from "./form.js";

export type DayMomentSlug = (typeof DayMomentRules)[number];
export type CategorySlug = (typeof CategoryRules)[number];
export type RecurrenceTypeSlug = (typeof RecurrenceTypeRules)[number];
export type WeekdaySlug = (typeof WeekdayRules)[number];
export type RecurrenceUnitSlug = (typeof RecurrenceUnitRules)[number];

export type DayMomentPickerInput = PickerOptionWithIcon<DayMomentSlug>;
export type CategoryPickerInput = PickerOptionWithIcon<CategorySlug>;
export type RecurrenceTypeRulePickerInput =
	PickerOptionTextOnly<RecurrenceTypeSlug>;
export type WeekdayRulePickerInput = PickerOptionTextOnly<WeekdaySlug>;

import {
	Book,
	Briefcase,
	Cloud,
	Dumbbell,
	Heart,
	Home,
	Moon,
	Sparkles,
	Sun,
	Users,
	Utensils,
} from "lucide-react";

export const RecurrenceUnitRules = ["week", "month"] as const;

export const RecurrenceTypeRules = [
	"once",
	"daily",
	"weekly",
	"monthly",
	"custom",
] as const;

export const RecurrenceTypes = {
	once: {
		kind: "text",
		slug: "once",
		label: "Une fois",
	},
	daily: {
		kind: "text",
		slug: "daily",
		label: "Chaque jour",
	},
	weekly: {
		kind: "text",
		slug: "weekly",
		label: "Chaque semaine",
	},
	monthly: {
		kind: "text",
		slug: "monthly",
		label: "Chaque mois",
	},
	custom: {
		kind: "text",
		slug: "custom",
		label: "Personnalisé",
	},
} as const satisfies Record<RecurrenceTypeSlug, RecurrenceTypeRulePickerInput>;

export const WeekdayRules = [
	"mon",
	"tue",
	"wed",
	"thu",
	"fri",
	"sat",
	"sun",
] as const;

export const Weekdays = {
	mon: {
		kind: "text",
		slug: "mon",
		label: "Lun",
	},
	tue: {
		kind: "text",
		slug: "tue",
		label: "Mar",
	},
	wed: {
		kind: "text",
		slug: "wed",
		label: "Mer",
	},
	thu: {
		kind: "text",
		slug: "thu",
		label: "Jeu",
	},
	fri: {
		kind: "text",
		slug: "fri",
		label: "Ven",
	},
	sat: {
		kind: "text",
		slug: "sat",
		label: "Sam",
	},
	sun: {
		kind: "text",
		slug: "sun",
		label: "Dim",
	},
} as const satisfies Record<WeekdaySlug, WeekdayRulePickerInput>;

export const WeekdaysMap = {
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6,
	sun: 0,
} as const;

export const NumberToWeekdayMap = Object.fromEntries(
	Object.entries(WeekdaysMap).map(([k, v]) => [v, k]),
) as Record<number, WeekdaySlug>;
export const DayMomentTagColor = {
	morning: "bg-moment-morning",
	afternoon: "bg-moment-afternoon",
	evening: "bg-moment-evening",
} as const;
export const DayMomentRules = ["morning", "afternoon", "evening"] as const;
export const DayMoments = {
	morning: {
		kind: "icon",
		slug: "morning",
		label: "Matin",
		icon: Sun,
		iconColor: "text-moment-morning",
		bgColor: "bg-moment-morning/20",
		ringColor: "ring-moment-morning",
	},
	afternoon: {
		kind: "icon",
		slug: "afternoon",
		label: "Après-midi",
		icon: Cloud,
		iconColor: "text-moment-afternoon",
		bgColor: "bg-moment-afternoon/20",
		ringColor: "ring-moment-afternoon",
	},
	evening: {
		kind: "icon",
		slug: "evening",
		label: "Soir",
		icon: Moon,
		iconColor: "text-moment-evening",
		bgColor: "bg-moment-evening/20",
		ringColor: "ring-moment-evening",
	},
} as const satisfies Record<DayMomentSlug, DayMomentPickerInput>;

export const CategoryRules = [
	"health",
	"sport",
	"work",
	"spirituality",
	"learning",
	"social",
	"home",
	"nutrition",
] as const;
export const Categories = {
	health: {
		kind: "icon",
		slug: "health",
		label: "Santé",
		icon: Heart,
		iconColor: "text-category-health",
		bgColor: "bg-category-health/15",
		ringColor: "ring-category-health",
	},
	sport: {
		kind: "icon",
		slug: "sport",
		label: "Sport",
		icon: Dumbbell,
		iconColor: "text-category-sport",
		bgColor: "bg-category-sport/15",
		ringColor: "ring-category-sport",
	},
	work: {
		kind: "icon",
		slug: "work",
		label: "Travail",
		icon: Briefcase,
		iconColor: "text-category-work",
		bgColor: "bg-category-work/15",
		ringColor: "ring-category-work",
	},
	spirituality: {
		kind: "icon",
		slug: "spirituality",
		label: "Spiritualité",
		icon: Sparkles,
		iconColor: "text-category-spirituality",
		bgColor: "bg-category-spirituality/15",
		ringColor: "ring-category-spirituality",
	},
	learning: {
		kind: "icon",
		slug: "learning",
		label: "Apprentissage",
		icon: Book,
		iconColor: "text-category-learning",
		bgColor: "bg-category-learning/15",
		ringColor: "ring-category-learning",
	},
	social: {
		kind: "icon",
		slug: "social",
		label: "Social",
		icon: Users,
		iconColor: "text-category-social",
		bgColor: "bg-category-social/15",
		ringColor: "ring-category-social",
	},
	home: {
		kind: "icon",
		slug: "home",
		label: "Maison",
		icon: Home,
		iconColor: "text-category-home",
		bgColor: "bg-category-home/15",
		ringColor: "ring-category-home",
	},
	nutrition: {
		kind: "icon",
		slug: "nutrition",
		label: "Nutrition",
		icon: Utensils,
		iconColor: "text-category-nutrition",
		bgColor: "bg-category-nutrition/15",
		ringColor: "ring-category-nutrition",
	},
} as const satisfies Record<CategorySlug, CategoryPickerInput>;

export type EventPayload = {
	title: string;
	dayMoment: DayMomentSlug;
	category: CategorySlug;
	startDate: Date;
	endDate?: Date | null;
	startHour?: number | null;
	recurrence: {
		type: RecurrenceTypeSlug;
		unit?: RecurrenceUnitSlug;
		interval?: number;
		days?: WeekdaySlug[];
	};
};

type AgendaBase = {
	id: number;
	title: string;
	dayMoment: DayMomentSlug;
	category: CategorySlug;
	startDate: Date;
	endDate: string | null;
	startHour: number | null;
};

export type ActivePause = {
	id: number;
	startedAt: string;
	endedAt: string | null;
};

export type AgendaItem = AgendaBase & {
	recurrenceType: RecurrenceTypeSlug;
	recurrenceUnit?: RecurrenceUnitSlug;
	recurrenceInterval?: number;
	weekDays: number[];
	isPaused: boolean;
	activePause: ActivePause | null;
	isCompleted: boolean;
	completionId: number | null;
};

export type AgendaItemOccurrence = AgendaBase & {
	recurrence: {
		type: RecurrenceTypeSlug;
		unit?: RecurrenceUnitSlug;
		interval?: number;
		days?: WeekdaySlug[];
	};
	isPaused: boolean;
	activePause: ActivePause | null;
};

export type NewEventFormData = {
	title: string;
	dayMoment: DayMomentSlug;
	category: CategorySlug;
	startDate: string;
	endDate: string;
	startHour?: number | null;
	recurrence: {
		type: RecurrenceTypeSlug;
		interval?: number;
		unit?: RecurrenceUnitSlug;
		days: WeekdaySlug[] | [];
	};
};
