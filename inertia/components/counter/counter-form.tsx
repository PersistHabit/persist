import { router, useForm } from "@inertiajs/react";
import { Trash } from "lucide-react";
import {
	type CounterDirectionSlug,
	CounterDirections,
	type CounterTriggerSlug,
	CounterTriggers,
	type NewCounterFormData,
} from "#types/counter";
import { CounterSchema } from "../../schemas/counter.schema";
import { useModal } from "../modal/modal-context";
import Button from "../ui/button";
import Input from "../ui/input";
import Picker from "../ui/picker";
import Switch from "../ui/switch";
import ColorPicker from "./color-picker";

type Props = {
	mode?: "create" | "update";
	counterId?: number;
	initialData?: Partial<NewCounterFormData>;
	handleReset?: () => void;
};

const defaultData: NewCounterFormData = {
	title: "",
	value: 0,
	direction: "increment",
	trigger: "daily",
	color: "streak-0",
	pinned: false,
};

const CounterForm = ({
	mode = "create",
	initialData,
	counterId,
	handleReset,
}: Props) => {
	const modal = useModal();

	const form = useForm<NewCounterFormData>({
		...defaultData,
		...initialData,
	});

	const { data, setData, processing, errors, clearErrors, reset, post, put } =
		form;

	const handleCancel = () => {
		reset();
		clearErrors();
		modal.close();
	};

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		clearErrors();

		const result = CounterSchema.safeParse(data);
		if (!result.success) {
			for (const issue of result.error.issues) {
				form.setError(issue.path[0] as keyof NewCounterFormData, issue.message);
			}
			return;
		}

		if (mode === "create") {
			post("/counters", {
				onSuccess: () => {
					clearErrors();
					reset();
					modal.close();
				},
				onError: (e) => console.error(e),
			});
		} else {
			put(`/counters/${counterId}`, {
				onSuccess: () => {
					clearErrors();
					reset();
					modal.close();
				},
				onError: (e) => console.error(e),
			});
		}
	};

	const handleDelete = async () => {
		const confirm = await modal.confirm({
			title: "Supprimer le compteur ?",
			danger: true,
			message: "Voulez vous vraiment supprimer ce compteur ?",
			cancelText: "Annuler",
			confirmText: "Supprimer",
		});

		if (!confirm) return;
		router.delete(`/counters/${counterId}`, {
			onSuccess: () => {
				clearErrors();
				reset();
				modal.closeAll();
			},
			onError: (e) => console.error(e),
		});
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<Input
				name="title"
				label="Titre"
				placeholder="e.g. Jours sans sucre"
				onChange={(e) => setData("title", e.target.value)}
				value={data.title}
				required
			/>
			<Input
				name="value"
				label="Valeur"
				placeholder="Valeur"
				type="number"
				min={0}
				onChange={(e) => setData("value", Number(e.target.value))}
				value={data.value}
				error={errors.value}
				required
			/>
			<Picker<CounterDirectionSlug>
				name="direction"
				display="row"
				label="Action"
				options={CounterDirections}
				value={data.direction}
				onChange={(v) =>
					setData({
						...data,
						direction: v,
						color: v === "increment" ? "streak-0" : "countdown-0",
					})
				}
				error={errors.direction}
			/>
			<Picker<CounterTriggerSlug>
				name="trigger"
				display="row"
				label="Déclencheur"
				options={CounterTriggers}
				value={data.trigger}
				onChange={(v) => setData("trigger", v)}
				error={errors.trigger}
			/>
			<ColorPicker
				counterDirection={data.direction}
				onChange={(v) => setData("color", v)}
				value={data.color}
			/>
			<Switch
				label="Épingler"
				checked={data.pinned}
				onChange={(v) => setData("pinned", v)}
			/>
			<div className="flex flex-col-reverse md:flex-row gap-3 justify-between pt-4">
				{mode === "update" && (
					<div className="flex gap-3 flex-col-reverse md:flex-row">
						<Button
							variant="danger"
							icon={<Trash size={18} />}
							onClick={handleDelete}
						/>
						<Button
							variant="secondary"
							onClick={() => {
								if (handleReset) handleReset();
								clearErrors();
								reset();
							}}
						>
							Réinitialiser
						</Button>
					</div>
				)}
				<div className="flex gap-3 flex-col-reverse md:flex-row">
					<Button
						type="button"
						disabled={processing}
						variant="secondary"
						onClick={handleCancel}
					>
						Annuler
					</Button>
					<Button type="submit" processing={processing}>
						{mode === "create" ? "Ajouter" : "Enregistrer"}
					</Button>
				</div>
			</div>
		</form>
	);
};

export default CounterForm;
