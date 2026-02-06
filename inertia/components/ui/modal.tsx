import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl";

export type BaseModalProps = {
	open: boolean;
	onClose: () => void;
};

type ModalProps = BaseModalProps & {
	title: string;

	children: React.ReactNode;

	size?: ModalSize;
	closeOnEsc?: boolean;

	className?: string; // pour customiser le panneau
};

const sizeClasses: Record<ModalSize, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
};

export default function Modal({
	open,
	onClose,
	title,
	children,
	size = "md",
	closeOnEsc = true,
	className,
}: ModalProps) {
	// close on ESC
	useEffect(() => {
		if (!open || !closeOnEsc) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, closeOnEsc, onClose]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-100">
					<motion.div
						className="absolute inset-0 bg-black/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					/>

					<div className="absolute inset-0 flex items-center justify-center p-4">
						<motion.div
							role="dialog"
							aria-modal="true"
							aria-label={title ?? "Modal"}
							className={clsx(
								"w-full rounded-2xl border border-border bg-card shadow-xl",
								"outline-none",
								sizeClasses[size],
								className,
							)}
							onClick={(e) => e.stopPropagation()}
							initial={{ opacity: 0, y: 10, scale: 0.98 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.98 }}
							transition={{ duration: 0.16, ease: "easeOut" }}
						>
							<div className="flex justify-between px-5 pt-4 pb-2">
								<h2 className="text-base font-semibold">{title}</h2>
								<button
									onClick={onClose}
									className="text-muted-foreground hover:text-muted-foreground/110 transition cursor-pointer"
									type="button"
								>
									<X size="20" />
								</button>
							</div>

							<div className="px-5 py-4">{children}</div>
						</motion.div>
					</div>
				</div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
