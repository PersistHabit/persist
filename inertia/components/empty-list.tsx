import type { Icon } from "#types/app";

type Props = {
	icon: Icon;
	label: string;
};

const EmptyList = ({ icon, label }: Props) => {
	const Icon = icon;
	return (
		<section className="p-10 flex flex-col items-center justify-center gap-4">
			<Icon size={48} className="text-muted-foreground" />
			<p className="text-muted-foreground text-lg">{label}</p>
		</section>
	);
};

export default EmptyList;
