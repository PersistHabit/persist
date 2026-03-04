import type { ShoppingElement } from "#types/shopping";
import ShoppingItemRow from "./shopping-item-row";

type Props = {
	items: ShoppingElement[];
	today?: boolean;
};

const ShoppingItemList = ({ items, today = false }: Props) => {
	return (
		<div className={`${!today ? "p-4" : ""} space-y-4`}>
			{!today && <h2 className="uppercase text-muted-foreground">Articles</h2>}

			<ul className="space-y-2">
				{items.map((i) => (
					<ShoppingItemRow
						key={`${i.id}-${i.category}`}
						item={i}
						today={today}
					/>
				))}
			</ul>
		</div>
	);
};
export default ShoppingItemList;
