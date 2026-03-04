type Props = {
	size?: "sm" | "md" | "lg" | "xl";
};

const sizeMap = {
	sm: 24,
	md: 32,
	lg: 48,
	xl: 64,
};

const Icon = ({ size = "md" }: Props) => {
	const px = sizeMap[size];
	return <img src="/icon.svg" alt="Persist Icon" width={px} height={px} />;
};

export default Icon;
