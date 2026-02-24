import { router, useForm } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import type { ActivePause, NewEventFormData } from "#types/agenda";
import Button from "@/components/ui/button";
import { NewEventBaseSchema, NewEventSchema } from "@/schemas/agenda.schema";
import { toDateInputValue } from "@/utils/agenda";
import { applyZodErrors } from "@/utils/schema";
import { useModal } from "../modal/modal-context";
import StepBasics from "./step-basis";
import StepRepeat from "./step-repeat";

type Step = 0 | 1;

const pageVariants = {
	initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 18 : -18 }),
	animate: { opacity: 1, x: 0 },
	exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -18 : 18 }),
};

const Step0Schema = NewEventBaseSchema.pick({
	title: true,
	dayMoment: true,
	category: true,
	startDate: true,
});

const Step1Schema = NewEventBaseSchema.pick({
	recurrence: true,
});

const stepForField = (field: string): Step => {
	if (field.startsWith("recurrence.")) return 1;
	return 0;
};

type Props = {
	mode?: "create" | "update";
	eventId?: number;
	initialData?: Partial<NewEventFormData>;
	activePause?: ActivePause | null;
};

const defaultData: NewEventFormData = {
	title: "",
	dayMoment: "morning",
	category: "health",
	startDate: "",
	endDate: "",
	recurrence: {
		type: "once",
		interval: undefined,
		unit: undefined,
		days: [],
	},
};

const EventForm = ({
	mode = "create",
	initialData,
	eventId,
	activePause,
}: Props) => {
	const modal = useModal();
	const [step, setStep] = useState<Step>(0);
	const [dir, setDir] = useState(1);

	const form = useForm<NewEventFormData>({
		...defaultData,
		...initialData,
		startDate: toDateInputValue(initialData?.startDate),
		recurrence: {
			...defaultData.recurrence,
			...(initialData?.recurrence ?? {}),
		},
	});

	const {
		data,
		setData,
		processing,
		errors,
		reset,
		setError,
		clearErrors,
		post,
		put,
	} = form;

	const canGoNext = useMemo(() => {
		if (!data.title || data.title.trim().length < 3) return false;
		return true;
	}, [data.title]);

	const handleCancel = () => {
		reset();
		clearErrors();
		setStep(0);
		modal.close();
	};

	const validateStep = (s: Step) => {
		clearErrors();
		const schema = s === 0 ? Step0Schema : Step1Schema;
		const result = schema.safeParse(data);

		if (!result.success) {
			applyZodErrors(result.error, setError);
			const firstPath = result.error.issues[0]?.path?.join(".") ?? "";
			goTo(stepForField(firstPath));
			return false;
		}

		return true;
	};

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		clearErrors();
		const result = NewEventSchema.safeParse(data);
		if (!result.success) {
			applyZodErrors(result.error, setError);
			const firstPath = result.error.issues[0]?.path?.join(".") ?? "";
			goTo(stepForField(firstPath));
			return;
		}

		setData(result.data);

		if (mode === "create") {
			post("/agenda", {
				onSuccess: () => {
					clearErrors();
					reset();
					modal.close();
				},
				onError: (e) => {
					console.error(e);
				},
			});
		} else {
			put(`/agenda/${eventId}`, {
				onSuccess: () => {
					clearErrors();
					reset();
					modal.close();
				},
				onError: (e) => {
					console.error(e);
				},
			});
		}
	};

	const [pauseStartedAt, setPauseStartedAt] = useState(
		new Date().toISOString().slice(0, 10),
	);
	const [pauseEndedAt, setPauseEndedAt] = useState("");
	const [pauseProcessing, setPauseProcessing] = useState(false);

	const handleStopPause = () => {
		router.delete(`/agenda/${eventId}/pauses/${activePause?.id}`, {
			onSuccess: () => modal.close(),
		});
	};

	const handlePause = () => {
		setPauseProcessing(true);
		router.post(
			`/agenda/${eventId}/pauses`,
			{ startedAt: pauseStartedAt, endedAt: pauseEndedAt || null },
			{
				onSuccess: () => modal.close(),
				onFinish: () => setPauseProcessing(false),
			},
		);
	};

	const handleDelete = async () => {
		const confirm = await modal.confirm({
			title: "Supprimer la tâche ?",
			danger: true,
			message: "Voulez vous vraiment supprimer cette tâche ?",
			cancelText: "Annuler",
			confirmText: "Supprimer",
		});

		if (!confirm) return;
		router.delete(`/agenda/${eventId}`, {
			onSuccess: () => {
				clearErrors();
				reset();
				modal.closeAll();
			},
			onError: (e) => {
				console.error(e);
			},
		});
	};

	const goTo = (next: Step) => {
		setDir(next > step ? 1 : -1);
		setStep(next);
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<AnimatePresence mode="wait" custom={dir}>
				<motion.div
					key={step}
					custom={dir}
					variants={pageVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.18, ease: "easeOut" }}
					className="space-y-4"
				>
					{step === 0 ? (
						<StepBasics data={data} setData={setData} errors={errors} />
					) : (
						<StepRepeat
							mode={mode}
							data={data}
							setData={setData}
							errors={errors}
						/>
					)}
				</motion.div>
			</AnimatePresence>

			{mode === "update" && (
				<div className="border-t border-border/40 pt-4 space-y-3">
					<p className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
						<Pause size={14} />
						{activePause ? "En pause" : "Mettre en pause"}
					</p>
					{activePause ? (
						<>
							<p className="text-sm text-muted-foreground">
								Du {activePause.startedAt.split("-").reverse().join("/")}
								{activePause.endedAt
									? ` au ${activePause.endedAt.split("-").reverse().join("/")}`
									: " (sans date de fin)"}
							</p>
							<Button
								type="button"
								variant="secondary"
								onClick={handleStopPause}
							>
								Arrêter la pause
							</Button>
						</>
					) : (
						<>
							<div className="flex gap-2">
								<input
									type="date"
									value={pauseStartedAt}
									onChange={(e) => setPauseStartedAt(e.target.value)}
									className="flex-1 h-10 rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								/>
								<input
									type="date"
									value={pauseEndedAt}
									min={pauseStartedAt}
									onChange={(e) => setPauseEndedAt(e.target.value)}
									className="flex-1 h-10 rounded-xl border border-border/50 bg-secondary/30 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
								/>
							</div>
							<Button
								type="button"
								variant="secondary"
								disabled={pauseProcessing || !pauseStartedAt}
								onClick={handlePause}
							>
								Confirmer la pause
							</Button>
						</>
					)}
				</div>
			)}

			<div className="flex gap-3 justify-between pt-4">
				<div className="flex gap-3">
					<Button
						type="button"
						disabled={processing}
						variant="secondary"
						onClick={handleCancel}
					>
						Annuler
					</Button>
				</div>

				<div className="flex gap-3">
					{step === 1 && (
						<Button
							type="button"
							variant="secondary"
							disabled={processing}
							onClick={() => goTo(0)}
						>
							Retour
						</Button>
					)}

					{step === 0 ? (
						<Button
							type="button"
							disabled={processing || !canGoNext}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (!validateStep(0)) return;
								goTo(1);
							}}
						>
							Suivant
						</Button>
					) : (
						<Button type="submit" processing={processing}>
							{mode === "create" ? "Ajouter" : "Enregistrer"}
						</Button>
					)}

					{mode === "update" && (
						<Button
							type="button"
							onClick={handleDelete}
							variant="danger"
							icon={<Trash size={20} />}
						/>
					)}
				</div>
			</div>
		</form>
	);
};

export default EventForm;
