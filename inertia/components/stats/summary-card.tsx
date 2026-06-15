import type { CompletionSummary } from "#types/stats";

type Props = {
	summary: CompletionSummary;
	windowDays: number;
};

const SummaryCard = ({ summary, windowDays }: Props) => (
	<section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
		<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
			{windowDays} derniers jours
		</h2>

		<div className="flex items-baseline gap-3">
			<span className="text-5xl font-bold text-foreground">
				{summary.rate}%
			</span>
			<span className="text-muted-foreground">de complétion</span>
		</div>

		<p className="text-sm text-muted-foreground">
			{summary.completed} tâche{summary.completed > 1 ? "s" : ""} sur{" "}
			{summary.total} complétée{summary.completed > 1 ? "s" : ""}
		</p>
	</section>
);

export default SummaryCard;
