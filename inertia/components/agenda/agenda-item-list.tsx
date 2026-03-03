import { useEffect, useState } from "react";
import type { AgendaItem, AgendaItemOccurrence } from "#types/agenda";
import {
	type AgendaView,
	agendaViewDays,
	getAgendaView,
} from "@/utils/agenda_view";
import { buildDays, normalizeEvents } from "@/utils/recurrence";
import AgendaDay from "./agenda-day";
import AgendaItemRow from "./agenda-item-row";

type Props = {
	events: AgendaItem[];
	openUpdateModal: (event: AgendaItemOccurrence) => void;
};

const AgendaItemList = ({ events, openUpdateModal }: Props) => {
	const [view, setView] = useState<AgendaView>("14days");

	useEffect(() => {
		setView(getAgendaView());

		const onStorage = (e: StorageEvent) => {
			if (e.key === "agenda-view") setView(getAgendaView());
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const days = buildDays(
		normalizeEvents(events),
		new Date(),
		agendaViewDays(view),
	);

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
