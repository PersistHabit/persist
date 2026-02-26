import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import User from "#models/user";

test.group("Auth register", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test("Register succeeds with valid data", async ({ client }) => {
		const response = await client
			.post("/auth/register")
			.redirects(0)
			.withCsrfToken()
			.form({
				fullName: "John Doe",
				email: "john.doe@example.com",
				password: "Password123!",
				password_confirmation: "Password123!",
			});

		response.assertStatus(302);
		response.assertHeader("location", "/login");
	});

	test("register fails when email already exists", async ({
		client,
		assert,
	}) => {
		await User.create({
			fullName: "Existing User",
			email: "john.doe@example.com",
			password: await hash.make("Password123!"),
		});

		const response = await client
			.post("/auth/register")
			.withCsrfToken()
			.redirects(0)
			.form({
				fullName: "John Doe",
				email: "john.doe@example.com",
				password: "Password123!",
				password_confirmation: "Password123!",
			});

		response.assertStatus(302);
		const inputErrors = response.flashMessage("inputErrorsBag") as Record<
			string,
			string[]
		>;
		assert.property(inputErrors, "email");
	});
});
