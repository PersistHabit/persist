import type { BarProps } from "#/types/nav";
import TabbarNavItem from "./tab-bar-item";

const Tabbar = ({ routes }: BarProps) => (
	<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 pb-safe z-20 lg:hidden">
		<div className="flex items-center justify-around max-w-lg mx-auto">
			{routes.map((route) => (
				<TabbarNavItem key={route.label} route={route} />
			))}
		</div>
	</nav>
);

export default Tabbar;
