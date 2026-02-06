import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { DbRememberMeTokensProvider } from "@adonisjs/auth/session";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import { BaseModel, column } from "@adonisjs/lucid/orm";
import type { DateTime } from "luxon";

const AuthFinder = withAuthFinder(() => hash.use("argon"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export default class User extends compose(BaseModel, AuthFinder) {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare fullName: string;

	@column()
	declare email: string;

	@column({ serializeAs: null })
	declare password: string;

	@column.dateTime()
	declare deletedAt: DateTime | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime | null;

	static rememberMeTokens = DbRememberMeTokensProvider.forModel(User);
}
