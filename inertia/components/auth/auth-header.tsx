import Icon from "../ui/icon";

const AuthHeader = () => (
	<div className="flex flex-col items-center gap-2">
		<span className="flex items-center justify-center bg-white p-4 rounded-4xl shadow">
			<Icon size="xl" />
		</span>
		<h1 className="font-bold text-foreground text-3xl tracking-tight">
			Persist
		</h1>
		<p className="text-muted-foreground">Stay consistent, stay calm ✨</p>
	</div>
);

export default AuthHeader;
