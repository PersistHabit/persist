import clsx from "clsx";
import {
	Categories,
	type CategorySlug,
	type DayMomentSlug,
	DayMomentTagColor,
} from "#types/agenda";

type Props = {
	categorySlug: CategorySlug;
	dayMomentSlug?: DayMomentSlug;
};

const CategoryBadge = ({ categorySlug, dayMomentSlug }: Props) => {
	const category = Categories[categorySlug];

	return (
		<div className="relative inline-flex">
			<div
				className={clsx(
					"flex items-center gap-1 p-2 rounded-xl",
					category.bgColor,
				)}
			>
				<category.icon size={16} className={category.iconColor} />
				{dayMomentSlug && (
					<div
						className={clsx(
							"absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
							DayMomentTagColor[dayMomentSlug],
						)}
					></div>
				)}
			</div>
		</div>
	);
};

export default CategoryBadge;
