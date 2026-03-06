import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import Counter from "#models/counter";
import User from "#models/user";

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
		trigger: "manual",
		initialValue: 5,
		value: 5,
		color: "streak-0",
		...overrides,
	});
}

const validPayload = {
	title: "Nouveau compteur",
	pinned: false,
	value: 0,
	direction: "increment",
	trigger: "daily",
	color: "streak-0",
	resetEachDay: false,
};

test.group("GET /counters", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client.get("/counters").redirects(0);
		response.assertStatus(302);
	});

	test("retourne 200 si authentifié", async ({ client }) => {
		const user = await createUser();
		const response = await client.get("/counters").loginAs(user);
		response.assertStatus(200);
	});
});

test.group("POST /counters", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client
			.post("/counters")
			.withCsrfToken()
			.json(validPayload)
			.redirects(0);
		response.assertStatus(302);
	});

	test("crée un compteur", async ({ client, assert }) => {
		const user = await createUser();

		const response = await client
			.post("/counters")
			.loginAs(user)
			.withCsrfToken()
			.json(validPayload)
			.redirects(0);

		response.assertStatus(302);

		const counter = await Counter.query().where("userId", user.id).first();
		assert.isNotNull(counter);
		assert.equal(counter?.title, "Nouveau compteur");
		assert.equal(counter?.direction, "increment");
		assert.equal(counter?.trigger, "daily");
	});

	test("rejette un payload invalide (title manquant)", async ({
		client,
		assert,
	}) => {
		const user = await createUser();

		await client
			.post("/counters")
			.loginAs(user)
			.withCsrfToken()
			.json({ ...validPayload, title: "" })
			.redirects(0);

		const count = await Counter.query()
			.where("userId", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});

	test("rejette une direction invalide", async ({ client, assert }) => {
		const user = await createUser();

		await client
			.post("/counters")
			.loginAs(user)
			.withCsrfToken()
			.json({ ...validPayload, direction: "sideways" })
			.redirects(0);

		const count = await Counter.query()
			.where("userId", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});
});

test.group("PATCH /counters/:id/increment", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("incrémente le compteur de 1", async ({ client, assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 3 });

		const response = await client
			.patch(`/counters/${counter.id}/increment`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await counter.refresh();
		assert.equal(counter.value, 4);
	});

	test("ne peut pas incrémenter le compteur d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const counter = await createCounter(owner.id, { value: 3 });

		const response = await client
			.patch(`/counters/${counter.id}/increment`)
			.loginAs(attacker)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		await counter.refresh();
		assert.equal(counter.value, 3);
	});
});

test.group("PATCH /counters/:id/decrement", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("décrémente le compteur de 1", async ({ client, assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 5 });

		const response = await client
			.patch(`/counters/${counter.id}/decrement`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await counter.refresh();
		assert.equal(counter.value, 4);
	});

	test("ne descend pas sous 0", async ({ client, assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { value: 0 });

		await client
			.patch(`/counters/${counter.id}/decrement`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		await counter.refresh();
		assert.equal(counter.value, 0);
	});

	test("ne peut pas décrémenter le compteur d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const counter = await createCounter(owner.id, { value: 5 });

		const response = await client
			.patch(`/counters/${counter.id}/decrement`)
			.loginAs(attacker)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		await counter.refresh();
		assert.equal(counter.value, 5);
	});
});

test.group("PATCH /counters/:id/reset", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("remet le compteur à sa valeur initiale", async ({ client, assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, {
			initialValue: 10,
			value: 2,
		});

		const response = await client
			.patch(`/counters/${counter.id}/reset`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await counter.refresh();
		assert.equal(counter.value, 10);
	});

	test("ne peut pas reset le compteur d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const counter = await createCounter(owner.id, {
			initialValue: 10,
			value: 2,
		});

		const response = await client
			.patch(`/counters/${counter.id}/reset`)
			.loginAs(attacker)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		await counter.refresh();
		assert.equal(counter.value, 2);
	});
});

test.group("PUT /counters/:id", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("met à jour le compteur", async ({ client, assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id, { title: "Ancien titre" });

		const response = await client
			.put(`/counters/${counter.id}`)
			.loginAs(user)
			.withCsrfToken()
			.json({ ...validPayload, title: "Nouveau titre", pinned: true })
			.redirects(0);

		response.assertStatus(302);

		await counter.refresh();
		assert.equal(counter.title, "Nouveau titre");
		assert.isTrue(counter.pinned);
	});

	test("ne peut pas mettre à jour le compteur d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const counter = await createCounter(owner.id, { title: "Original" });

		const response = await client
			.put(`/counters/${counter.id}`)
			.loginAs(attacker)
			.withCsrfToken()
			.json({ ...validPayload, title: "Piraté" })
			.redirects(0);

		response.assertStatus(404);

		await counter.refresh();
		assert.equal(counter.title, "Original");
	});
});

test.group("DELETE /counters/:id", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("supprime le compteur", async ({ client, assert }) => {
		const user = await createUser();
		const counter = await createCounter(user.id);

		const response = await client
			.delete(`/counters/${counter.id}`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		const found = await Counter.find(counter.id);
		assert.isNull(found);
	});

	test("ne peut pas supprimer le compteur d'un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const owner = await createUser();
		const attacker = await createUser();
		const counter = await createCounter(owner.id);

		const response = await client
			.delete(`/counters/${counter.id}`)
			.loginAs(attacker)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		const found = await Counter.find(counter.id);
		assert.isNotNull(found);
	});
});
