import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { DateTime } from "luxon";
import Journal from "#models/journal";
import User from "#models/user";

async function createUser() {
	return User.create({
		fullName: "Test User",
		email: `test-${Math.random().toString(36).slice(2)}@example.com`,
		password: await hash.make("Password123!"),
	});
}

async function createJournalEntry(
	userId: number,
	overrides: Partial<InstanceType<typeof Journal>> = {},
) {
	return Journal.create({
		userId,
		entryDate: DateTime.now().startOf("day"),
		mood: "good",
		content: "Bonne journée",
		...overrides,
	});
}

test.group("GET /journal", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client.get("/journal").redirects(0);
		response.assertStatus(302);
	});

	test("retourne 200 si authentifié", async ({ client }) => {
		const user = await createUser();
		const response = await client.get("/journal").loginAs(user);
		response.assertStatus(200);
	});
});

test.group("POST /journal", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client
			.post("/journal")
			.withCsrfToken()
			.form({ mood: "good", content: "Test" })
			.redirects(0);
		response.assertStatus(302);
	});

	test("crée une entrée du jour", async ({ client, assert }) => {
		const user = await createUser();

		const response = await client
			.post("/journal")
			.loginAs(user)
			.withCsrfToken()
			.form({ mood: "great", content: "Super journée !" })
			.redirects(0);

		response.assertStatus(302);

		const entry = await Journal.query().where("userId", user.id).first();
		assert.isNotNull(entry);
		assert.equal(entry?.mood, "great");
		assert.equal(entry?.content, "Super journée !");
	});

	test("met à jour l'entrée existante du jour", async ({ client, assert }) => {
		const user = await createUser();
		await createJournalEntry(user.id, {
			mood: "neutral",
			content: "Début de journée",
		});

		await client
			.post("/journal")
			.loginAs(user)
			.withCsrfToken()
			.form({ mood: "great", content: "Finalement super !" })
			.redirects(0);

		const entries = await Journal.query().where("userId", user.id);
		assert.lengthOf(entries, 1);
		assert.equal(entries[0].mood, "great");
		assert.equal(entries[0].content, "Finalement super !");
	});

	test("supprime l'entrée si le contenu est null", async ({
		client,
		assert,
	}) => {
		const user = await createUser();
		await createJournalEntry(user.id);

		await client
			.post("/journal")
			.loginAs(user)
			.withCsrfToken()
			.json({ mood: "good", content: null })
			.redirects(0);

		const entry = await Journal.query().where("userId", user.id).first();
		assert.isNull(entry);
	});

	test("rejette un mood invalide", async ({ client, assert }) => {
		const user = await createUser();

		await client
			.post("/journal")
			.loginAs(user)
			.withCsrfToken()
			.form({ mood: "invalid_mood", content: "Test" })
			.redirects(0);

		const entry = await Journal.query().where("userId", user.id).first();
		assert.isNull(entry);
	});
});
