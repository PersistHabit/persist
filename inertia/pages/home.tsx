import { Head } from "@inertiajs/react";
import AppLayout from "./_layout";

const HomePage = ({
	user,
}: {
	user: {
		fullName: string;
		email: string;
	};
}) => {
	return (
		<>
			<Head title="Aujourd'hui" />

			<div className="pt-4 h-full flex flex-col">
				<h1 className="text-primary">Hello world</h1>
				{user.fullName}
			</div>
		</>
	);
};

HomePage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default HomePage;
