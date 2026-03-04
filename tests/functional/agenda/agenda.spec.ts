import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import AgendaItemPause from "#models/agenda_item_pause";
import User from "#models/user";

async function createUser() {
	return User.create({
		fullName: "Test User",
		email: `test-${Math.random().toString(36).slice(2)}@example.com`,
		password: await hash.make("Password123!"),
	});
}

async function createAgendaItem(
	userId: number,
	overrides: Partial<InstanceType<typeof AgendaItem>> = {},
) {
	return AgendaItem.create({
		userId,
		title: "Test Event",
		dayMoment: "morning",
		category: "health",
		startDate: DateTime.now().startOf("day"),
		recurrenceType: "daily",
		isActive: true,
		...overrides,
	});
}

const dailyPayload = {
	title: "Morning Run",
	dayMoment: "morning",
	category: "sport",
	startDate: "2026-02-24",
	recurrence: { type: "daily" },
};

test.group("GET /agenda", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client.get("/agenda").redirects(0);
		response.assertStatus(302);
	});

	test("retourne 200 si authentifié", async ({ client }) => {
		const user = await createUser();
		const response = await client.get("/agenda").loginAs(user);
		response.assertStatus(200);
	});
});

test.group("POST /agenda", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("crée un événement daily et redirige", async ({ client, assert }) => {
		const user = await createUser();

		const response = await client
			.post("/agenda")
			.loginAs(user)
			.withCsrfToken()
			.json(dailyPayload)
			.redirects(0);

		response.assertStatus(302);

		const count = await AgendaItem.query()
			.where("user_id", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 1);
	});

	test("crée un événement once", async ({ client, assert }) => {
		const user = await createUser();

		const response = await client
			.post("/agenda")
			.loginAs(user)
			.withCsrfToken()
			.json({
				title: "Doctor appointment",
				dayMoment: "afternoon",
				category: "health",
				startDate: "2026-03-01",
				recurrence: { type: "once" },
			})
			.redirects(0);

		response.assertStatus(302);

		const item = await AgendaItem.query()
			.where("user_id", user.id)
			.firstOrFail();
		assert.equal(item.recurrenceType, "once");
		assert.equal(item.title, "Doctor appointment");
	});

	test("crée un événement custom (toutes les 2 semaines)", async ({
		client,
		assert,
	}) => {
		const user = await createUser();

		const response = await client
			.post("/agenda")
			.loginAs(user)
			.withCsrfToken()
			.json({
				title: "Bi-weekly meeting",
				dayMoment: "morning",
				category: "work",
				startDate: "2026-02-24",
				recurrence: {
					type: "custom",
					unit: "week",
					interval: 2,
					days: ["mon"],
				},
			})
			.redirects(0);

		response.assertStatus(302);

		const item = await AgendaItem.query()
			.where("user_id", user.id)
			.firstOrFail();
		assert.equal(item.recurrenceType, "custom");
		assert.equal(item.recurrenceInterval, 2);
		assert.equal(item.recurrenceUnit, "week");
	});

	test("rejette un payload invalide (titre manquant)", async ({
		client,
		assert,
	}) => {
		const user = await createUser();

		const response = await client
			.post("/agenda")
			.loginAs(user)
			.withCsrfToken()
			.header("referer", "/agenda")
			.json({
				dayMoment: "morning",
				category: "health",
				startDate: "2026-02-24",
				recurrence: { type: "daily" },
			})
			.redirects(0);

		// Vine renvoie une redirection avec erreurs de validation
		response.assertStatus(302);
		const count = await AgendaItem.query()
			.where("user_id", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});

	test("rejette un payload custom sans unit/interval", async ({
		client,
		assert,
	}) => {
		const user = await createUser();

		const response = await client
			.post("/agenda")
			.loginAs(user)
			.withCsrfToken()
			.header("referer", "/agenda")
			.json({
				title: "Missing fields",
				dayMoment: "morning",
				category: "health",
				startDate: "2026-02-24",
				recurrence: { type: "custom" },
			})
			.redirects(0);

		response.assertStatus(302);
		const count = await AgendaItem.query()
			.where("user_id", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client
			.post("/agenda")
			.withCsrfToken()
			.json(dailyPayload)
			.redirects(0);
		response.assertStatus(302);
	});
});

test.group("PUT /agenda/:eventId", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("met à jour un événement existant", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createAgendaItem(user.id);

		const response = await client
			.put(`/agenda/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.json({
				title: "Updated title",
				dayMoment: "evening",
				category: "sport",
				startDate: "2026-02-24",
				recurrence: { type: "daily" },
			})
			.redirects(0);

		response.assertStatus(302);

		await item.refresh();
		assert.equal(item.title, "Updated title");
		assert.equal(item.dayMoment, "evening");
		assert.equal(item.category, "sport");
	});

	test("ne peut pas modifier l'événement d'un autre utilisateur", async ({
		client,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const item = await createAgendaItem(owner.id);

		const response = await client
			.put(`/agenda/${item.id}`)
			.loginAs(attacker)
			.withCsrfToken()
			.json({
				title: "Hacked",
				dayMoment: "morning",
				category: "health",
				startDate: "2026-02-24",
				recurrence: { type: "daily" },
			})
			.redirects(0);

		// firstOrFail lève une 404 si l'event n'appartient pas à l'utilisateur
		response.assertStatus(404);
	});
});

test.group("DELETE /agenda/:eventId", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("supprime un événement existant", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createAgendaItem(user.id);

		const response = await client
			.delete(`/agenda/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		const found = await AgendaItem.find(item.id);
		assert.isNull(found);
	});

	test("ne peut pas supprimer l'événement d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const item = await createAgendaItem(owner.id);

		const response = await client
			.delete(`/agenda/${item.id}`)
			.loginAs(attacker)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		const found = await AgendaItem.find(item.id);
		assert.isNotNull(found);
	});
});

