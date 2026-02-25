import type { PropsWithChildren } from "react";
import type { Icon } from "#types/app";
import type { TwClass } from "#types/form";

type Props = PropsWithChildren & {
	moment: {
		icon: Icon;
		iconColor: TwClass;
		label: string;
	};
};

const MomentCard = ({ moment, children }: Props) => {
	const Icon = moment.icon;
	return (
		<section className="pt-4 px-4 pb-2 bg-card rounded-2xl border border-border">
			<div className="flex items-center gap-2">
				<Icon size={14} className={moment.iconColor} />
				<span
					className={`text-xs font-semibold uppercase tracking-wide text-foreground`}
				>
					{moment.label}
				</span>
			</div>
			<div className="divide-y divide-border/30">{children}</div>
		</section>
	);
};

export default MomentCard;
