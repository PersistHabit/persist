import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import Modal from "@/components/ui/modal";
import Button from "../ui/button";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalOptions = {
	title: string;
	content: React.ReactNode;

	size?: ModalSize;
	closeOnEsc?: boolean;
	className?: string;

	closeOnOverlayClick?: boolean;
};

type ModalEntry = ModalOptions & {
	id: string;
};

type ModalApi = {
	open: (opts: ModalOptions) => string;
	close: (id?: string) => void;
	closeAll: () => void;
	isOpen: boolean;

	// optionnel: helper confirm
	confirm: (opts: {
		title?: string;
		message?: React.ReactNode;
		confirmText?: string;
		cancelText?: string;
		danger?: boolean;
	}) => Promise<boolean>;
};

const ModalContext = createContext<ModalApi | null>(null);

export function useModal() {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("useModal must be used within <ModalProvider />");
	return ctx;
}

function uid() {
	return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [stack, setStack] = useState<ModalEntry[]>([]);

	const isOpen = stack.length > 0;
	const top = stack[stack.length - 1];

	const open = useCallback((opts: ModalOptions) => {
		const id = uid();
		setStack((s) => [...s, { id, ...opts }]);
		return id;
	}, []);

	const close = useCallback((id?: string) => {
		setStack((s) => {
			if (!s.length) return s;
			if (!id) return s.slice(0, -1);
			const idx = s.findIndex((m) => m.id === id);
			if (idx === -1) return s;
			return [...s.slice(0, idx), ...s.slice(idx + 1)];
		});
	}, []);

	const closeAll = useCallback(() => setStack([]), []);

	const confirm = useCallback<ModalApi["confirm"]>(
		({
			title = "Confirmation",
			message,
			confirmText = "OK",
			cancelText = "Annuler",
			danger,
		}) => {
			return new Promise<boolean>((resolve) => {
				const id = open({
					title,
					size: "sm",
					closeOnEsc: true,
					content: (
						<ConfirmContent
							title={title}
							message={message}
							confirmText={confirmText}
							cancelText={cancelText}
							danger={danger}
							onConfirm={() => {
								resolve(true);
								close(id);
							}}
							onCancel={() => {
								resolve(false);
								close(id);
							}}
						/>
					),
				});
			});
		},
		[open, close],
	);

	const api = useMemo(
		() => ({ open, close, closeAll, isOpen, confirm }),
		[open, close, closeAll, isOpen, confirm],
	);

	return (
		<ModalContext.Provider value={api}>
			{children}
			<ModalHost modal={top} onClose={() => close(top?.id)} />
		</ModalContext.Provider>
	);
}

function ModalHost({
	modal,
	onClose,
}: {
	modal?: ModalEntry;
	onClose: () => void;
}) {
	if (!modal) return null;

	const {
		title,
		content,
		size,
		closeOnEsc,
		className,
		closeOnOverlayClick = true,
	} = modal;

	return (
		<div className="fixed inset-0 z-100">
			{/* overlay accessible */}
			<button
				type="button"
				aria-label="Fermer le modal"
				className="absolute inset-0"
				onClick={() => {
					if (closeOnOverlayClick) onClose();
				}}
			/>

			<div className="absolute inset-0 flex items-center justify-center p-4">
				<Modal
					open
					onClose={onClose}
					title={title}
					size={size}
					closeOnEsc={closeOnEsc}
					className={className}
				>
					{content}
				</Modal>
			</div>
		</div>
	);
}

function ConfirmContent({
	message,
	confirmText,
	cancelText,
	danger,
	onConfirm,
	onCancel,
}: {
	title: string;
	message?: React.ReactNode;
	confirmText: string;
	cancelText: string;
	danger?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<div className="space-y-4">
			{message ? (
				<div className="text-sm text-muted-foreground">{message}</div>
			) : null}

			<div className="flex justify-end gap-2">
				<Button onClick={onCancel} variant="secondary">
					{cancelText}
				</Button>
				<Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
					{confirmText}
				</Button>
			</div>
		</div>
	);
}
