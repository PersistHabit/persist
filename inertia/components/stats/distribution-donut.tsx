import { Categories } from "#types/agenda";
import type { DistributionSlice } from "#types/stats";
import { categoryColorVar } from "@/utils/stats";

type Props = {
	distribution: DistributionSlice[];
};

// Rayon donnant une circonférence de 100 → les longueurs d'arc sont des %.
const RADIUS = 100 / (2 * Math.PI);

const DistributionDonut = ({ distribution }: Props) => {
	const total = distribution.reduce((sum, slice) => sum + slice.value, 0);
	if (total === 0) return null;

	let offset = 0;

	return (
		<section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
			<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
				Répartition des tâches
			</h2>

			<div className="flex justify-center">
				<svg
					viewBox="0 0 36 36"
					className="w-44 h-44 -rotate-90"
					role="img"
					aria-label="Répartition des tâches par catégorie"
				>
					{distribution.map((slice) => {
						const percent = (slice.value / total) * 100;
						const dash = `${percent} ${100 - percent}`;
						const circle = (
							<circle
								key={slice.slug}
								cx="18"
								cy="18"
								r={RADIUS}
								fill="none"
								stroke={categoryColorVar(slice.slug)}
								strokeWidth="4"
								strokeDasharray={dash}
								strokeDashoffset={-offset}
							/>
						);
						offset += percent;
						return circle;
					})}
				</svg>
			</div>

			<div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
				{distribution.map((slice) => (
					<div key={slice.slug} className="flex items-center gap-2">
						<span
							className="w-2.5 h-2.5 rounded-full"
							style={{ backgroundColor: categoryColorVar(slice.slug) }}
						/>
						<span className="text-sm text-muted-foreground">
							{Categories[slice.slug].label}
						</span>
					</div>
				))}
			</div>
		</section>
	);
};

export default DistributionDonut;
