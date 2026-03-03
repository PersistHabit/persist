import type { Icon } from "#types/app";
import type { CounterColorSlug } from "./counter.ts";

export type TwClass = string;

export type PickerOptionBase<T extends string> = {
	slug: T;
	label: string;
};

export type PickerOptionWithIcon<T extends string> = PickerOptionBase<T> & {
	kind: "icon";
	icon: Icon;
	iconColor: TwClass;
	bgColor: TwClass;
	ringColor: TwClass;
};

export type PickerOptionTextOnly<T extends string> = PickerOptionBase<T> & {
	kind: "text";
};

export type PickerOption<T extends string> =
	| PickerOptionWithIcon<T>
	| PickerOptionTextOnly<T>;

export type FormError = string;

export type ColorPickerOption = {
	slug: CounterColorSlug;
	color: TwClass;
};
