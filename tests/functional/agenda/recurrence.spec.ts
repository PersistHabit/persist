import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import AgendaItemCompletion from "#models/agenda_item_completion";
import AgendaItemPause from "#models/agenda_item_pause";
import User from "#models/user";
import { AgendaService } from "#services/agenda_service";

async function createUser() {
	return User.create({
		fullName: "Test User",
		email: `test-${Math.random().toString(36).slice(2)}@example.com`,
		password: await hash.make("Password123!"),
	});
}

const today = DateTime.now().startOf("day");
const todayWeekday = today.toJSDate().getDay();

test.group("AgendaService.listTodayItems — récurrence once", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("apparaît uniquement si startDate = aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Once today",
			dayMoment: "morning",
			category: "health",
			startDate: today,
			recurrenceType: "once",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
		assert.equal(items[0].title, "Once today");
	});

	test("n'apparaît pas si startDate = hier", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Once yesterday",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 1 }),
			recurrenceType: "once",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("n'apparaît pas si startDate = demain", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Once tomorrow",
			dayMoment: "morning",
			category: "health",
			startDate: today.plus({ days: 1 }),
			recurrenceType: "once",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});
});

test.group("AgendaService.listTodayItems — récurrence daily", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("apparaît si startDate <= aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Daily",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 10 }),
			recurrenceType: "daily",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
	});

	test("n'apparaît pas si startDate > aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Future daily",
			dayMoment: "morning",
			category: "health",
			startDate: today.plus({ days: 1 }),
			recurrenceType: "daily",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("n'apparaît pas si endDate < aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Expired daily",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 10 }),
			endDate: today.minus({ days: 1 }),
			recurrenceType: "daily",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("apparaît si endDate = aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Ends today",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 5 }),
			endDate: today,
			recurrenceType: "daily",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
	});
});

test.group("AgendaService.listTodayItems — récurrence weekly", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("apparaît si weekDays contient le jour actuel", async ({ assert }) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Weekly today",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ weeks: 2 }),
			recurrenceType: "weekly",
			weekDays: [todayWeekday],
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
	});

	test("n'apparaît pas si weekDays ne contient pas le jour actuel", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();
		const wrongDay = (todayWeekday + 1) % 7;

		await AgendaItem.create({
			userId: user.id,
			title: "Weekly wrong day",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ weeks: 2 }),
			recurrenceType: "weekly",
			weekDays: [wrongDay],
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("utilise le jour de startDate par défaut si weekDays est vide", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();

		// startDate a le même jour de semaine qu'aujourd'hui (7 jours avant)
		await AgendaItem.create({
			userId: user.id,
			title: "Weekly default day",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ weeks: 1 }),
			recurrenceType: "weekly",
			weekDays: null,
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
	});
});

test.group("AgendaService.listTodayItems — récurrence custom", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("apparaît si l'intervalle et le jour correspondent (toutes les 2 semaines)", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();

		// 2 semaines en arrière → weeksDiff = 2, 2 % 2 === 0 → ok
		await AgendaItem.create({
			userId: user.id,
			title: "Custom every 2w",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ weeks: 2 }),
			recurrenceType: "custom",
			recurrenceUnit: "week",
			recurrenceInterval: 2,
			weekDays: [todayWeekday],
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
	});

	test("n'apparaît pas si l'intervalle ne correspond pas (toutes les 2 semaines, décalage de 1)", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();

		// 1 semaine en arrière → weeksDiff = 1, 1 % 2 !== 0 → non
		await AgendaItem.create({
			userId: user.id,
			title: "Custom every 2w off",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ weeks: 1 }),
			recurrenceType: "custom",
			recurrenceUnit: "week",
			recurrenceInterval: 2,
			weekDays: [todayWeekday],
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("n'apparaît pas si le jour ne correspond pas malgré l'intervalle", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();
		const wrongDay = (todayWeekday + 1) % 7;

		await AgendaItem.create({
			userId: user.id,
			title: "Custom wrong day",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ weeks: 2 }),
			recurrenceType: "custom",
			recurrenceUnit: "week",
			recurrenceInterval: 2,
			weekDays: [wrongDay],
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});
});

test.group("AgendaService.listTodayItems — pause et complétion", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("item en pause : apparaît avec isPaused=true et activePause renseigné", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();

		const item = await AgendaItem.create({
			userId: user.id,
			title: "Paused event",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 5 }),
			recurrenceType: "daily",
			isActive: true,
		});

		await AgendaItemPause.create({
			agendaItemId: item.id,
			startedAt: today.minus({ days: 2 }),
			endedAt: null,
		});

		const pauseStartStr = today.minus({ days: 2 }).toFormat("yyyy-MM-dd");

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
		assert.isTrue(items[0].isPaused);
		assert.isNotNull(items[0].activePause);
		const pause = items[0].activePause;
		assert.equal(pause?.startedAt, pauseStartStr);
		assert.isNull(pause?.endedAt);
	});

	test("item complété : apparaît avec isCompleted=true et completionId", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();

		const item = await AgendaItem.create({
			userId: user.id,
			title: "Completed event",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 5 }),
			recurrenceType: "daily",
			isActive: true,
		});

		const completion = await AgendaItemCompletion.create({
			agendaItemId: item.id,
			occurrenceDate: today,
			completedAt: DateTime.now(),
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
		assert.isTrue(items[0].isCompleted);
		assert.equal(items[0].completionId, completion.id);
	});

	test("item non complété : isCompleted=false et completionId=null", async ({
		assert,
	}) => {
		const user = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: user.id,
			title: "Not completed",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 1 }),
			recurrenceType: "daily",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 1);
		assert.isFalse(items[0].isCompleted);
		assert.isNull(items[0].completionId);
	});

	test("n'inclut pas les items des autres utilisateurs", async ({ assert }) => {
		const user = await createUser();
		const otherUser = await createUser();
		const service = new AgendaService();

		await AgendaItem.create({
			userId: otherUser.id,
			title: "Other user event",
			dayMoment: "morning",
			category: "health",
			startDate: today.minus({ days: 1 }),
			recurrenceType: "daily",
			isActive: true,
		});

		const items = await service.listTodayItems(user.id);
		assert.lengthOf(items, 0);
	});
});
