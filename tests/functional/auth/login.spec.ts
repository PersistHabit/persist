import hash from "@adonisjs/core/services/hash";
import testUtils from "@adonisjs/core/services/test_utils";
import { test } from "@japa/runner";
import User from "#models/user";

test.group("User authentication", (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());
	group.each.setup(async () => {
		await User.create({
			fullName: "John Doe",
			email: "john.doe@example.com",
			password: await hash.make("Password123!"),
		});
	});

	test("Login succeeds with valid credentials", async ({ client }) => {
		const response = await client
			.post("/auth/login")
			.redirects(0)
			.withCsrfToken()
			.form({
				email: "john.doe@example.com",
				password: "Password123!",
			});

		response.assertStatus(302);
		response.assertHeader("location", "/");
	});

	test("Login fails with wrong password", async ({ client }) => {
		const response = await client
			.post("/auth/login")
			.redirects(0)
			.withCsrfToken()
			.header("referer", "/login")
			.form({
				email: "john.doe@example.com",
				password: "WrongPassword",
			});

		response.assertStatus(302);
		response.assertHeader("location", "/login");
	});

	test("Login fails with invalid payload", async ({ client }) => {
		const response = await client
			.post("/auth/login")
			.redirects(0)
			.withCsrfToken()
			.header("referer", "/login")
			.form({
				email: "not-an-email",
				password: "",
			});
		response.assertStatus(302);
		response.assertHeader("location", "/login");
	});
});
