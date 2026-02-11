import type { InertiaFormProps } from "@inertiajs/react";
import type { CategorySlug, DayMomentSlug } from "#types/agenda";
import { Categories, DayMoments } from "#types/agenda";
import Input from "@/components/ui/input";
import Picker from "@/components/ui/picker";

type NewEventBasics = {
	title: string;
	dayMoment: DayMomentSlug;
	category: CategorySlug;
};

type Props = {
	data: NewEventBasics;
	setData: InertiaFormProps<NewEventBasics>["setData"];
	errors: Record<string, string>;
};

const StepBasics = ({ data, setData, errors }: Props) => {
	return (
		<>
			<Input
				id="title"
				name="title"
				type="text"
				label="Titre"
				placeholder="Qu'est ce qui doit être fait ?"
				value={data.title}
				error={errors.title}
				onChange={(e) => setData("title", e.target.value)}
				minLength={3}
				required
			/>

			<Picker<DayMomentSlug>
				name="dayMoment"
				display="row"
				label="Quand"
				options={DayMoments}
				value={data.dayMoment}
				onChange={(v) => setData("dayMoment", v)}
				error={errors.dayMoment}
			/>

			<Picker<CategorySlug>
				name="category"
				display="grid"
				label="Catégorie"
				options={Categories}
				value={data.category}
				onChange={(v) => setData("category", v)}
				error={errors.category}
			/>
		</>
	);
};

export default StepBasics;
