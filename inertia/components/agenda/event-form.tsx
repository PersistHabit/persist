import { router, useForm } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import type { NewEventFormData } from "#types/agenda";
import Button from "@/components/ui/button";
import { NewEventSchema } from "@/schemas/agenda.schema";
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

const Step0Schema = NewEventSchema.pick({
	title: true,
	dayMoment: true,
	category: true,
	startDate: true,
});

const Step1Schema = NewEventSchema.pick({
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
};

const defaultData: NewEventFormData = {
	title: "",
	dayMoment: "morning",
	category: "health",
	startDate: "",
	recurrence: {
		type: "once",
		interval: undefined,
		unit: undefined,
		days: [],
	},
};

const EventForm = ({ mode = "create", initialData, eventId }: Props) => {
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
