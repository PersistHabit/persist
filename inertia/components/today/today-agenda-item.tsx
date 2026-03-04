import { router } from "@inertiajs/react";
import type { AgendaItem } from "#types/agenda";
import CategoryBadge from "../agenda/category-badge";

type Props = {
	item: AgendaItem;
};

const todayStr = new Date().toISOString().slice(0, 10);

const TodayAgendaItem = ({ item }: Props) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			router.post(`/agenda-items/${item.id}/completions`, {
				occurrence_date: todayStr,
			});
		} else if (item.completionId !== null) {
			router.delete(
				`/agenda-items/${item.id}/completions/${item.completionId}`,
			);
		}
	};

	return (
		<label
			className={`py-3 flex items-center cursor-pointer gap-3${item.isPaused ? " opacity-40 grayscale" : ""}`}
		>
			<input
				name={`${item.id}-check`}
				type="checkbox"
				defaultChecked={item.isCompleted}
				onChange={handleChange}
				className="
    appearance-none
    w-4 h-4
    rounded-full
    bg-card
    ring-2 ring-border
    checked:bg-primary
    checked:ring-primary
    hover:bg-primary/20
    checked:hover:bg-primary
    focus:outline-none
    focus:ring-0
    focus-visible:ring-0
    focus-visible:outline-none
    border-none
    cursor-pointer
    transition
  "
			/>
			<CategoryBadge categorySlug={item.category} />
			<div className="flex justify-between items-center flex-1 min-w-0 gap-3">
				<span
					className={`transition truncate ${item.isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}
				>
					{item.title}
				</span>
			</div>
		</label>
	);
};

export default TodayAgendaItem;
