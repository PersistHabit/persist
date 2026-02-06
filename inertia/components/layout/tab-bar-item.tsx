import { Link, usePage } from "@inertiajs/react";

import type { NavItemProps } from "#/types/nav";

const TabbarNavItem = ({ route }: NavItemProps) => {
	const { url } = usePage();

	const isActive = url === route.route || url.startsWith(`${route.route}/`);

	const Icon = route.icon;
	return (
		<Link
			href={route.route}
			className={[
				"flex flex-col items-center gap-1 p-3 transition text-muted-foreground font-medium",
				isActive ? "text-primary" : "text-muted-foreground",
			].join(" ")}
		>
			<Icon size="20" />
			<span className="text-xs">{route.label}</span>
		</Link>
	);
};
export default TabbarNavItem;
