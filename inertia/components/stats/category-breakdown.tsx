import { Categories } from "#types/agenda";
import type { CategoryStat } from "#types/stats";
import { categoryColorVar } from "@/utils/stats";

type Props = {
	categories: CategoryStat[];
};

const CategoryBreakdown = ({ categories }: Props) => (
	<section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
		<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
			Par catégorie
		</h2>

		<div className="space-y-4">
			{categories.map((stat) => {
				const category = Categories[stat.slug];
				const color = categoryColorVar(stat.slug);
				return (
					<div key={stat.slug} className="flex items-center gap-3">
						<div
							className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
							style={{ backgroundColor: `${color}26` }}
						>
							<category.icon size={18} style={{ color }} />
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between mb-1">
								<span className="text-sm font-medium text-foreground truncate">
									{category.label}
								</span>
								<span className="text-sm font-semibold text-foreground">
									{stat.rate}%
								</span>
							</div>
							<div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
								<div
									className="h-full rounded-full transition-[width] duration-500"
									style={{ width: `${stat.rate}%`, backgroundColor: color }}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	</section>
);

export default CategoryBreakdown;
