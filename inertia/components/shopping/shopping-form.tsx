import { router, useForm } from "@inertiajs/react";
import { Trash } from "lucide-react";
import {
	type NewShoppingElementFormData,
	ShoppingCategories,
	type ShoppingCategorySlug,
} from "#types/shopping";
import { ShoppingSchema } from "@/schemas/shopping.schema";
import { useModal } from "../modal/modal-context";
import Button from "../ui/button";
import Input from "../ui/input";
import Picker from "../ui/picker";
import Switch from "../ui/switch";

type Props = {
	mode?: "create" | "update";
	shoppingItemId?: number;
	initialData?: Partial<NewShoppingElementFormData>;
};

const defaultData: NewShoppingElementFormData = {
	name: "",
	category: "general",
	pinned: false,
};

const ShoppingForm = ({
	mode = "create",
	initialData,
	shoppingItemId,
}: Props) => {
	const modal = useModal();

	const form = useForm<NewShoppingElementFormData>({
		...defaultData,
		...initialData,
	});

	const { data, setData, processing, errors, reset, clearErrors, post, put } =
		form;

	const handleCancel = () => {
		reset();
		clearErrors();
		modal.close();
	};

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		clearErrors();

		const result = ShoppingSchema.safeParse(data);
		if (!result.success) {
			for (const issue of result.error.issues) {
				form.setError(
					issue.path[0] as keyof NewShoppingElementFormData,
					issue.message,
				);
			}
			return;
		}

		if (mode === "create") {
			post("/shopping", {
				onSuccess: () => {
					clearErrors();
					reset();
					modal.close();
				},
				onError: (e) => console.error(e),
			});
		} else {
			put(`/shopping/${shoppingItemId}`, {
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
			title: "Supprimer cet élément ?",
			danger: true,
			message: "Voulez vous vraiment supprimer cet élément de la liste ?",
			cancelText: "Annuler",
			confirmText: "Supprimer",
		});

		if (!confirm) return;

		router.delete(`/shopping/${shoppingItemId}`, {
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
				id="name"
				name="name"
				type="text"
				label="Que faut il acheter ?"
				placeholder="e.g. Cordes de guitare"
				value={data.name}
				onChange={(e) => setData("name", e.target.value)}
				required
				minLength={1}
			/>
			<Picker<ShoppingCategorySlug>
				name="category"
				display="grid"
				label="Catégorie"
				options={ShoppingCategories}
				value={data.category}
				onChange={(v) => setData("category", v)}
				error={errors.category}
			/>
			<Switch
				checked={data.pinned}
				onChange={(v) => setData("pinned", v)}
				label="Épingler"
			/>
			<div className="flex flex-col-reverse md:flex-row gap-3 justify-between pt-4">
				{mode === "update" && (
					<div className="flex gap-3 flex-col-reverse md:flex-row">
						<Button
							variant="danger"
							icon={<Trash size={18} />}
							onClick={handleDelete}
						/>
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

export default ShoppingForm;
