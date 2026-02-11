import type { InertiaFormProps } from "@inertiajs/react";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import {
	type RecurrenceTypeSlug,
	RecurrenceTypes,
	type RecurrenceUnitSlug,
	type WeekdaySlug,
	Weekdays,
} from "#types/agenda";
import Picker from "@/components/ui/picker";
import Input from "../ui/input";

type NewEventRepeat = {
	startDate: string;

	recurrence: {
		type: RecurrenceTypeSlug;
		interval?: number;
		unit?: RecurrenceUnitSlug;
		days: WeekdaySlug[];
	};
};

type Props = {
	mode?: "create" | "update";
	data: NewEventRepeat;
	setData: InertiaFormProps<NewEventRepeat>["setData"];
	errors: Record<string, string>;
};

const weekdayFromIsoDate = (iso: string): WeekdaySlug | null => {
	if (!iso) return null;

	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!m) return null;

	const year = Number(m[1]);
	const month = Number(m[2]);
	const day = Number(m[3]);

	const d = new Date(Date.UTC(year, month - 1, day));
	// 0=Sun ... 6=Sat
	const map: WeekdaySlug[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	return map[d.getUTCDay()];
};

const StepRepeat = ({ data, setData, errors, mode = "create" }: Props) => {
	const allowsDays = useMemo(
		() =>
			data.recurrence.type === "weekly" || data.recurrence.type === "custom",
		[data.recurrence.type],
	);

	/**
	 * Règle demandée :
	 * - si startDate change ET qu'on est dans un type qui gère les jours (weekly/custom),
	 *   alors on vide la liste et on met uniquement le jour correspondant à startDate.
	 */
	useEffect(() => {
		if (!allowsDays || mode === "update") return;

		const wd = weekdayFromIsoDate(data.startDate);
		if (!wd) {
			// si date invalide/vide, on reset les jours
			setData("recurrence.days", []);
			return;
		}

		setData("recurrence.days", [wd]);
	}, [allowsDays, data.startDate, setData, mode]);

	const handleRecurrenceTypeChange = (v: RecurrenceTypeSlug) => {
		setData((prev) => {
			const isCustom = v === "custom";
			const nextAllowsDays = v === "weekly" || v === "custom";

			const wd = nextAllowsDays ? weekdayFromIsoDate(prev.startDate) : null;

			return {
				...prev,
				recurrence: {
					...prev.recurrence,
					type: v,

					// unit/interval uniquement pour custom
					unit: isCustom ? (prev.recurrence.unit ?? "week") : undefined,
					interval: isCustom ? (prev.recurrence.interval ?? 2) : undefined,

					// days : reset + jour de startDate si applicable
					days: nextAllowsDays ? (wd ? [wd] : []) : [],
				},
			};
		});
	};

	return (
		<>
			<Input
				id="startDate"
				name="startDate"
				type="date"
				label={data.recurrence.type === "once" ? "Date" : "Date de début"}
				value={data.startDate}
				error={errors.startDate}
				onChange={(e) => setData("startDate", e.target.value)}
				required
			/>

			<Picker<RecurrenceTypeSlug>
				name="repeat"
				display="grid"
				label="Fréquence"
				options={RecurrenceTypes}
				value={data.recurrence.type}
				error={errors["recurrence.type"]}
				onChange={(v) => handleRecurrenceTypeChange(v)}
			/>

			{data.recurrence.type === "custom" && (
				<div
					className={clsx(
						"flex items-center justify-between overflow-hidden rounded-xl border border-border/60",
						"bg-muted/40 shadow-sm",
						"focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
					)}
				>
					<span className="flex items-center px-3 text-sm text-muted-foreground">
						{data.recurrence.unit === "week" ? "Toutes les" : "Tous les"}
					</span>

					<input
						type="number"
						min={2}
						inputMode="numeric"
						placeholder="2"
						value={data.recurrence.interval}
						onChange={(e) =>
							setData("recurrence.interval", Number(e.target.value))
						}
						className={clsx(
							"w-14 bg-transparent px-2 text-center text-sm tabular-nums border-transparent outline-none ring-0",
							"[appearance:textfield] focus:outline-none",
						)}
					/>

					<select
						className={clsx(
							"bg-transparent px-3 pr-9 text-sm font-medium text-foreground rounded-lg border-none outline-none ring-0",
							"focus:outline-none",
						)}
						value={data.recurrence.unit}
						onChange={(e) =>
							setData("recurrence.unit", e.target.value as RecurrenceUnitSlug)
						}
					>
						<option value="week">Semaines</option>
						<option value="month">Mois</option>
					</select>
				</div>
			)}

			{data.recurrence.type !== "once" &&
				data.recurrence.type !== "daily" &&
				data.recurrence.type !== "monthly" && (
					<Picker<WeekdaySlug>
						name="days"
						display="row"
						label="Jours"
						mode="multiple"
						options={Weekdays}
						value={data.recurrence.days}
						error={errors["recurrence.days"]}
						onChange={(v) => setData("recurrence.days", v)}
					/>
				)}
		</>
	);
};

export default StepRepeat;
