import type { PropsWithChildren } from "react";
import { routes } from "@/app/routes";
import Sidebar from "@/components/layout/sidebar";
import Tabbar from "@/components/layout/tab-bar";
import { ModalProvider } from "@/components/modal/modal-context";

const AppLayout = ({ children }: PropsWithChildren) => {
	return (
		<ModalProvider>
			<div className="flex flex-col lg:flex-row h-screen overflow-hidden">
				<Sidebar routes={routes} />

				<main className="w-full flex-1 min-h-0 flex flex-col overflow-hidden">
					{children}
				</main>

				<Tabbar routes={routes} />
			</div>
		</ModalProvider>
	);
};

export default AppLayout;
