import type { AgendaItem, AgendaItemOccurrence } from "#types/agenda";
import { build14Days, normalizeEvents } from "@/utils/recurrence";
import AgendaDay from "./agenda-day";
import AgendaItemRow from "./agenda-item-row";

type Props = {
	events: AgendaItem[];
	openUpdateModal: (event: AgendaItemOccurrence) => void;
};

const AgendaItemList = ({ events, openUpdateModal }: Props) => {
	const days = build14Days(normalizeEvents(events), new Date());

	return (
		<div className="flex-1 min-h-0 overflow-y-auto pb-28">
			{days.map((d) => (
				<section
					key={d.date.toISOString()}
					className="border-b border-border/50"
				>
					<AgendaDay date={d.date} />
					<div className="px-4 lg:px-6">
						<div className="divide-y divide-border/30">
							{d.events.map((occ) => (
								<button
									key={occ.key}
									type="button"
									onClick={() => openUpdateModal(occ.event)}
									className="group contents"
									style={{
										all: "unset",
										cursor: "pointer",
										width: "100%",
									}}
								>
									<AgendaItemRow key={occ.key} event={occ.event} />
								</button>
							))}
						</div>
					</div>
				</section>
			))}
		</div>
	);
};

export default AgendaItemList;
