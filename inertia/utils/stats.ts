import type { CategorySlug } from "#types/agenda";

/** Couleur CSS pleine d'une catégorie, réutilisable en `style`. */
export const categoryColorVar = (slug: CategorySlug): string =>
	`var(--color-category-${slug})`;
