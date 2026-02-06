import type { PropsWithChildren } from "react";
import AuthHeader from "@/components/auth/auth-header";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<section className="h-screen flex flex-col items-center pt-14 gap-8">
			<AuthHeader />
			{children}
		</section>
	);
}
