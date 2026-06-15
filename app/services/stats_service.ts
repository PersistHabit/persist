import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import type { CategorySlug } from "#types/agenda";
import type {
	CategoryStat,
	DistributionSlice,
	Stats,
	WeekdayStat,
} from "#types/stats";
import { isItemDueOn } from "../helpers/agenda.js";

const WINDOW_DAYS = 14;
const WEEK_DAYS = 7;

export class StatsService {
	/**
	 * Calcule une vue d'ensemble des tâches sur les derniers jours :
	 * taux de complétion global, par jour de la semaine, par catégorie
	 * et répartition des occurrences par catégorie.
	 */
	async getStats(userId: number): Promise<Stats> {
		const today = DateTime.now().startOf("day");
		const windowStart = today.minus({ days: WINDOW_DAYS - 1 });
		const weekStart = today.minus({ days: WEEK_DAYS - 1 });

		const items = await AgendaItem.query()
			.where("user_id", userId)
			.where("is_active", true)
			.where("start_date", "<=", today.toFormat("yyyy-MM-dd"))
			.preload("completions", (q) => {
				q.where("occurrence_date", ">=", windowStart.toFormat("yyyy-MM-dd"));
			});

		// Ensemble des occurrences complétées : "itemId|yyyy-MM-dd".
		const completed = new Set<string>();
		for (const item of items) {
			for (const completion of item.completions) {
				completed.add(
					`${item.id}|${completion.occurrenceDate.toFormat("yyyy-MM-dd")}`,
				);
			}
		}

		let totalDue = 0;
		let totalDone = 0;

		const week: WeekdayStat[] = Array.from({ length: WEEK_DAYS }, (_, i) => {
			const day = weekStart.plus({ days: i });
			return {
				label: day.setLocale("fr").toFormat("ccc"),
				completed: 0,
				total: 0,
				rate: 0,
			};
		});

		const categoryTotals = new Map<
			CategorySlug,
			{ completed: number; total: number }
		>();

		for (const item of items) {
			const category = item.category as CategorySlug;

			for (let i = 0; i < WINDOW_DAYS; i++) {
				const day = windowStart.plus({ days: i });
				if (!isItemDueOn(item, day)) continue;

				const isDone = completed.has(
					`${item.id}|${day.toFormat("yyyy-MM-dd")}`,
				);

				totalDue++;
				if (isDone) totalDone++;

				const bucket = categoryTotals.get(category) ?? {
					completed: 0,
					total: 0,
				};
				bucket.total++;
				if (isDone) bucket.completed++;
				categoryTotals.set(category, bucket);

				const weekIndex = Math.floor(day.diff(weekStart, "days").days);
				if (weekIndex >= 0 && weekIndex < WEEK_DAYS) {
					week[weekIndex].total++;
					if (isDone) week[weekIndex].completed++;
				}
			}
		}

		for (const day of week) {
			day.rate = rate(day.completed, day.total);
		}

		const categories: CategoryStat[] = [...categoryTotals.entries()]
			.map(([slug, bucket]) => ({
				slug,
				completed: bucket.completed,
				total: bucket.total,
				rate: rate(bucket.completed, bucket.total),
			}))
			.sort((a, b) => b.rate - a.rate || b.total - a.total);

		const distribution: DistributionSlice[] = categories
			.map(({ slug, total }) => ({ slug, value: total }))
			.filter((slice) => slice.value > 0);

		return {
			windowDays: WINDOW_DAYS,
			last: {
				completed: totalDone,
				total: totalDue,
				rate: rate(totalDone, totalDue),
			},
			week,
			categories,
			distribution,
		};
	}
}

function rate(completed: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((completed / total) * 100);
}
