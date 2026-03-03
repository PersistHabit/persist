import { Head } from "@inertiajs/react";
import { Hash, Plus } from "lucide-react";
import type { Counter } from "#types/counter";
import CounterForm from "@/components/counter/counter-form";
import CounterList from "@/components/counter/counter-list";
import EmptyList from "@/components/empty-list";
import PageHeader from "@/components/layout/page-header";
import { useModal } from "@/components/modal/modal-context";
import Button from "@/components/ui/button";
import AppLayout from "./_layout";

type Props = {
	counters: Counter[];
};

const CounterPage = ({ counters }: Props) => {
	const modal = useModal();

	const openCreateModal = () => {
		modal.open({
			title: "Ajouter un nouveau compteur",
			size: "lg",
			content: <CounterForm />,
		});
	};

	return (
		<>
			<Head title="Compteurs" />
			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader
					title="Compteurs"
					subtitle="Streaks and countdown"
					icon={Hash}
					button={
						<Button
							onClick={openCreateModal}
							autoHide={true}
							icon={<Plus size={18} />}
						>
							Ajouter un compteur
						</Button>
					}
				/>
				<div className="flex-1 min-h-0 overflow-y-auto pb-28 p-4 space-y-8">
					{counters.length !== 0 ? (
						<CounterList counters={counters} />
					) : (
						<EmptyList icon={Hash} label="Aucun compteurs pour le moment" />
					)}
				</div>
			</div>
		</>
	);
};

CounterPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default CounterPage;
