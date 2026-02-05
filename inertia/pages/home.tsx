import { Head } from "@inertiajs/react";

export default function Home() {
	return (
		<>
			<Head title="Homepage" />

			<div className="pt-4 h-full flex flex-col">
				<h1 className="text-primary">Hello world</h1>
			</div>
		</>
	);
}
