import { Head } from "@inertiajs/react";
import {
	BookOpen,
	Check,
	CheckCheck,
	ChevronDown,
	Hash,
	Leaf,
	PartyPopper,
	Settings as SettingsIcon,
	ShoppingCart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AgendaItem } from "#types/agenda";
import { DayMomentRules, DayMoments } from "#types/agenda";
import type { Counter } from "#types/counter";
import type { JournalEntry } from "#types/journal";
import type { ShoppingElement } from "#types/shopping";
import CounterCard from "@/components/counter/counter-card";
import EmptyList from "@/components/empty-list";
import JournalEditor from "@/components/journal/journal-editor";
import PageHeader from "@/components/layout/page-header";
import Settings from "@/components/layout/settings";
import { useModal } from "@/components/modal/modal-context";
import ShoppingItemList from "@/components/shopping/shopping-item-list";
import ConfettiCanvas from "@/components/today/confetti-canvas";
import MomentCard from "@/components/today/moment-card";
import TodayAgendaItem from "@/components/today/today-agenda-item";
import Button from "@/components/ui/button";
import AppLayout from "./_layout";

type Props = {
	items: AgendaItem[];
	journal: JournalEntry | null;
	counters: Counter[];
	shoppingItems: ShoppingElement[];
};

const HomePage = ({ items, journal, counters, shoppingItems }: Props) => {
	const todayDate = new Date().toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});

	const modal = useModal();

	const openSettings = () => {
		modal.open({
			title: "Paramètres",
			size: "md",
			content: <Settings />,
		});
	};

	const groups = DayMomentRules.map((slug) => ({
		slug,
		moment: DayMoments[slug],
		items: items.filter((item) => item.dayMoment === slug),
	})).filter((g) => g.items.length > 0);

	const completedCount = items.filter((item) => item.isCompleted).length;
	const totalCount = items.length;
	const allDone = totalCount > 0 && completedCount === totalCount;

	const subtitle =
		totalCount === 0
			? "Aucune tâche aujourd'hui"
			: `${completedCount}/${totalCount} tâche${totalCount > 1 ? "s" : ""} effectuée${totalCount > 1 ? "s" : ""}`;

	const [celebrationOpen, setCelebrationOpen] = useState(allDone);
	const prevAllDoneRef = useRef(allDone);

	useEffect(() => {
		if (allDone && !prevAllDoneRef.current) {
			setCelebrationOpen(true);
		} else if (!allDone) {
			setCelebrationOpen(false);
		}
		prevAllDoneRef.current = allDone;
	}, [allDone]);

	return (
		<>
			<Head title={todayDate} />

			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader
					title={todayDate}
					subtitle={subtitle}
					icon={Leaf}
					button={
						<Button
							variant="secondary"
							className="block md:hidden"
							icon={<SettingsIcon />}
							onClick={openSettings}
						/>
					}
				/>

				<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
					{counters.length !== 0 && (
						<div className="space-y-2">
							<h2 className="uppercase text-muted-foreground flex items-center gap-2">
								<Hash className="text-primary" size={18} /> Compteurs épinglés
							</h2>
							<div className="flex gap-4 overflow-y-auto">
								{counters.map((c) => (
									<CounterCard key={c.id} counter={c} showEdit={false} />
								))}
							</div>
						</div>
					)}
					{groups.length !== 0 ? (
						<div className="space-y-2">
							<h2 className="uppercase text-muted-foreground flex items-center gap-2">
								<CheckCheck className="text-primary" size={18} /> À faire
								aujourd'hui
							</h2>
							<div className="space-y-3">
								{groups.map(({ slug, moment, items: groupItems }) => (
									<MomentCard key={slug} moment={moment}>
										{groupItems.map((item) => {
											return <TodayAgendaItem key={item.id} item={item} />;
										})}
									</MomentCard>
								))}
							</div>
						</div>
					) : (
						<div className="bg-card p-4 rounded-2xl border border-border">
							<EmptyList
								icon={Check}
								label="Aucune tâche à faire aujourd'hui"
							/>
						</div>
					)}

					{allDone && (
						<div className="rounded-2xl border border-primary/30 bg-primary/5 overflow-hidden">
							<button
								type="button"
								className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
								onClick={() => setCelebrationOpen((o) => !o)}
							>
								<span className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide">
									<PartyPopper size={16} />
									Toutes les tâches sont faites !
								</span>
								<ChevronDown
									size={16}
									className={`text-primary transition-transform duration-300 ${celebrationOpen ? "rotate-180" : ""}`}
								/>
							</button>

							<div
								className={`transition-all duration-500 ease-in-out ${celebrationOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
							>
								<div className="relative flex flex-col items-center gap-2 pb-6 pt-2 overflow-hidden">
									<ConfettiCanvas
										active={celebrationOpen}
										count={90}
										spread={7}
										width={400}
										height={220}
										className="absolute top-0 left-1/2 -translate-x-1/2"
									/>
									<p className="text-muted-foreground text-sm text-center relative z-10 px-4">
										Bravo ! Tu as tout terminé pour aujourd'hui.
									</p>
								</div>
							</div>
						</div>
					)}

					{shoppingItems.length !== 0 && (
						<div className="space-y-2">
							<h2 className="uppercase text-muted-foreground flex items-center gap-2">
								<ShoppingCart className="text-primary" size={18} /> Articles
							</h2>
							<ShoppingItemList items={shoppingItems} today={true} />
						</div>
					)}

					<div className="space-y-2">
						<h2 className="uppercase text-muted-foreground flex items-center gap-2">
							<BookOpen className="text-primary" size={18} /> Journal
						</h2>
						<JournalEditor
							initialMood={journal?.mood}
							initialContent={journal?.content ?? ""}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

HomePage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default HomePage;
