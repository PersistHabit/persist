import type { NavLinkRoute } from "@shared/types/nav";
import {
	BookOpen,
	Calendar,
	ChartArea,
	Hash,
	Leaf,
	ShoppingBasket,
} from "lucide-react";

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
	{
		label: "Habitudes",
		subLabel: "Track your habits",
		route: "/stats",
		icon: ChartArea,
	},
];
