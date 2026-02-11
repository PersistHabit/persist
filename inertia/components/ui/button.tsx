import type { ButtonVariant } from "@shared/types/app";
import { clsx } from "clsx";
import { Loader } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	icon?: React.ReactNode;
	variant?: ButtonVariant;
	processing?: boolean;
	autoHide?: boolean;
};

export default function Button({
	type = "button",
	variant = "primary",
	autoHide = false,
	icon,
	children,
	processing,
	...props
}: ButtonProps) {
	const base = clsx(
		"flex items-center transition justify-center gap-2 font-semibold rounded-2xl transition cursor-pointer text-sm max-h-10 disabled:bg-muted p-6 ",
		props.className,
	);

	const variants = {
		primary: "bg-primary text-primary-foreground hover:bg-primary/90",
		secondary: "bg-secondary",
		danger:
			"bg-destructive text-destructive-foreground hover:bg-destructive/90",
	}[variant];

	const content = (
		<>
			{icon && <span className="shrink-0">{icon}</span>}
			{children && (
				<span className={`${autoHide && "hidden lg:block"}`}>{children}</span>
			)}
		</>
	);

	const classes = clsx(base, variants);

	return (
		<button type={type} {...props} className={classes}>
			{processing ? <Loader className="animate-spin" /> : content}
		</button>
	);
}
