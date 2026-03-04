import { Eye, EyeOff } from "lucide-react";
import {
	type InputHTMLAttributes,
	type ReactNode,
	useId,
	useState,
} from "react";

type Props = {
	label?: ReactNode;
	error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
		type?: "text" | "email" | "password" | "number" | "search" | "date";
	};

const Input = ({
	label,
	error,
	id,
	name,
	type = "text",
	className,
	...props
}: Props) => {
	const reactId = useId();
	const inputId = id ?? name ?? reactId;

	const isPassword = type === "password";
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="font-semibold text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/80"
				>
					{label}
				</label>
			)}

			<div className="relative w-full">
				<input
					id={inputId}
					name={name}
					type={isPassword && showPassword ? "text" : type}
					aria-invalid={!!error}
					className={[
						"flex w-full border px-3 py-2 text-base ring-offset-background transition",
						"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
						"placeholder:text-muted-foreground",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"md:text-sm h-12 bg-secondary/30 border-border/50 focus:border-primary/50 rounded-xl",
						isPassword ? "pr-12" : "",
						className ?? "",
					].join(" ")}
					{...props}
				/>

				{isPassword && (
					<button
						type="button"
						onClick={() => setShowPassword((v) => !v)}
						tabIndex={-1}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				)}
			</div>

			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	);
};

export default Input;
