import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type Props = {
	isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
	isLoading,
	className,
	children,
	disabled,
	...props
}: Props) => {
	return (
		<button
			disabled={disabled || isLoading}
			className={[
				"inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer font-semibold",
				"ring-offset-background transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				"disabled:pointer-events-none disabled:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
				"bg-primary text-primary-foreground hover:bg-primary/90",
				"px-4 py-2 w-full h-12 rounded-xl text-base font-medium mt-2",
				className ?? "",
			].join(" ")}
			{...props}
		>
			{isLoading ? (
				<span className="[&_svg]:size-6">
					<Loader2 className="animate-spin" />
				</span>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
