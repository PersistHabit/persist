import { Head } from "@inertiajs/react";
import { Plus, ShoppingBasket } from "lucide-react";
import type { ShoppingElement } from "#types/shopping";
import EmptyList from "@/components/empty-list";
import PageHeader from "@/components/layout/page-header";
import { useModal } from "@/components/modal/modal-context";
import ShoppingForm from "@/components/shopping/shopping-form";
import ShoppingItemList from "@/components/shopping/shopping-item-list";
import Button from "@/components/ui/button";
import AppLayout from "./_layout";

type Props = {
	shoppingItems: ShoppingElement[];
};

const ShoppingPage = ({ shoppingItems }: Props) => {
	const modal = useModal();

	const openCreateModal = () => {
		modal.open({
			title: "Ajouter quelque chose à acheter",
			size: "lg",
			content: <ShoppingForm />,
		});
	};

	const unDoneItems = shoppingItems.filter((i) => !i.done);

	return (
		<>
			<Head title="Shopping" />
			<div className="flex flex-col flex-1 min-h-0">
				<PageHeader
					title="Shopping"
					subtitle={
						unDoneItems.length !== 0
							? `${unDoneItems.length} ${unDoneItems.length === 1 ? "article" : "articles"} à acheter`
							: "Things to buy"
					}
					icon={ShoppingBasket}
					button={
						<Button
							onClick={openCreateModal}
							autoHide={true}
							icon={<Plus size={18} />}
						>
							Ajouter à la liste
						</Button>
					}
				/>
				{shoppingItems.length !== 0 ? (
					<ShoppingItemList items={shoppingItems} />
				) : (
					<EmptyList icon={ShoppingBasket} label="Aucun article à acheter" />
				)}
			</div>
		</>
	);
};

ShoppingPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default ShoppingPage;
