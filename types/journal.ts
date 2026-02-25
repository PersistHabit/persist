export const MOODS = [
	{ value: "great", emoji: "😄" },
	{ value: "good", emoji: "🙂" },
	{ value: "neutral", emoji: "😐" },
	{ value: "meh", emoji: "😒" },
	{ value: "bad", emoji: "😢" },
] as const;

export type Mood = (typeof MOODS)[number]["value"];

export const MOODS_MAP = Object.fromEntries(
	MOODS.map((m) => [m.value, m]),
) as Record<Mood, (typeof MOODS)[number]>;

export type JournalEntry = {
	mood: Mood;
	content: string | null;
};

export type JournalListItem = {
	id: number;
	mood: Mood;
	content: string | null;
	entryDate: string; // ISO date "2026-02-24"
};

export type JournalMeta = {
	currentPage: number;
	lastPage: number;
	total: number;
};
