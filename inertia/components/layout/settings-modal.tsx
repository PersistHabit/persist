import { router } from "@inertiajs/react";
import { Moon } from "lucide-react";
import { useEffect, useState } from "react";
import Modal, { type BaseModalProps } from "@/components/ui/modal";
import { getThemeMode, setThemeMode, type ThemeMode } from "@/utils/theme";
import Button from "../ui/button";

const SettingsModal = ({ open, onClose }: BaseModalProps) => {
	const [theme, setTheme] = useState<ThemeMode>("system");

	useEffect(() => {
		setTheme(getThemeMode());
	}, []);

	const handleLogout = () => {
		router.delete("/auth");
	};

	return (
		<Modal open={open} onClose={onClose} title="Paramètres" size="md">
			<div className="space-y-6 py-4">
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
						<Button onClick={handleLogout}>Se déconnecter</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default SettingsModal;
