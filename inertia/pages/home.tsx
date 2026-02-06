import { Head, router } from "@inertiajs/react";
import Button from "@/components/ui/button";

export default function Home({
	user,
}: {
	user: {
		fullName: string;
		email: string;
	};
}) {
	const handleLogout = () => {
		router.delete("/auth");
	};

	return (
		<>
			<Head title="Homepage" />

			<div className="pt-4 h-full flex flex-col">
				<h1 className="text-primary">Hello world</h1>
				{user.fullName}
				<div className="w-48">
					<Button type="button" onClick={handleLogout}>
						Se déconnecter
					</Button>
				</div>
			</div>
		</>
	);
}
