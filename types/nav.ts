import type { Icon } from "./app.js";

export type NavLinkRoute = {
	label: string;
	subLabel: string;
	route: string;
	icon: Icon;
};

export type NavItemProps = {
	route: NavLinkRoute;
};

export type BarProps = {
	routes: NavLinkRoute[];
};
