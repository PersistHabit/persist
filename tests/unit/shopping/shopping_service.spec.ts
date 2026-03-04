import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import Shopping from "#models/shopping";
import User from "#models/user";
import { ShoppingService } from "#services/shopping_service";

const service = new ShoppingService();

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

test.group("ShoppingService.listItems", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("retourne une liste vide si aucun item", async ({ assert }) => {
		const user = await createUser();
		const items = await service.listItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("retourne les items de l'utilisateur", async ({ assert }) => {
		const user = await createUser();
		await createShoppingItem(user.id, { name: "Lait" });
		await createShoppingItem(user.id, { name: "Pain" });

		const items = await service.listItems(user.id);
		assert.lengthOf(items, 2);
	});

	test("ne retourne pas les items d'un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		await createShoppingItem(other.id, { name: "Beurre" });

		const items = await service.listItems(user.id);
		assert.lengthOf(items, 0);
	});

	test("retourne les items triés par createdAt asc", async ({ assert }) => {
		const user = await createUser();
		await createShoppingItem(user.id, { name: "Premier" });
		await createShoppingItem(user.id, { name: "Deuxième" });

		const items = await service.listItems(user.id);
		assert.equal(items[0].name, "Premier");
		assert.equal(items[1].name, "Deuxième");
	});
});

test.group("ShoppingService.listPinned", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("retourne uniquement les items épinglés", async ({ assert }) => {
		const user = await createUser();
		await createShoppingItem(user.id, { name: "Épinglé", pinned: true });
		await createShoppingItem(user.id, { name: "Normal", pinned: false });

		const items = await service.listPinned(user.id);
		assert.lengthOf(items, 1);
		assert.equal(items[0].name, "Épinglé");
	});

	test("retourne une liste vide si aucun item épinglé", async ({ assert }) => {
		const user = await createUser();
		await createShoppingItem(user.id, { pinned: false });

		const items = await service.listPinned(user.id);
		assert.lengthOf(items, 0);
	});

	test("ne retourne pas les items épinglés d'un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		await createShoppingItem(other.id, { pinned: true });

		const items = await service.listPinned(user.id);
		assert.lengthOf(items, 0);
	});
});

test.group("ShoppingService.create", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("crée un item", async ({ assert }) => {
		const user = await createUser();
		await service.create(user.id, {
			name: "Chocolat",
			category: "general",
			pinned: false,
		});

		const item = await Shopping.query().where("userId", user.id).first();
		assert.isNotNull(item);
		assert.equal(item?.name, "Chocolat");
		assert.equal(item?.category, "general");
		assert.isFalse(item?.pinned);
		assert.isFalse(item?.done);
	});

	test("crée un item épinglé", async ({ assert }) => {
		const user = await createUser();
		await service.create(user.id, {
			name: "Important",
			category: "tools",
			pinned: true,
		});

		const item = await Shopping.query().where("userId", user.id).first();
		assert.isTrue(item?.pinned);
	});
});

test.group("ShoppingService.markAsDone", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("marque un item comme fait", async ({ assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { done: false });

		await service.markAsDone(user.id, item.id);

		await item.refresh();
		assert.isTrue(item.done);
	});

	test("lève une erreur si l'item appartient à un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		await assert.rejects(() => service.markAsDone(user.id, item.id));
	});
});

test.group("ShoppingService.markAsUndone", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("marque un item comme non fait", async ({ assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { done: true });

		await service.markAsUndone(user.id, item.id);

		await item.refresh();
		assert.isFalse(item.done);
	});

	test("lève une erreur si l'item appartient à un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id, { done: true });

		await assert.rejects(() => service.markAsUndone(user.id, item.id));
	});
});

test.group("ShoppingService.pin", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("épingle un item", async ({ assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { pinned: false });

		await service.pin(user.id, item.id);

		await item.refresh();
		assert.isTrue(item.pinned);
	});

	test("lève une erreur si l'item appartient à un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		await assert.rejects(() => service.pin(user.id, item.id));
	});
});

test.group("ShoppingService.unPin", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("désépingle un item", async ({ assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, { pinned: true });

		await service.unPin(user.id, item.id);

		await item.refresh();
		assert.isFalse(item.pinned);
	});

	test("lève une erreur si l'item appartient à un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id, { pinned: true });

		await assert.rejects(() => service.unPin(user.id, item.id));
	});
});

test.group("ShoppingService.update", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("met à jour le nom et la catégorie", async ({ assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id, {
			name: "Ancien",
			category: "general",
		});

		await service.update(user.id, item.id, {
			name: "Nouveau",
			category: "electronics",
			pinned: false,
		});

		await item.refresh();
		assert.equal(item.name, "Nouveau");
		assert.equal(item.category, "electronics");
	});

	test("lève une erreur si l'item appartient à un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		await assert.rejects(() =>
			service.update(user.id, item.id, {
				name: "Hack",
				category: "general",
				pinned: false,
			}),
		);
	});
});

test.group("ShoppingService.delete", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("supprime un item", async ({ assert }) => {
		const user = await createUser();
		const item = await createShoppingItem(user.id);

		await service.delete(user.id, item.id);

		const found = await Shopping.query().where("id", item.id).first();
		assert.isNull(found);
	});

	test("lève une erreur si l'item appartient à un autre utilisateur", async ({
		assert,
	}) => {
		const user = await createUser();
		const other = await createUser();
		const item = await createShoppingItem(other.id);

		await assert.rejects(() => service.delete(user.id, item.id));

		const found = await Shopping.query().where("id", item.id).first();
		assert.isNotNull(found);
	});
});
