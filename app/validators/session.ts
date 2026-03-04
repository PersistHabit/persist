import vine from "@vinejs/vine";

const FULL_NAME_REGEX = /^[\p{L}][\p{L}\p{M}''.\- ]+$/u;
const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[\S]{12,}$/;

export const registerValidator = vine.create({
	fullName: vine
		.string()
		.trim()
		.minLength(2)
		.maxLength(150)
		.regex(FULL_NAME_REGEX),
	email: vine
		.string()
		.trim()
		.toLowerCase()
		.maxLength(255)
		.email()
		.isUnique({ column: "email", table: "users" }),
	password: vine
		.string()
		.trim()
		.minLength(12)
		.maxLength(180)
		.regex(PASSWORD_REGEX)
		.confirmed(),
});

export const loginValidator = vine.create({
	email: vine.string().trim().toLowerCase().email(),
	password: vine.string().trim(),
	remember: vine.boolean().optional(),
});
