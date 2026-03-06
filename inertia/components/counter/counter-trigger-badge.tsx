import { CalendarDays, MousePointerClick } from "lucide-react";
import type { CounterTriggerSlug } from "#types/counter";

type Props = {
	trigger: CounterTriggerSlug;
};

const CounterTriggerBadge = ({ trigger }: Props) => {
	return (
		<div className="bg-white/10 p-1 px-3 flex gap-2 items-center rounded-full w-fit">
			{trigger === "daily" ? (
				<CalendarDays size={14} />
			) : (
				<MousePointerClick size={14} />
			)}
			<p className="text-[10px] lg:text-xs">
				{trigger === "daily" ? "Jour" : "Click"}
			</p>
		</div>
	);
};

export default CounterTriggerBadge;
