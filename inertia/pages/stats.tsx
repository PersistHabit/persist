import { Head } from "@inertiajs/react";
import { ChartColumn } from "lucide-react";
import type { Stats } from "#types/stats";
import EmptyList from "@/components/empty-list";
import PageHeader from "@/components/layout/page-header";
import CategoryBreakdown from "@/components/stats/category-breakdown";
import DistributionDonut from "@/components/stats/distribution-donut";
import SummaryCard from "@/components/stats/summary-card";
import WeeklyChart from "@/components/stats/weekly-chart";
import AppLayout from "./_layout";

type Props = {
	stats: Stats;
};

const StatsPage = ({ stats }: Props) => {
	const hasData = stats.last.total > 0;

	return (
		<>
			<Head title="Statistiques" />

			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader
					title="Statistiques"
					subtitle="Vue d'ensemble de vos tâches"
					icon={ChartColumn}
				/>

				<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
					{hasData ? (
						<>
							<SummaryCard summary={stats.last} windowDays={stats.windowDays} />
							<WeeklyChart week={stats.week} />
							<CategoryBreakdown categories={stats.categories} />
							<DistributionDonut distribution={stats.distribution} />
						</>
					) : (
						<div className="bg-card p-4 rounded-2xl border border-border">
							<EmptyList
								icon={ChartColumn}
								label="Pas encore de données à afficher"
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

StatsPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default StatsPage;
