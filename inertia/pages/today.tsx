import { Head } from "@inertiajs/react";
import { Leaf, Settings as SettingsIcon } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import Settings from "@/components/layout/settings";
import { useModal } from "@/components/modal/modal-context";
import Button from "@/components/ui/button";
import AppLayout from "./_layout";

const HomePage = () => {
	const todayDate = new Date().toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});

	const modal = useModal();

	const openSettings = () => {
		modal.open({
			title: "Paramètres",
			size: "md",
			content: <Settings />,
		});
	};

	return (
		<>
			<Head title={todayDate} />

			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader
					title={todayDate}
					subtitle="Daily tasks & journal"
					icon={Leaf}
					button={
						<Button
							variant="secondary"
							className="block md:hidden"
							icon={<SettingsIcon />}
							onClick={openSettings}
						/>
					}
				/>
			</div>
		</>
	);
};

HomePage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default HomePage;
