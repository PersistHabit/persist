import type { ApiResponse } from "@japa/api-client";
import { test } from "@japa/runner";

test.group("Auth rate limit", () => {
	test("Login is rate limited after too many attempts", async ({
		client,
		assert,
	}) => {
		let response: ApiResponse | undefined;

		for (let i = 0; i < 20; i++) {
			response = await client
				.post("/auth/login")
				.withCsrfToken()
				.header("x-forwarded-for", "10.0.0.1")
				.form({
					email: "john@doe.com",
					password: "wrong-password",
				});
		}

		assert.isDefined(response);
		assert.equal(response?.status(), 429);
	});
});
