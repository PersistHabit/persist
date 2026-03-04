import { TrendingDown, TrendingUp } from "lucide-react";
import type { Counter } from "#types/counter";
import CounterCard from "./counter-card";

type Props = {
	counters: Counter[];
};

const CounterList = ({ counters }: Props) => {
	const streaks = counters.filter(
		(counter) => counter.direction === "increment",
	);
	const countdowns = counters.filter(
		(counter) => counter.direction === "decrement",
	);

	return (
		<>
			{streaks.length !== 0 && (
				<div>
					<h3 className="flex gap-2 items-center uppercase mb-2">
						<TrendingUp size={16} className="text-counter-streak-0" />
						Compteurs
					</h3>
					<section className="flex flex-wrap gap-4">
						{streaks.map((counter) => (
							<CounterCard counter={counter} key={counter.id} />
						))}
					</section>
				</div>
			)}
			{countdowns.length !== 0 && (
				<div>
					<h3 className="flex gap-2 items-center uppercase mb-2">
						<TrendingDown size={16} className="text-counter-countdown-0" />
						Comptes à rebours
					</h3>
					<section className="flex flex-wrap gap-4">
						{countdowns.map((counter) => (
							<CounterCard counter={counter} key={counter.id} />
						))}
					</section>
				</div>
			)}
		</>
	);
};

export default CounterList;
