import Shopping from "#models/shopping";
import type { ShoppingElementPayload } from "#types/shopping";

export class ShoppingService {
	async listItems(userId: number) {
		return Shopping.query().where("userId", userId).orderBy("createdAt", "asc");
	}

	async listPinned(userId: number) {
		return Shopping.query()
			.where("user_id", userId)
			.andWhere("pinned", true)
			.orderBy("createdAt", "asc");
	}

	async create(userId: number, payload: ShoppingElementPayload) {
		await Shopping.create({
			userId,
			...payload,
		});
	}

	async markAsDone(userId: number, shoppingItemId: number) {
		const shoppingItem = await Shopping.query()
			.where("user_id", userId)
			.andWhere("id", shoppingItemId)
			.firstOrFail();
		shoppingItem.done = true;
		await shoppingItem.save();
	}

	async markAsUndone(userId: number, shoppingItemId: number) {
		const shoppingItem = await Shopping.query()
			.where("user_id", userId)
			.andWhere("id", shoppingItemId)
			.firstOrFail();
		shoppingItem.done = false;
		await shoppingItem.save();
	}

	async pin(userId: number, shoppingItemId: number) {
		const shoppingItem = await Shopping.query()
			.where("user_id", userId)
			.andWhere("id", shoppingItemId)
			.firstOrFail();
		shoppingItem.pinned = true;
		await shoppingItem.save();
	}

	async unPin(userId: number, shoppingItemId: number) {
		const shoppingItem = await Shopping.query()
			.where("user_id", userId)
			.andWhere("id", shoppingItemId)
			.firstOrFail();
		shoppingItem.pinned = false;
		await shoppingItem.save();
	}

	async update(
		userId: number,
		shoppingItemId: number,
		payload: ShoppingElementPayload,
	) {
		const shoppingItem = await Shopping.query()
			.where("user_id", userId)
			.andWhere("id", shoppingItemId)
			.firstOrFail();
		shoppingItem.merge(payload);
		await shoppingItem.save();
	}

	async delete(userId: number, shoppingItemId: number) {
		const shoppingItem = await Shopping.query()
			.where("user_id", userId)
			.andWhere("id", shoppingItemId)
			.firstOrFail();

		await shoppingItem.delete();
	}
}
