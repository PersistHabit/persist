import { Form, Head, Link } from "@inertiajs/react";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import AuthLayout from "./_layout";

const RegisterPage = () => {
	return (
		<>
			<Head title="Créer un compte" />
			<Card>
				<div className="flex flex-col items-center">
					<h2 className="font-semibold text-lg tracking-wide">
						Créer un compte
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Rejoignez Persist et restez constant
					</p>
				</div>
				<Form className="space-y-4" method="POST" action="/auth/register">
					{({ errors, processing }) => (
						<>
							<Input
								label="Nom complet"
								type="text"
								name="fullName"
								autoComplete="name"
								placeholder="Nom complet"
								error={errors.fullName}
								required
								minLength={3}
								maxLength={100}
							/>
							<Input
								label="Email"
								type="email"
								name="email"
								autoComplete="email"
								placeholder="Adresse email"
								error={errors.email}
								required
								minLength={3}
								maxLength={255}
							/>
							<Input
								label="Mot de passe"
								type="password"
								name="password"
								placeholder="Mot de passe"
								error={errors.password}
								required
								minLength={12}
								maxLength={180}
							/>
							<Input
								label="Confirmer"
								type="password"
								name="password_confirmation"
								placeholder="Confirmer le mot de passe"
								error={errors.password_confirmation}
								required
								minLength={12}
								maxLength={180}
							/>
							<Button processing={processing} type="submit" className="w-full">
								Créer mon compte
							</Button>
							{errors.E_TOO_MANY_REQUESTS && (
								<p className="text-destructive text-center text-sm">
									Trop de requêtes effectuées
								</p>
							)}
						</>
					)}
				</Form>
				<p className="text-sm text-muted-foreground text-center">
					Déjà un compte ?{" "}
					<Link
						className="text-primary font-medium hover:underline"
						href="/login"
					>
						Se connecter
					</Link>
				</p>
			</Card>
		</>
	);
};

RegisterPage.layout = (page: React.ReactNode) => (
	<AuthLayout>{page}</AuthLayout>
);

export default RegisterPage;
