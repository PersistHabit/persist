import { type PropsWithChildren, useState } from "react";
import { routes } from "@/app/routes";
import SettingsModal from "@/components/layout/settings-modal";
import Sidebar from "@/components/layout/sidebar";
import Tabbar from "@/components/layout/tab-bar";

const AppLayout = ({ children }: PropsWithChildren) => {
	const [openSettings, setOpenSettings] = useState(false);

	return (
		<div className="flex flex-col lg:flex-row h-screen overflow-hidden">
			<Sidebar
				routes={routes}
				openSettingsModal={() => setOpenSettings(true)}
			/>

			<main className="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
				{children}
			</main>

			<Tabbar routes={routes} />
			<SettingsModal
				open={openSettings}
				onClose={() => setOpenSettings(false)}
			/>
		</div>
	);
};

export default AppLayout;
