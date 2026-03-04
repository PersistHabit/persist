import vine, { SimpleMessagesProvider } from "@vinejs/vine";

vine.messagesProvider = new SimpleMessagesProvider(
	{
		required: "Ce champ est requis.",
		confirmed: "Les mots de passe doivent être identiques.",
		email: "L’adresse e-mail n’est pas valide.",
		mobile: "Le numéro de téléphone doit être valide.",
		regex: "Le format du champ n’est pas valide.",
		minLength: "Doit contenir au minimum {{ min }} caractères.",
		maxLength: "Doit pas dépasser {{ max }} caractères.",

		date: "Le format de la date n’est pas correct.",
		"date.beforeField":
			"La date de début doit être antérieure à la date de fin.",
		"date.afterField":
			"La date de fin doit être postérieure à la date de début.",

		// Surcharges ciblées
		"password.regex":
			"Le mot de passe doit contenir au minimum un chiffre, une majuscule et un caractère spécial.",
		"password.minLength":
			"Le mot de passe doit contenir au minimum {{ min }} caractères.",
		"email.isUnique": "Cette adresse email est déjà utilisée",
	},
	{
		password: "mot de passe",
		password_confirmation: "confirmation du mot de passe",
		email: "adresse e-mail",
		mobile: "numéro de téléphone",
		start_date: "date de début",
		end_date: "date de fin",
	},
);
