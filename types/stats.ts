import type { CategorySlug } from "./agenda.js";

export type CompletionSummary = {
	completed: number;
	total: number;
	rate: number;
};

export type WeekdayStat = {
	label: string;
	completed: number;
	total: number;
	rate: number;
};

export type CategoryStat = {
	slug: CategorySlug;
	completed: number;
	total: number;
	rate: number;
};

export type DistributionSlice = {
	slug: CategorySlug;
	value: number;
};

export type Stats = {
	windowDays: number;
	last: CompletionSummary;
	week: WeekdayStat[];
	categories: CategoryStat[];
	distribution: DistributionSlice[];
};
