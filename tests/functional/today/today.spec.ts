import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { DateTime } from "luxon";
import AgendaItem from "#models/agenda_item";
import AgendaItemCompletion from "#models/agenda_item_completion";
import User from "#models/user";

async function createUser() {
	return User.create({
		fullName: "Test User",
		email: `test-${Math.random().toString(36).slice(2)}@example.com`,
		password: await hash.make("Password123!"),
	});
}

async function createDailyItem(userId: number) {
	return AgendaItem.create({
		userId,
		title: "Daily habit",
		dayMoment: "morning",
		category: "health",
		startDate: DateTime.now().startOf("day").minus({ days: 1 }),
		recurrenceType: "daily",
		isActive: true,
	});
}

const todayStr = DateTime.now().startOf("day").toFormat("yyyy-MM-dd");

test.group("GET /", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client.get("/").redirects(0);
		response.assertStatus(302);
	});

	test("retourne 200 si authentifié", async ({ client }) => {
		const user = await createUser();
		const response = await client.get("/").loginAs(user);
		response.assertStatus(200);
	});
});

test.group("POST /agenda-items/:itemId/completions", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("marque un item comme complété", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createDailyItem(user.id);

		const response = await client
			.post(`/agenda-items/${item.id}/completions`)
			.loginAs(user)
			.withCsrfToken()
			.json({ occurrence_date: todayStr })
			.redirects(0);

		response.assertStatus(302);

		const completion = await AgendaItemCompletion.query()
			.where("agenda_item_id", item.id)
			.first();
		assert.isNotNull(completion);
		assert.equal(completion?.occurrenceDate.toFormat("yyyy-MM-dd"), todayStr);
	});

	test("est idempotent (firstOrCreate — pas de doublon)", async ({
		client,
		assert,
	}) => {
		const user = await createUser();
		const item = await createDailyItem(user.id);

		await client
			.post(`/agenda-items/${item.id}/completions`)
			.loginAs(user)
			.withCsrfToken()
			.json({ occurrence_date: todayStr })
			.redirects(0);

		await client
			.post(`/agenda-items/${item.id}/completions`)
			.loginAs(user)
			.withCsrfToken()
			.json({ occurrence_date: todayStr })
			.redirects(0);

		const count = await AgendaItemCompletion.query()
			.where("agenda_item_id", item.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 1);
	});

	test("ne peut pas compléter un item d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const item = await createDailyItem(owner.id);

		const response = await client
			.post(`/agenda-items/${item.id}/completions`)
			.loginAs(attacker)
			.withCsrfToken()
			.json({ occurrence_date: todayStr })
			.redirects(0);

		response.assertStatus(404);

		const completion = await AgendaItemCompletion.query()
			.where("agenda_item_id", item.id)
			.first();
		assert.isNull(completion);
	});

	test("redirige vers login si non authentifié", async ({ client }) => {
		const owner = await createUser();
		const item = await createDailyItem(owner.id);

		const response = await client
			.post(`/agenda-items/${item.id}/completions`)
			.withCsrfToken()
			.json({ occurrence_date: todayStr })
			.redirects(0);

		response.assertStatus(302);
	});
});

test.group(
	"DELETE /agenda-items/:itemId/completions/:completionId",
	(group) => {
		group.each.setup(() => testUtils.db().withGlobalTransaction());

		test("supprime une complétion existante", async ({ client, assert }) => {
			const user = await createUser();
			const item = await createDailyItem(user.id);
			const completion = await AgendaItemCompletion.create({
				agendaItemId: item.id,
				occurrenceDate: DateTime.now().startOf("day"),
				completedAt: DateTime.now(),
			});

			const response = await client
				.delete(`/agenda-items/${item.id}/completions/${completion.id}`)
				.loginAs(user)
				.withCsrfToken()
				.redirects(0);

			response.assertStatus(302);

			const found = await AgendaItemCompletion.find(completion.id);
			assert.isNull(found);
		});

		test("ne peut pas supprimer la complétion d'un autre utilisateur", async ({
			client,
			assert,
		}) => {
			const owner = await createUser();
			const attacker = await createUser();
			const item = await createDailyItem(owner.id);
			const completion = await AgendaItemCompletion.create({
				agendaItemId: item.id,
				occurrenceDate: DateTime.now().startOf("day"),
				completedAt: DateTime.now(),
			});

			const response = await client
				.delete(`/agenda-items/${item.id}/completions/${completion.id}`)
				.loginAs(attacker)
				.withCsrfToken()
				.redirects(0);

			response.assertStatus(404);

			const found = await AgendaItemCompletion.find(completion.id);
			assert.isNotNull(found);
		});

		test("redirige vers login si non authentifié", async ({
			client,
			assert,
		}) => {
			const owner = await createUser();
			const item = await createDailyItem(owner.id);
			const completion = await AgendaItemCompletion.create({
				agendaItemId: item.id,
				occurrenceDate: DateTime.now().startOf("day"),
				completedAt: DateTime.now(),
			});

			const response = await client
				.delete(`/agenda-items/${item.id}/completions/${completion.id}`)
				.withCsrfToken()
				.redirects(0);

			response.assertStatus(302);

			const found = await AgendaItemCompletion.find(completion.id);
			assert.isNotNull(found);
		});
	},
);
