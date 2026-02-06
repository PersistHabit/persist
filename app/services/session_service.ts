import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";

type RegisterPayload = {
	fullName: string;
	email: string;
	password: string;
};

type AuthenticatePayload = {
	email: string;
	password: string;
	remember?: boolean;
};

export class SessionService {
	async register(payload: RegisterPayload) {
		await User.create(payload);
	}

	async authenticate({ auth }: HttpContext, payload: AuthenticatePayload) {
		const user = await User.verifyCredentials(payload.email, payload.password);

		await auth.use("web").login(user, payload.remember);
	}

	async logout({ auth }: HttpContext) {
		auth.use("web").logout();
	}
}
