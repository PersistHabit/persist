import { router } from "@inertiajs/react";
import { MousePointerClick, Pencil } from "lucide-react";
import { type Counter, CounterColors } from "#types/counter";
import { useModal } from "../modal/modal-context";
import CounterForm from "./counter-form";
import CounterTriggerBadge from "./counter-trigger-badge";

type Props = {
	counter: Counter;
	showEdit?: boolean;
};

const CounterCard = ({ counter, showEdit = true }: Props) => {
	const modal = useModal();

	const color = CounterColors[counter.direction].find(
		(c) => c.slug === counter.color,
	)?.color;

	const handleTap = () => {
		if (counter.trigger !== "manual") return;

		if (counter.direction === "increment") {
			router.patch(`/counters/${counter.id}/increment`);
		} else {
			router.patch(`/counters/${counter.id}/decrement`);
		}
	};
	const handleReset = async () => {
		const confirm = await modal.confirm({
			title: "Réinitialiser le compteur ?",
			message: "Voulez vous vraiment réinitialiser ce compteur ?",
			cancelText: "Annuler",
			confirmText: "Réinitialiser",
		});
		if (!confirm) return;
		router.patch(
			`/counters/${counter.id}/reset`,
			{},
			{
				onSuccess: () => {
					modal.closeAll();
				},
				onError: (e) => {
					console.error(e);
				},
			},
		);
	};

	const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		modal.open({
			title: "Modifier un compteur",
			size: "lg",
			content: (
				<CounterForm
					initialData={counter}
					mode="update"
					counterId={counter.id}
					handleReset={handleReset}
				/>
			),
		});
	};

	const isManual = counter.trigger === "manual";
	const interactiveProps = isManual
		? {
				role: "button" as const,
				tabIndex: 0,
				onClick: handleTap,
				onKeyDown: (e: React.KeyboardEvent) => {
					if (e.key === "Enter" || e.key === " ") handleTap();
				},
			}
		: {};

	return (
		<div
			{...interactiveProps}
			className={`group relative ${color} p-6 rounded-2xl space-y-2 select-none text-left min-w-36 max-w-xs ${isManual ? "cursor-pointer" : ""}`}
		>
			<p className="text-3xl font-bold text-foreground">{counter.value}</p>
			<div className="text-foreground space-y-2">
				<p>{counter.title}</p>
				<div className="flex gap-2">
					<CounterTriggerBadge trigger={counter.trigger} />
					{counter.trigger === "daily" && (
						<button
							className="bg-white/10 p-1 px-3 flex gap-2 items-center rounded-full w-fit cursor-pointer"
							type="button"
							onClick={handleReset}
						>
							<p className="text-xs flex items-center gap-1">
								<MousePointerClick size={14} /> Réinitialiser
							</p>
						</button>
					)}
				</div>
				{showEdit && (
					<button
						className="absolute top-3 right-3 bg-white/10 p-1 px-2 flex items-center rounded-full cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
						type="button"
						onClick={handleEdit}
					>
						<Pencil size={14} />
					</button>
				)}
			</div>
		</div>
	);
};

export default CounterCard;
