import type { CounterColorSlug, CounterDirectionSlug } from "#types/counter";
import { CounterColors } from "#types/counter";

import type { FormError } from "#types/form";

type Props = {
	counterDirection: CounterDirectionSlug;
	onChange: (v: CounterColorSlug) => void;
	value: CounterColorSlug;
	error?: FormError;
};

const ColorPicker = ({ counterDirection, onChange, value }: Props) => {
	return (
		<fieldset className="space-y-2">
			<legend className="text-sm font-medium text-foreground/80 block">
				Couleur
			</legend>
			<div className="flex gap-4 flex-wrap items-stretch">
				{CounterColors[counterDirection].map((c) => {
					const isSelected = c.slug === value;
					return (
						<label
							htmlFor={`${c.color}-${c.slug}`}
							key={`${c.color}-${c.slug}`}
							className={`${c.color} p-6 rounded-full transition ${isSelected ? "ring-2" : ""} ring-primary cursor-pointer`}
						>
							<input
								type="radio"
								id={`${c.color}-${c.slug}`}
								name="color"
								className="sr-only"
								onChange={() => onChange(c.slug)}
								checked={isSelected}
							/>
						</label>
					);
				})}
			</div>
		</fieldset>
	);
};

export default ColorPicker;
