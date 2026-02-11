import type { ZodError } from "zod";

export function applyZodErrors(
	zodError: ZodError,
	setError: (field: string, message: string) => void,
) {
	for (const issue of zodError.issues) {
		setError(issue.path.join("."), issue.message);
	}
}