test.group("POST /agenda/:eventId/pauses", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("crée une pause sans date de fin", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createAgendaItem(user.id);

		const response = await client
			.post(`/agenda/${item.id}/pauses`)
			.loginAs(user)
			.withCsrfToken()
			.json({ startedAt: "2026-02-24" })
			.redirects(0);

		response.assertStatus(302);

		const pauses = await AgendaItemPause.query().where(
			"agenda_item_id",
			item.id,
		);
		assert.lengthOf(pauses, 1);
		assert.isNull(pauses[0].endedAt);
	});

	test("crée une pause avec date de fin", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createAgendaItem(user.id);

		const response = await client
			.post(`/agenda/${item.id}/pauses`)
			.loginAs(user)
			.withCsrfToken()
			.json({ startedAt: "2026-02-24", endedAt: "2026-03-01" })
			.redirects(0);

		response.assertStatus(302);

		const pauses = await AgendaItemPause.query().where(
			"agenda_item_id",
			item.id,
		);
		assert.lengthOf(pauses, 1);
		assert.isNotNull(pauses[0].endedAt);
	});
});

test.group("DELETE /agenda/:eventId/pauses/:pauseId", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("supprime une pause existante", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createAgendaItem(user.id);
		const pause = await AgendaItemPause.create({
			agendaItemId: item.id,
			startedAt: DateTime.now().minus({ days: 1 }),
			endedAt: null,
		});

		const response = await client
			.delete(`/agenda/${item.id}/pauses/${pause.id}`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		const found = await AgendaItemPause.find(pause.id);
		assert.isNull(found);
	});

	test("ne peut pas supprimer la pause d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const item = await createAgendaItem(owner.id);
		const pause = await AgendaItemPause.create({
			agendaItemId: item.id,
			startedAt: DateTime.now().minus({ days: 1 }),
			endedAt: null,
		});

		const response = await client
			.delete(`/agenda/${item.id}/pauses/${pause.id}`)
			.loginAs(attacker)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		const found = await AgendaItemPause.find(pause.id);
		assert.isNotNull(found);
	});
});
