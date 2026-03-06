import { router } from "@inertiajs/react";
import { useState } from "react";
import type { AgendaItem } from "#types/agenda";
import CategoryBadge from "../agenda/category-badge";
import ConfettiCanvas from "./confetti-canvas";

type Props = {
	item: AgendaItem;
};

const todayStr = new Date().toISOString().slice(0, 10);

const TodayAgendaItem = ({ item }: Props) => {
	const [burst, setBurst] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setBurst(true);
			setTimeout(() => setBurst(false), 1000);
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
			className={`py-3 flex items-center cursor-pointer gap-3 relative${item.isPaused ? " opacity-40 grayscale" : ""}`}
		>
			{burst && (
				<div
					className="absolute pointer-events-none"
					style={{
						left: 8,
						top: "50%",
						transform: "translate(-50%, -50%)",
						zIndex: 50,
					}}
				>
					<ConfettiCanvas
						active={burst}
						count={22}
						spread={4}
						width={120}
						height={120}
					/>
				</div>
			)}
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
