import type { Icon } from "#types/app";

type Props = {
	icon: Icon;
};

const PageIcon = ({ icon }: Props) => {
	const Icon = icon;
	return (
		<div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
			<Icon size={20} />
		</div>
	);
};

export default PageIcon;
