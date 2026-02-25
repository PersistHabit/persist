import { Head, router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { JournalListItem, JournalMeta } from "#types/journal";
import JournalEntryCard from "@/components/journal/journal-entry-card";
import PageHeader from "@/components/layout/page-header";
import AppLayout from "./_layout";

type Props = {
	entries: JournalListItem[];
	meta: JournalMeta;
};

const JournalPage = ({ entries, meta }: Props) => {
	const [allEntries, setAllEntries] = useState<JournalListItem[]>(entries);
	const [currentMeta, setCurrentMeta] = useState(meta);
	const [loading, setLoading] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const isFirstRender = useRef(true);

	// Merge new entries when partial reload brings next page
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		if (meta.currentPage === 1) {
			setAllEntries(entries);
		} else {
			setAllEntries((prev) => [...prev, ...entries]);
		}
		setCurrentMeta(meta);
		setLoading(false);
	}, [entries, meta]);

	const loadMore = () => {
		if (loading || currentMeta.currentPage >= currentMeta.lastPage) return;
		setLoading(true);
		router.get(
			"/journal",
			{ page: currentMeta.currentPage + 1 },
			{
				only: ["entries", "meta"],
				preserveState: true,
				preserveScroll: true,
			},
		);
	};

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	const subtitle =
		currentMeta.total === 0
			? "Aucune entrée"
			: `${currentMeta.total} entrée${currentMeta.total > 1 ? "s" : ""}`;

	return (
		<>
			<Head title="Journal" />

			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader title="Journal" subtitle={subtitle} icon={BookOpen} />

				<div className="flex-1 min-h-0 overflow-y-auto pb-28 p-4 space-y-2">
					{allEntries.length === 0 ? (
						<p className="text-center text-muted-foreground text-sm mt-8">
							Aucune entrée dans ton journal.
						</p>
					) : (
						allEntries.map((entry) => (
							<JournalEntryCard key={entry.id} {...entry} />
						))
					)}

					<div ref={sentinelRef} className="h-4" />

					{loading && (
						<p className="text-center text-muted-foreground text-sm py-2">
							Chargement...
						</p>
					)}
				</div>
			</div>
		</>
	);
};

JournalPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default JournalPage;
