import type { AgendaItemOccurrence } from "#types/agenda";
import { formatRecurrence } from "@/utils/recurrence";
import CategoryBadge from "./category-badge";

type Props = {
	event: AgendaItemOccurrence;
};

const AgendaItemRow = ({ event }: Props) => {
	return (
		<div className="py-3 border-border">
			<div className="flex items-center gap-3 min-w-0">
				<CategoryBadge
					categorySlug={event.category}
					dayMomentSlug={event.dayMoment}
				/>

				<div className="flex justify-between items-center flex-1 min-w-0 gap-3">
					<span className="text-foreground truncate group-hover:text-foreground/70 transition">
						{event.title}
					</span>

					<span className="text-xs text-muted-foreground shrink-0">
						{formatRecurrence(event)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default AgendaItemRow;
