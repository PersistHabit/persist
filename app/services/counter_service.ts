import { DateTime } from "luxon";
import Counter from "#models/counter";
import type { CounterPayload } from "#types/counter";

export class CounterService {
	async index(userId: number) {
		return Counter.query().where("userId", userId).orderBy("createdAt", "asc");
	}

	async listPinned(userId: number) {
		return Counter.query()
			.where("user_id", userId)
			.andWhere("pinned", true)
			.orderBy("createdAt", "asc");
	}

	async createCounter(payload: CounterPayload, userId: number) {
		return Counter.create({
			userId,
			title: payload.title,
			pinned: payload.pinned,
			value: payload.value,
			initialValue: payload.value,
			direction: payload.direction,
			trigger: payload.trigger,
			color: payload.color,
			resetEachDay: payload.resetEachDay,
		});
	}

	async increment(userId: number, counterId: number) {
		const counter = await Counter.query()
			.where("user_id", userId)
			.andWhere("id", counterId)
			.firstOrFail();
		counter.value += 1;
		await counter.save();
	}

	async decrement(userId: number, counterId: number) {
		const counter = await Counter.query()
			.where("user_id", userId)
			.andWhere("id", counterId)
			.firstOrFail();
		if (counter.value >= 1) {
			counter.value -= 1;
		}
		await counter.save();
	}

	async resetCounter(userId: number, counterId: number) {
		const counter = await Counter.query()
			.where("user_id", userId)
			.andWhere("id", counterId)
			.firstOrFail();
		counter.value = counter.initialValue;
		await counter.save();
	}

	async updateCounter(
		userId: number,
		counterId: number,
		payload: CounterPayload,
	) {
		const counter = await Counter.query()
			.where("user_id", userId)
			.andWhere("id", counterId)
			.firstOrFail();
		counter.merge({ ...payload, initialValue: payload.value });
		await counter.save();
	}

	async deleteCounter(userId: number, counterId: number) {
		const counter = await Counter.query()
			.where("user_id", userId)
			.andWhere("id", counterId)
			.firstOrFail();
		await counter.delete();
	}

	async resetDailyCounters(userId: number) {
		const today = DateTime.now().startOf("day");
		const counters = await Counter.query()
			.where("user_id", userId)
			.where("reset_each_day", true);

		for (const counter of counters) {
			const reference = counter.lastAppliedDate
				? counter.lastAppliedDate.startOf("day")
				: counter.createdAt.startOf("day");

			if (today <= reference) continue;

			counter.value = counter.initialValue;
			counter.lastAppliedDate = today;
			await counter.save();
		}
	}

	async applyDailyTicks(userId: number) {
		const today = DateTime.now().startOf("day");
		const counters = await Counter.query()
			.where("user_id", userId)
			.where("trigger", "daily");

		for (const counter of counters) {
			const reference = counter.lastAppliedDate
				? counter.lastAppliedDate.startOf("day")
				: counter.createdAt.startOf("day");

			const daysToApply = Math.floor(today.diff(reference, "days").days);
			if (daysToApply <= 0) continue;

			if (counter.direction === "increment") {
				counter.value += daysToApply;
			} else {
				counter.value = Math.max(0, counter.value - daysToApply);
			}

			counter.lastAppliedDate = today;
			await counter.save();
		}
	}
}
