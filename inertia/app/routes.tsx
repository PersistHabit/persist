import { BookOpen, Calendar, Hash, Leaf, ShoppingBasket } from "lucide-react";
import type { NavLinkRoute } from "#types/nav";

export const routes: NavLinkRoute[] = [
	{
		label: "Aujourd'hui",
		subLabel: "Daily tasks & journal",
		route: "/",
		icon: Leaf,
	},
	{
		label: "Agenda",
		subLabel: "Plan the days",
		route: "/agenda",
		icon: Calendar,
	},
	{
		label: "Compteurs",
		subLabel: "Streaks & countdowns",
		route: "/counters",
		icon: Hash,
	},
	{
		label: "Journal",
		subLabel: "Reflect on days",
		route: "/journal",
		icon: BookOpen,
	},
	{
		label: "Shopping",
		subLabel: "Things to buy",
		route: "/shopping",
		icon: ShoppingBasket,
	},
	// Later the habits tracking route
	// {
	// 	label: "Habitudes",
	// 	subLabel: "Track your habits",
	// 	route: "/stats",
	// 	icon: ChartArea,
	// },
];
