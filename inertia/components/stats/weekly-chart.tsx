import type { WeekdayStat } from "#types/stats";

type Props = {
	week: WeekdayStat[];
};

const GRID = [100, 75, 50, 25, 0];

const WeeklyChart = ({ week }: Props) => (
	<section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
		<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
			Cette semaine
		</h2>

		<div className="flex gap-3">
			{/* Échelle verticale */}
			<div className="flex flex-col justify-between h-48 text-xs text-muted-foreground pb-6">
				{GRID.map((value) => (
					<span key={value}>{value}%</span>
				))}
			</div>

			{/* Barres */}
			<div className="flex-1 flex items-end justify-between gap-2 h-48">
				{week.map((day, index) => (
					<div
						key={`${day.label}-${index}`}
						className="flex-1 flex flex-col items-center gap-2 h-full"
					>
						<div className="flex-1 w-full flex items-end">
							<div
								className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-[height] duration-500"
								style={{ height: `${day.total === 0 ? 0 : day.rate}%` }}
								title={`${day.completed}/${day.total}`}
							/>
						</div>
						<span className="text-xs text-muted-foreground capitalize">
							{day.label}
						</span>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default WeeklyChart;
