import { Settings } from "lucide-react";
import type { BarProps } from "#/types/nav";
import { version } from "@/app/version";
import SidebarNavItem from "./sidebar-nav-item";
import Title from "./title";

const Sidebar = ({
	routes,
	openSettingsModal,
}: BarProps & { openSettingsModal: () => void }) => (
	<aside
		className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen"
		aria-label="Navigation principale"
	>
		<Title />
		<nav className="flex-1 p-4 space-y-1">
			{routes.map((route) => (
				<SidebarNavItem key={route.label} route={route} />
			))}
		</nav>
		<div className="p-4 space-y-3 border-t border-border">
			<button
				type="button"
				className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
				onClick={openSettingsModal}
			>
				<Settings />
				Paramètres
			</button>
			<div>
				<p className="text-xs text-muted-foreground text-center">
					Stay consistent, stay calm ✨
				</p>
				<p className="text-center text-xs mt-2 text-muted-foreground">
					v{version}
				</p>
			</div>
		</div>
	</aside>
);

export default Sidebar;
