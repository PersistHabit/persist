export type AgendaView = "14days" | "month";

const KEY = "agenda-view";

export function getAgendaView(): AgendaView {
	const v = localStorage.getItem(KEY);
	return v === "14days" || v === "month" ? v : "14days";
}

export function setAgendaView(view: AgendaView) {
	localStorage.setItem(KEY, view);
}

export function agendaViewDays(view: AgendaView): number {
	return view === "month" ? 31 : 15;
}
