import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import Shopping from "#models/shopping";
import User from "#models/user";

async function createUser() {
	return User.create({
		fullName: "Test User",
		email: `test-${Math.random().toString(36).slice(2)}@example.com`,
		password: await hash.make("Password123!"),
	});
}

async function createShoppingItem(
	userId: number,
	overrides: Partial<{
		name: string;
		category: string;
		pinned: boolean;
		done: boolean;
	}> = {},
) {
	return Shopping.create({
		userId,
		name: "Pommes",
		category: "general",
		pinned: false,
		done: false,
		...overrides,
	});
}

test.group("GET /shopping", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client.get("/shopping").redirects(0);
		response.assertStatus(302);
	});

	test("retourne 200 si authentifié", async ({ client }) => {
		const user = await createUser();
		const response = await client.get("/shopping").loginAs(user);
		response.assertStatus(200);
	});
});

test.group("POST /shopping", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const response = await client
			.post("/shopping")
			.withCsrfToken()
			.form({ name: "Lait", category: "general", pinned: false })
			.redirects(0);
		response.assertStatus(302);
	});

	test("crée un item de shopping", async ({ client, assert }) => {
		const user = await createUser();

		const response = await client
			.post("/shopping")
			.loginAs(user)
			.withCsrfToken()
			.form({ name: "Chocolat", category: "general", pinned: false })
			.redirects(0);

		response.assertStatus(302);

		const item = await Shopping.query().where("userId", user.id).first();
		assert.isNotNull(item);
		assert.equal(item?.name, "Chocolat");
		assert.equal(item?.category, "general");
		assert.isFalse(item?.pinned);
	});

	test("rejette un nom vide", async ({ client, assert }) => {
		const user = await createUser();

		await client
			.post("/shopping")
			.loginAs(user)
			.withCsrfToken()
			.form({ name: "", category: "general", pinned: false })
			.redirects(0);

		const count = await Shopping.query()
			.where("userId", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});

	test("rejette une catégorie invalide", async ({ client, assert }) => {
		const user = await createUser();

		await client
			.post("/shopping")
			.loginAs(user)
			.withCsrfToken()
			.form({ name: "Truc", category: "invalid_cat", pinned: false })
			.redirects(0);

		const count = await Shopping.query()
			.where("userId", user.id)
			.count("* as total");
		assert.equal(Number(count[0].$extras.total), 0);
	});
});

test.group("PATCH /shopping/:id/done", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id);

		const response = await client
			.patch(`/shopping/${item.id}/done`)
			.withCsrfToken()
			.redirects(0);
		response.assertStatus(302);
	});

	test("marque un item comme fait", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { done: false });

		const response = await client
			.patch(`/shopping/${item.id}/done`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await item.refresh();
		assert.isTrue(item.done);
	});

	test("retourne 404 si l'item appartient à un autre utilisateur", async ({
		client,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		const response = await client
			.patch(`/shopping/${item.id}/done`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);
	});
});

test.group("PATCH /shopping/:id/undone", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("marque un item comme non fait", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { done: true });

		const response = await client
			.patch(`/shopping/${item.id}/undone`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await item.refresh();
		assert.isFalse(item.done);
	});

	test("retourne 404 si l'item appartient à un autre utilisateur", async ({
		client,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id, { done: true });

		const response = await client
			.patch(`/shopping/${item.id}/undone`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);
	});
});

test.group("PATCH /shopping/:id/pin", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("épingle un item", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { pinned: false });

		const response = await client
			.patch(`/shopping/${item.id}/pin`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await item.refresh();
		assert.isTrue(item.pinned);
	});

	test("retourne 404 si l'item appartient à un autre utilisateur", async ({
		client,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		const response = await client
			.patch(`/shopping/${item.id}/pin`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);
	});
});

test.group("PATCH /shopping/:id/unpin", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("désépingle un item", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { pinned: true });

		const response = await client
			.patch(`/shopping/${item.id}/unpin`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		await item.refresh();
		assert.isFalse(item.pinned);
	});

	test("retourne 404 si l'item appartient à un autre utilisateur", async ({
		client,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id, { pinned: true });

		const response = await client
			.patch(`/shopping/${item.id}/unpin`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);
	});
});

test.group("PUT /shopping/:id", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id);

		const response = await client
			.put(`/shopping/${item.id}`)
			.withCsrfToken()
			.form({ name: "Nouveau", category: "general", pinned: false })
			.redirects(0);
		response.assertStatus(302);
	});

	test("met à jour un item", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, {
			name: "Ancien",
			category: "general",
		});

		const response = await client
			.put(`/shopping/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.form({ name: "Nouveau", category: "electronics", pinned: true })
			.redirects(0);

		response.assertStatus(302);

		await item.refresh();
		assert.equal(item.name, "Nouveau");
		assert.equal(item.category, "electronics");
		assert.isTrue(item.pinned);
	});

	test("rejette un nom vide", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { name: "Original" });

		await client
			.put(`/shopping/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.form({ name: "", category: "general", pinned: false })
			.redirects(0);

		await item.refresh();
		assert.equal(item.name, "Original");
	});

	test("retourne 404 si l'item appartient à un autre utilisateur", async ({
		client,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		const response = await client
			.put(`/shopping/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.form({ name: "Hack", category: "general", pinned: false })
			.redirects(0);

		response.assertStatus(404);
	});
});

test.group("DELETE /shopping/:id", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("redirige vers login si non authentifié", async ({ client }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id);

		const response = await client
			.delete(`/shopping/${item.id}`)
			.withCsrfToken()
			.redirects(0);
		response.assertStatus(302);
	});

	test("supprime un item", async ({ client, assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id);

		const response = await client
			.delete(`/shopping/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);

		const found = await Shopping.query().where("id", item.id).first();
		assert.isNull(found);
	});

	test("retourne 404 si l'item appartient à un autre utilisateur", async ({
		client,
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		const response = await client
			.delete(`/shopping/${item.id}`)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		const found = await Shopping.query().where("id", item.id).first();
		assert.isNotNull(found);
	});
});
