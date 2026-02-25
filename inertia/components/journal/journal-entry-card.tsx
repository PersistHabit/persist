import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MOODS_MAP, type Mood } from "#types/journal";

const MOOD_LABELS: Record<Mood, string> = {
	great: "Très bien",
	good: "Bien",
	neutral: "Neutre",
	meh: "Mouais",
	bad: "Pas bien",
};

const getDateLabel = (isoDate: string): string => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const date = new Date(`${isoDate}T00:00:00`);

	if (date.getTime() === today.getTime()) return "Aujourd'hui";
	if (date.getTime() === yesterday.getTime()) return "Hier";

	return date.toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "short",
	});
};

const getFullDate = (isoDate: string): string => {
	const date = new Date(`${isoDate}T00:00:00`);
	return date.toLocaleDateString("fr-FR", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
};

type Props = {
	id: number;
	mood: Mood;
	content: string | null;
	entryDate: string;
	defaultExpanded?: boolean;
};

const JournalEntryCard = ({
	mood,
	content,
	entryDate,
	defaultExpanded = false,
}: Props) => {
	const [expanded, setExpanded] = useState(defaultExpanded);

	const moodData = MOODS_MAP[mood];
	const dateLabel = getDateLabel(entryDate);
	const fullDate = getFullDate(entryDate);

	return (
		<div className="bg-card border border-border rounded-2xl overflow-hidden">
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left"
			>
				<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl shrink-0">
					{moodData.emoji}
				</div>
				<div className="flex-1 min-w-0">
					<p className="font-semibold text-foreground text-sm capitalize">
						{dateLabel}
					</p>
					<div
						className={`grid transition-all duration-300 ease-in-out ${expanded ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}
					>
						<div className="overflow-hidden">
							{content && (
								<p className="text-xs text-muted-foreground truncate mt-0.5">
									{content}
								</p>
							)}
						</div>
					</div>
				</div>
				<ChevronDown
					className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Expanded content */}
			<div
				className={`grid transition-all duration-300 ease-in-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
			>
				<div className="overflow-hidden">
					<div className="px-4 pb-4 space-y-3">
						<span className="inline-block text-sm bg-muted rounded-full px-3 py-1 text-foreground">
							{moodData.emoji} {MOOD_LABELS[mood]}
						</span>
						{content && (
							<p className="text-sm text-foreground leading-relaxed">
								{content}
							</p>
						)}
						<p className="text-xs text-muted-foreground capitalize">
							{fullDate}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JournalEntryCard;
