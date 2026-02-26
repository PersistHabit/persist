import { Link } from "@adonisjs/inertia/react";
import { usePage } from "@inertiajs/react";
import type { NavItemProps } from "#types/nav";

const SidebarNavItem = ({ route }: NavItemProps) => {
	const { url } = usePage();

	const isActive = url === route.route || url.startsWith(`${route.route}/`);
	const Icon = route.icon;

	return (
		<Link
			href={route.route}
			className={[
				"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition",
				isActive
					? "bg-primary/10 text-primary"
					: "text-muted-foreground hover:bg-secondary hover:text-foreground",
			].join(" ")}
		>
			<Icon size={20} />
			<div className="flex flex-col">
				<span className={`font-medium ${isActive && "text-nav-active-text"}`}>
					{route.label}
				</span>
				<span className="text-muted-foreground text-xs">{route.subLabel}</span>
			</div>
		</Link>
	);
};

export default SidebarNavItem;
