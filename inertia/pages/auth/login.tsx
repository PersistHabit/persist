import { Form, Link } from "@adonisjs/inertia/react";
import { Head } from "@inertiajs/react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import AuthLayout from "./_layout";

const LoginPage = () => {
	return (
		<>
			<Head title="Se connecter" />
			<Card>
				<div className="flex flex-col items-center">
					<h2 className="font-semibold text-lg tracking-wide">Se connecter</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Entrez vos identifiants pour continuer
					</p>
				</div>
				<Form className="space-y-4" method="POST" action="/auth/login">
					{({
						errors,
						processing,
					}: {
						errors: Record<string, string>;
						processing: boolean;
					}) => (
						<>
							<Input
								label="Email"
								type="email"
								name="email"
								autoComplete="email"
								placeholder="Adresse email"
								error={errors.email}
								required
								minLength={10}
							/>
							<Input
								label="Mot de passe"
								type="password"
								name="password"
								placeholder="Mot de passe"
								error={errors.password}
								required
								minLength={10}
							/>
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									name="remember"
									id="remember"
									className="text-primary transition rounded focus:ring-primary"
								/>

								<label className="select-none" htmlFor="remember">
									Se souvenir de moi
								</label>
							</div>
							<Button processing={processing} type="submit" className="w-full">
								Se connecter
							</Button>
							{errors.E_INVALID_CREDENTIALS && (
								<p className="text-destructive text-center text-sm">
									Adresse email ou mot de passe incorrect
								</p>
							)}
							{errors.E_TOO_MANY_REQUESTS && (
								<p className="text-destructive text-center text-sm">
									Trop de requêtes effectuées
								</p>
							)}
						</>
					)}
				</Form>
				<p className="text-sm text-muted-foreground text-center">
					Pas encore de compte ?{" "}
					<Link
						className="text-primary font-medium hover:underline"
						href="/register"
					>
						Créer un compte
					</Link>
				</p>
			</Card>
		</>
	);
};

LoginPage.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;

export default LoginPage;
