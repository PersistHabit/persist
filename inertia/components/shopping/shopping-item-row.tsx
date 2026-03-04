import { router } from "@inertiajs/react";
import { Edit, Pin, PinOff, Trash2 } from "lucide-react";
import { ShoppingCategoryBadges, type ShoppingElement } from "#types/shopping";
import { useModal } from "../modal/modal-context";
import ShoppingForm from "./shopping-form";

type Props = {
	item: ShoppingElement;
	today?: boolean;
};

const ShoppingItemRow = ({ item, today = false }: Props) => {
	const modal = useModal();

	const badge = ShoppingCategoryBadges[item.category];

	const handlePin = () =>
		item.pinned
			? router.patch(`/shopping/${item.id}/unpin`)
			: router.patch(`/shopping/${item.id}/pin`);

	const handleEdit = () => {
		modal.open({
			title: "Ajouter quelque chose à acheter",
			size: "lg",
			content: (
				<ShoppingForm
					mode="update"
					initialData={item}
					shoppingItemId={item.id}
				/>
			),
		});
	};

	const handleCheck = () =>
		item.done
			? router.patch(`/shopping/${item.id}/undone`)
			: router.patch(`/shopping/${item.id}/done`);

	const handleDelete = async () => {
		if (!item.done) {
			const confirm = await modal.confirm({
				title: "Supprimer l'article ?",
				danger: true,
				message: "Voulez vous vraiment supprimer cet article ?",
				cancelText: "Annuler",
				confirmText: "Supprimer",
			});

			if (!confirm) return;
		}

		router.delete(`/shopping/${item.id}`);
	};

	return (
		<label
			className={`bg-card p-4 rounded-xl py-3 flex items-center cursor-pointer gap-3`}
		>
			<input
				type="checkbox"
				className="
    appearance-none
    w-4 h-4
    rounded-full
    bg-card
    ring-2 ring-border
    checked:bg-primary
    checked:ring-primary
    hover:bg-primary/20
    checked:hover:bg-primary
    focus:outline-none
    focus:ring-0
    focus-visible:ring-0
    focus-visible:outline-none
    border-none
    cursor-pointer
    transition
  "
				checked={item.done}
				onChange={handleCheck}
			/>
			<li
				className={`flex items-center justify-between w-full lg:pr-10 ${item.done ? "text-muted-foreground line-through" : ""}`}
			>
				<div className="flex items-center gap-4">
					<badge.icon className={badge.color} size={18} /> {item.name}
				</div>
				<div className="flex items-center md:gap-4 text-muted-foreground">
					<button
						type="button"
						className={`cursor-pointer transition ${item.pinned ? "text-primary" : ""} hover:text-primary hover:bg-muted p-2 rounded-xl`}
						onClick={handlePin}
					>
						{item.pinned ? <PinOff size={18} /> : <Pin size={18} />}
					</button>
					{!today && (
						<>
							<button
								type="button"
								className="cursor-pointer transition hover:text-primary hover:bg-muted p-2 rounded-xl"
								onClick={handleEdit}
							>
								<Edit size={18} />
							</button>
							<button
								type="button"
								className="cursor-pointer transition hover:text-destructive hover:bg-muted p-2 rounded-xl"
								onClick={handleDelete}
							>
								<Trash2 size={18} />
							</button>
						</>
					)}
				</div>
			</li>
		</label>
	);
};

export default ShoppingItemRow;
