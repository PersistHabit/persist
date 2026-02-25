import { router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { MOODS, type Mood } from "#types/journal";

type SaveStatus = "idle" | "saving" | "saved";

type Props = {
	initialMood?: Mood;
	initialContent?: string;
};

const JournalEditor = ({ initialMood, initialContent = "" }: Props) => {
	const [mood, setMood] = useState<Mood>(initialMood ?? MOODS[1].value);
	const [content, setContent] = useState(initialContent);
	const [status, setStatus] = useState<SaveStatus>("idle");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const save = (data: { mood: Mood; content: string }) => {
		setStatus("saving");
		router.post("/journal", data, {
			preserveState: true,
			preserveScroll: true,
			onSuccess: () => setStatus("saved"),
			onError: () => setStatus("idle"),
		});
	};

	const scheduleSave = (data: { mood: Mood; content: string }) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => save(data), 1000);
	};

	const handleMoodChange = (value: Mood) => {
		setMood(value);
		scheduleSave({ mood: value, content });
	};

	const handleContentChange = (value: string) => {
		setContent(value);
		scheduleSave({ mood, content: value });
	};

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	useEffect(() => {
		if (status !== "saved") return;
		const t = setTimeout(() => setStatus("idle"), 2000);
		return () => clearTimeout(t);
	}, [status]);

	return (
		<div className="bg-card border border-border rounded-2xl p-4 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">
					{status === "saving"
						? "Enregistrement..."
						: status === "saved"
							? "Enregistré"
							: "Comment te sens-tu ?"}
				</span>
				<div className="flex gap-1">
					{MOODS.map((m) => (
						<label key={m.value} className="cursor-pointer">
							<input
								type="radio"
								name="mood"
								value={m.value}
								checked={mood === m.value}
								onChange={() => handleMoodChange(m.value)}
								className="sr-only"
							/>
							<span
								className={`text-xl transition-all select-none ${
									mood === m.value
										? "opacity-100 scale-125"
										: "opacity-40 hover:opacity-70"
								}`}
							>
								{m.emoji}
							</span>
						</label>
					))}
				</div>
			</div>
			<textarea
				value={content}
				onChange={(e) => handleContentChange(e.target.value)}
				placeholder="Écris quelques lignes à propos d'aujourd'hui"
				rows={4}
				className="focus:ring-primary rounded-2xl w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none border-0"
			/>
		</div>
	);
};

export default JournalEditor;
