import { router } from "@inertiajs/react";
import { Calendar, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { version } from "@/app/version";
import {
	type AgendaView,
	getAgendaView,
	setAgendaView,
} from "@/utils/agenda_view";
import { getThemeMode, setThemeMode, type ThemeMode } from "@/utils/theme";
import Button from "../ui/button";

const Settings = () => {
	const [theme, setTheme] = useState<ThemeMode>("system");
	const [agendaView, setAgendaViewState] = useState<AgendaView>("14days");

	useEffect(() => {
		setTheme(getThemeMode());
		setAgendaViewState(getAgendaView());
	}, []);

	const handleLogout = () => {
		router.delete("/auth");
	};

	return (
		<div className="space-y-6 py-4">
			<div className="space-y-4">
				<h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					AGENDA
				</h4>
				<div className="flex items-center justify-between">
					<div className="flex gap-3">
						<Calendar className="text-muted-foreground" />
						<label
							htmlFor="agenda-view-switch"
							className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-normal"
						>
							Période affichée
						</label>
					</div>
					<select
						id="agenda-view-switch"
						className="bg-transparent border border-border rounded-md px-3 py-2 text-sm"
						value={agendaView}
						onChange={(e) => {
							const next = e.target.value as AgendaView;
							setAgendaViewState(next);
							setAgendaView(next);
						}}
					>
						<option className="text-black" value="14days">
							14 jours
						</option>
						<option className="text-black" value="month">
							1 mois
						</option>
					</select>
				</div>
			</div>
			<div
				data-orientation="horizontal"
				role="none"
				className="shrink-0 bg-border h-px w-full"
			/>
			<div className="space-y-4">
				<h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					APPARENCE
				</h4>
				<div className="flex items-center justify-between">
					<div className="w-full flex items-center justify-between">
						<div className="flex gap-3">
							<Moon className="text-muted-foreground" />
							<label
								htmlFor="theme-switch"
								className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-normal"
							>
								Theme
							</label>
						</div>
						<select
							id="theme-switch"
							className="bg-transparent border border-border rounded-md px-3 py-2 text-sm "
							value={theme}
							onChange={(e) => {
								const next = e.target.value as ThemeMode;
								setTheme(next);
								setThemeMode(next);
							}}
						>
							<option className="text-black" value="system">
								Système
							</option>
							<option className="text-black" value="light">
								Clair
							</option>
							<option className="text-black" value="dark">
								Sombre
							</option>
						</select>
					</div>
				</div>
			</div>
			<div
				data-orientation="horizontal"
				role="none"
				className="shrink-0 bg-border h-px w-full"
			/>
			{/* <div className="space-y-4">
				<h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					NOTIFICATIONS
				</h4>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Bell className="text-muted-foreground" />
						<label
							htmlFor="theme-switch"
							className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base font-normal"
						>
							Rappels journaliers
						</label>
						<select id="theme-switch">
							<option>Test</option>
						</select>
					</div>
				</div>
			</div>
			<div
				data-orientation="horizontal"
				role="none"
				className="shrink-0 bg-border h-px w-full"
			/> */}
			<div className="space-y-4">
				<h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
					COMPTE
				</h4>
				<div className="space-y-2">
					<Button className="w-full" onClick={handleLogout}>
						Se déconnecter
					</Button>
				</div>
				<p className="text-center text-xs text-muted-foreground">v{version}</p>
			</div>
		</div>
	);
};

export default Settings;
