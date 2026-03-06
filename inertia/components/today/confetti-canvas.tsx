import { useEffect, useRef } from "react";

const COLORS = [
	"#f59e0b",
	"#10b981",
	"#3b82f6",
	"#ec4899",
	"#8b5cf6",
	"#ef4444",
	"#f97316",
];

type Props = {
	active: boolean;
	count?: number;
	spread?: number;
	width?: number;
	height?: number;
	className?: string;
	style?: React.CSSProperties;
};

const ConfettiCanvas = ({
	active,
	count = 20,
	spread = 3,
	width = 120,
	height = 120,
	className,
	style,
}: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!active) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const cx = canvas.width / 2;
		const cy = canvas.height / 2;

		const particles = Array.from({ length: count }, () => {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * spread + 1;
			return {
				x: cx,
				y: cy,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 2.5,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				life: 0,
				maxLife: 40 + Math.floor(Math.random() * 30),
				w: 3 + Math.random() * 5,
				h: 5 + Math.random() * 4,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.25,
			};
		});

		let raf: number;
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			let alive = false;
			for (const p of particles) {
				if (p.life >= p.maxLife) continue;
				alive = true;
				p.life++;
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.15;
				p.rotation += p.rotationSpeed;
				ctx.save();
				ctx.globalAlpha = 1 - p.life / p.maxLife;
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rotation);
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
				ctx.restore();
			}
			if (alive) raf = requestAnimationFrame(animate);
		};

		raf = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(raf);
	}, [active, count, spread]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			className={className}
			style={{ pointerEvents: "none", ...style }}
		/>
	);
};

export default ConfettiCanvas;
