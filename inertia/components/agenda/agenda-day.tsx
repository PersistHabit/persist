import { startOfDay } from "@/utils/recurrence";

type Props = {
	date: Date;
};

const AgendaDay = ({ date }: Props) => {
	const today = startOfDay(new Date());
	const target = startOfDay(date);

	const diffDays = Math.round(
		(target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
	);

	let label: string;

	if (diffDays === 0) label = "Aujourd’hui";
	else if (diffDays === 1) label = "Demain";
	else {
		label = target.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
		});
	}

	return (
		<div
			className={`px-4 lg:px-6 py-3 sticky top-0 ${diffDays === 0 ? "bg-primary/5" : "bg-background/80"} backdrop-blur border-t border-border/50 z-100`}
		>
			<div className="flex items-baseline justify-between gap-3">
				<h3
					className={`text-sm font-semibold ${diffDays === 0 ? "text-primary" : "text-foreground"} capitalize`}
				>
					{label}
				</h3>
				<span className="text-xs text-accent-foreground">
					{target.toLocaleDateString("fr-FR")}
				</span>
			</div>
		</div>
	);
};

export default AgendaDay;
