import { Head } from "@inertiajs/react";
import { Calendar, Plus } from "lucide-react";
import type { AgendaItem, AgendaItemOccurrence } from "#types/agenda";
import AgendaItemList from "@/components/agenda/agenda-item-list";
import EventForm from "@/components/agenda/event-form";
import EmptyList from "@/components/empty-list";
import PageHeader from "@/components/layout/page-header";
import { useModal } from "@/components/modal/modal-context";
import Button from "@/components/ui/button";
import { toFormInitialData } from "@/utils/agenda";
import AppLayout from "./_layout";

type Props = {
	events: AgendaItem[];
};

const AgendaPage = ({ events }: Props) => {
	const modal = useModal();

	const openCreateModal = () => {
		modal.open({
			title: "Créer une nouvelle tâche",
			size: "lg",
			content: <EventForm />,
		});
	};

	const openUpdateModal = (event: AgendaItemOccurrence) => {
		modal.open({
			title: "Modifier la tâche",
			size: "lg",
			content: (
				<EventForm
					mode="update"
					eventId={event.id}
					initialData={toFormInitialData(event)}
					activePause={event.activePause}
				/>
			),
		});
	};

	return (
		<>
			<Head title="Agenda" />
			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader
					title="Agenda"
					subtitle="Plan the days"
					icon={Calendar}
					button={
						<Button
							onClick={openCreateModal}
							autoHide={true}
							icon={<Plus size="18" />}
						>
							Nouvelle tâche/routine
						</Button>
					}
				/>
				{events.length > 0 ? (
					<AgendaItemList events={events} openUpdateModal={openUpdateModal} />
				) : (
					<EmptyList icon={Calendar} label="Pas encore de routine" />
				)}
			</div>
		</>
	);
};

AgendaPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default AgendaPage;
