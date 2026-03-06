import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { DateTime } from "luxon";
import Counter from "#models/counter";
import User from "#models/user";
import { CounterService } from "#services/counter_service";

const service = new CounterService();

async function createUser() {
	return User.create({
		fullName: "Test User",
		email: `test-${Math.random().toString(36).slice(2)}@example.com`,
		password: await hash.make("Password123!"),
	});
}

async function createCounter(
	userId: number,
	overrides: Partial<InstanceType<typeof Counter>> = {},
) {
	return Counter.create({
		userId,
		title: "Test counter",
		pinned: false,
		direction: "increment",
		trigger: "daily",
		initialValue: 0,
		value: 0,
		color: "streak-0",
		...overrides,
	});
}

test.group("CounterService.applyDailyTicks", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("ne fait rien pour un compteur manual", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			trigger: "manual",
			value: 5,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 5);
	});

	test("ne fait rien si déjà appliqué aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 3 });

		counter.lastAppliedDate = DateTime.now().startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 3);
	});

	test("incrémente de 1 jour", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "increment",
			value: 5,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 6);
	});

	test("décrémente de 1 jour", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "decrement",
			value: 5,
			color: "countdown-0",
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 4);
	});

	test("rattrape plusieurs jours manqués (incrément)", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "increment",
			value: 10,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 5 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 15);
	});

	test("rattrape plusieurs jours manqués (décrément)", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "decrement",
			value: 10,
			color: "countdown-0",
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 3 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 7);
	});

	test("décrément ne descend pas sous 0", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "decrement",
			value: 2,
			color: "countdown-0",
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 5 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 0);
	});

	test("met à jour lastAppliedDate à aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 0 });

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(
			counter.lastAppliedDate?.toFormat("yyyy-MM-dd"),
			DateTime.now().toFormat("yyyy-MM-dd"),
		);
	});

	test("est idempotent — double appel le même jour", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 0 });

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);
		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 1);
	});

	test("premier tick le lendemain de la création (lastAppliedDate null)", async ({
		assert,
	}) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 0 });

		// Simule createdAt = hier
		counter.createdAt = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 1);
	});

	test("pas de tick si créé aujourd'hui (lastAppliedDate null)", async ({
		assert,
	}) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 0 });
		// createdAt = aujourd'hui (valeur par défaut)

		await service.applyDailyTicks(user.id);

		await counter.refresh();
		assert.equal(counter.value, 0);
	});

	test("ne touche pas les compteurs d'un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const counterOther = await createCounter(other.id, { value: 10 });

		counterOther.lastAppliedDate = DateTime.now()
			.minus({ days: 2 })
			.startOf("day");
		await counterOther.save();

		await service.applyDailyTicks(user.id);

		await counterOther.refresh();
		assert.equal(counterOther.value, 10);
	});
});

test.group("CounterService.resetDailyCounters", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("ne fait rien si resetEachDay est false", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: false,
			initialValue: 0,
			value: 7,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(counter.value, 7);
	});

	test("ne fait rien si déjà réinitialisé aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: true,
			initialValue: 0,
			value: 5,
		});

		counter.lastAppliedDate = DateTime.now().startOf("day");
		await counter.save();

		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(counter.value, 5);
	});

	test("réinitialise la valeur à initialValue", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: true,
			initialValue: 3,
			value: 9,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(counter.value, 3);
	});

	test("met à jour lastAppliedDate à aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: true,
			value: 4,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(
			counter.lastAppliedDate?.toFormat("yyyy-MM-dd"),
			DateTime.now().toFormat("yyyy-MM-dd"),
		);
	});

	test("est idempotent — double appel le même jour", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: true,
			initialValue: 0,
			value: 8,
		});

		counter.lastAppliedDate = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.resetDailyCounters(user.id);
		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(counter.value, 0);
	});

	test("reset le lendemain de la création (lastAppliedDate null)", async ({
		assert,
	}) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: true,
			initialValue: 0,
			value: 6,
		});

		counter.createdAt = DateTime.now().minus({ days: 1 }).startOf("day");
		await counter.save();

		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(counter.value, 0);
	});

	test("pas de reset si créé aujourd'hui (lastAppliedDate null)", async ({
		assert,
	}) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			resetEachDay: true,
			initialValue: 0,
			value: 5,
		});
		// createdAt = aujourd'hui (valeur par défaut)

		await service.resetDailyCounters(user.id);

		await counter.refresh();
		assert.equal(counter.value, 5);
	});

	test("ne touche pas les compteurs d'un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const counterOther = await createCounter(other.id, {
			resetEachDay: true,
			initialValue: 0,
			value: 12,
		});

		counterOther.lastAppliedDate = DateTime.now()
			.minus({ days: 1 })
			.startOf("day");
		await counterOther.save();

		await service.resetDailyCounters(user.id);

		await counterOther.refresh();
		assert.equal(counterOther.value, 12);
	});
});

test.group("CounterService.createCounter", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("crée un compteur avec les bons attributs", async ({ assert }) => {
		const user = await createUser();

		await service.createCounter(
			{
				title: "Mon compteur",
				pinned: true,
				value: 5,
				direction: "increment",
				trigger: "daily",
				color: "streak-1",
				resetEachDay: true,
			},
			user.id,
		);

		const counter = await Counter.query().where("userId", user.id).first();
		assert.isNotNull(counter);
		assert.equal(counter?.title, "Mon compteur");
		assert.equal(counter?.value, 5);
		assert.equal(counter?.initialValue, 5);
		assert.isTrue(counter?.pinned);
	});
});

test.group("CounterService.increment / decrement / reset", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("increment ajoute 1", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			value: 3,
			trigger: "manual",
		});

		await service.increment(user.id, counter.id);

		await counter.refresh();
		assert.equal(counter.value, 4);
	});

	test("decrement retire 1", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "decrement",
			trigger: "manual",
			value: 3,
			color: "countdown-0",
		});

		await service.decrement(user.id, counter.id);

		await counter.refresh();
		assert.equal(counter.value, 2);
	});

	test("decrement ne descend pas sous 0", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			direction: "decrement",
			trigger: "manual",
			value: 0,
			color: "countdown-0",
		});

		await service.decrement(user.id, counter.id);

		await counter.refresh();
		assert.equal(counter.value, 0);
	});

	test("reset remet la valeur initiale", async ({ assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			initialValue: 10,
			value: 3,
			trigger: "manual",
		});

		await service.resetCounter(user.id, counter.id);

		await counter.refresh();
		assert.equal(counter.value, 10);
	});
});
