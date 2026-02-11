import type { FormError, PickerOption } from "@shared/types/form";
import clsx from "clsx";

type BaseProps<T extends string> = {
	name: string;
	label: string;
	display: "row" | "grid";
	options: Record<T, PickerOption<T>>;
	error?: FormError;

	textSelectedClassName?: string;
	textUnselectedClassName?: string;

	iconUnselectedClassName?: string;
};

type SingleProps<T extends string> = BaseProps<T> & {
	mode?: "single";
	value: T;
	onChange: (value: T) => void;
};

type MultipleProps<T extends string> = BaseProps<T> & {
	mode: "multiple";
	value: readonly T[];
	onChange: (value: T[]) => void;
};

type Props<T extends string> = SingleProps<T> | MultipleProps<T>;

const Picker = <T extends string>(props: Props<T>) => {
	const {
		name,
		label,
		display,
		options,
		error,
		textSelectedClassName = "bg-primary text-primary-foreground ring-primary",
		textUnselectedClassName = "bg-secondary text-muted-foreground ring-transparent hover:text-foreground",
		iconUnselectedClassName = "bg-secondary text-muted-foreground ring-transparent hover:text-foreground",
	} = props;

	const errId = error ? `${name}-error` : undefined;
	const isMultiple = props.mode === "multiple";

	const list = Object.values(options) as PickerOption<T>[];

	const selected = (slug: T) =>
		isMultiple ? props.value.includes(slug) : props.value === slug;

	const toggle = (slug: T) => {
		if (props.mode !== "multiple") {
			props.onChange(slug);
			return;
		}

		const next = new Set<T>(props.value);
		if (next.has(slug)) {
			next.delete(slug);
		} else {
			next.add(slug);
		}
		props.onChange(Array.from(next));
	};

	const layoutClassName =
		display === "row"
			? "flex gap-4 flex-wrap items-stretch"
			: list.length === 5
				? "grid grid-cols-2 gap-2 auto-rows-fr"
				: "grid gap-2 auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(96px,1fr))]";
	return (
		<fieldset
			className="space-y-2"
			aria-invalid={!!error}
			aria-describedby={errId}
		>
			<legend className="text-sm font-medium text-foreground/80 block">
				{label}
			</legend>

			<div className={layoutClassName}>
				{list.map((option, idx) => {
					const isSelected = selected(option.slug);

					const labelLayout =
						display === "row"
							? "flex-row gap-2 text-sm"
							: `flex-col gap-1.5 ${option.kind === "icon" ? "text-xs" : "text-sm"}`;

					const labelStateClass =
						option.kind === "icon"
							? isSelected
								? clsx(option.bgColor, option.ringColor, "text-foreground")
								: iconUnselectedClassName
							: isSelected
								? textSelectedClassName
								: textUnselectedClassName;

					return (
						<div
							key={option.slug}
							className={clsx(
								display === "row" && "flex-1",
								display === "grid" &&
									option.slug === "custom" &&
									"col-span-full",
							)}
						>
							<input
								className="sr-only"
								id={`${name}-${option.slug}`}
								name={name}
								type={isMultiple ? "checkbox" : "radio"}
								value={option.slug}
								checked={isSelected}
								onChange={() => toggle(option.slug)}
								required={!isMultiple && idx === 0}
							/>
							<label
								htmlFor={`${name}-${option.slug}`}
								className={clsx(
									labelLayout,
									"h-full min-h-12 flex cursor-pointer ring-1 items-center justify-center px-3 py-2.5 rounded-lg font-medium transition-colors",
									labelStateClass,
								)}
							>
								{option.kind === "icon" ? (
									<option.icon
										size={20}
										className={clsx(
											option.iconColor,
											isSelected ? "opacity-100" : "opacity-70",
										)}
									/>
								) : null}

								{option.label}
							</label>
						</div>
					);
				})}
			</div>

			{error ? (
				<p id={errId} className="text-sm text-destructive">
					{error}
				</p>
			) : null}
		</fieldset>
	);
};

export default Picker;
