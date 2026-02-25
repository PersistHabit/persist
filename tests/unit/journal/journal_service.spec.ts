import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import { DateTime } from "luxon";
import Journal from "#models/journal";
import User from "#models/user";
import { JournalService } from "#services/journal_service";

const service = new JournalService();

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

test.group("JournalService.getToday", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("retourne null si aucune entrée aujourd'hui", async ({ assert }) => {
		const user = await createUser();
		const entry = await service.getToday(user.id);
		assert.isNull(entry);
	});

	test("retourne l'entrée du jour", async ({ assert }) => {
		const user = await createUser();
		await createJournalEntry(user.id, { mood: "great", content: "Top" });

		const entry = await service.getToday(user.id);
		assert.isNotNull(entry);
		assert.equal(entry?.mood, "great");
		assert.equal(entry?.content, "Top");
	});

	test("ne retourne pas l'entrée d'un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		await createJournalEntry(other.id);

		const entry = await service.getToday(user.id);
		assert.isNull(entry);
	});

	test("ne retourne pas une entrée d'un autre jour", async ({ assert }) => {
		const user = await createUser();
		await createJournalEntry(user.id, {
			entryDate: DateTime.now().startOf("day").minus({ days: 1 }),
		});

		const entry = await service.getToday(user.id);
		assert.isNull(entry);
	});
});

test.group("JournalService.getList", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("retourne une liste vide si aucune entrée", async ({ assert }) => {
		const user = await createUser();
		const result = await service.getList(user.id, 1);
		assert.lengthOf(result.all(), 0);
	});

	test("retourne les entrées triées par date décroissante", async ({
		assert,
	}) => {
		const user = await createUser();
		await createJournalEntry(user.id, {
			entryDate: DateTime.now().startOf("day").minus({ days: 2 }),
			mood: "bad",
		});
		await createJournalEntry(user.id, {
			entryDate: DateTime.now().startOf("day").minus({ days: 1 }),
			mood: "neutral",
		});
		await createJournalEntry(user.id, {
			entryDate: DateTime.now().startOf("day"),
			mood: "great",
		});

		const result = await service.getList(user.id, 1);
		const entries = result.all();
		assert.lengthOf(entries, 3);
		assert.equal(entries[0].mood, "great");
		assert.equal(entries[1].mood, "neutral");
		assert.equal(entries[2].mood, "bad");
	});

	test("ne retourne pas les entrées d'un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		await createJournalEntry(other.id);

		const result = await service.getList(user.id, 1);
		assert.lengthOf(result.all(), 0);
	});
});

test.group("JournalService.upsertToday", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("crée une nouvelle entrée", async ({ assert }) => {
		const user = await createUser();
		await service.upsertToday(user.id, "great", "Super journée");

		const entry = await Journal.query().where("userId", user.id).first();
		assert.isNotNull(entry);
		assert.equal(entry?.mood, "great");
		assert.equal(entry?.content, "Super journée");
	});

	test("met à jour l'entrée existante", async ({ assert }) => {
		const user = await createUser();
		await createJournalEntry(user.id, { mood: "neutral", content: "Bof" });

		await service.upsertToday(user.id, "great", "Finalement super");

		const entries = await Journal.query().where("userId", user.id);
		assert.lengthOf(entries, 1);
		assert.equal(entries[0].mood, "great");
		assert.equal(entries[0].content, "Finalement super");
	});

	test("supprime l'entrée si content est null", async ({ assert }) => {
		const user = await createUser();
		await createJournalEntry(user.id);

		await service.upsertToday(user.id, "good", null);

		const entry = await Journal.query().where("userId", user.id).first();
		assert.isNull(entry);
	});

	test("supprime l'entrée si content est une chaîne vide", async ({
		assert,
	}) => {
		const user = await createUser();
		await createJournalEntry(user.id);

		await service.upsertToday(user.id, "good", "");

		const entry = await Journal.query().where("userId", user.id).first();
		assert.isNull(entry);
	});

	test("ne crée pas d'entrée si content vide et aucune entrée existante", async ({
		assert,
	}) => {
		const user = await createUser();
		await service.upsertToday(user.id, "good", null);

		const count = await Journal.query()
			.where("userId", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});
});
