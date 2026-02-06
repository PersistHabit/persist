import type { PropsWithChildren } from "react";

const Card = ({ children }: PropsWithChildren) => {
	return (
		<div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 md:min-w-lg">
			{children}
		</div>
	);
};

export default Card;
