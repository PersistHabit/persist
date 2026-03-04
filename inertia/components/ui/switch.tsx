import type { ReactNode } from "react";
import { type InputHTMLAttributes, useId } from "react";

type Props = {
	label?: ReactNode;
	checked: boolean;
	onChange: (checked: boolean) => void;
} & Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "checked" | "onChange"
>;

const Switch = ({ label, checked, onChange, id, name, ...props }: Props) => {
	const reactId = useId();
	const inputId = id ?? name ?? reactId;

	return (
		<div className="flex items-center justify-between gap-3">
			{label && (
				<label
					htmlFor={inputId}
					className="font-semibold text-sm text-foreground/80 cursor-pointer"
				>
					{label}
				</label>
			)}
			<button
				type="button"
				role="switch"
				id={inputId}
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={[
					"relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
					"transition-colors duration-200 ease-in-out",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					checked ? "bg-primary" : "bg-secondary",
				].join(" ")}
				{...props}
			>
				<span
					className={[
						"pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg",
						"transform transition duration-200 ease-in-out",
						checked ? "translate-x-5" : "translate-x-0",
					].join(" ")}
				/>
			</button>
		</div>
	);
};

export default Switch;
