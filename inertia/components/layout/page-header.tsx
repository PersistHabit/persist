import type { Icon } from "#types/app";
import PageIcon from "./page-icon";

type Props = {
	icon: Icon;
	title: string;
	subtitle: string;
	button?: React.ReactNode;
};

const PageHeader = ({ icon, title, subtitle, button }: Props) => (
	<header className="sticky top-0 z-10 bg-background backdrop-blur-sm border-b border-border px-4 lg:px-6 py-4">
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				<PageIcon icon={icon} />
				<div>
					<h2 className="text-lg font-semibold text-foreground capitalize">
						{title}
					</h2>
					<p className="text-sm text-muted-foreground">{subtitle}</p>
				</div>
			</div>
			{button && button}
		</div>
	</header>
);

export default PageHeader;
