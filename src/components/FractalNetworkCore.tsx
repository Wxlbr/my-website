import { useEffect, useRef } from "react";

// --- Node and Packet types ---
type Node = {
	x: number;
	y: number;
	level: number;
	angle: number;
	parent?: Node;
	children: Node[];
	phase: number;
	pulse: number;
};
type Packet = {
	x: number;
	y: number;
	targetX: number;
	targetY: number;
	progress: number;
	speed: number;
	hue: number;
	direction: "inward" | "outward";
	currentNode: Node;
	targetNode: Node;
};

// --- Main Fractal Network Core ---
export default function FractalNetworkCore() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animRef = useRef<number | null>(null);
	const nodesRef = useRef<Node[]>([]);
	const packetsRef = useRef<Packet[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// --- Resize canvas to fit device pixel ratio ---
		function resize() {
			if (!canvas || !ctx) return;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * window.devicePixelRatio;
			canvas.height = rect.height * window.devicePixelRatio;
			ctx.setTransform(
				window.devicePixelRatio,
				0,
				0,
				window.devicePixelRatio,
				0,
				0
			);
		}
		resize();
		window.addEventListener("resize", resize);

		// --- Build fractal node tree ---
		function buildNetwork() {
			if (!canvas) return;
			const cx = canvas.offsetWidth / 2,
				cy = canvas.offsetHeight / 2;
			const nodes: Node[] = [];
			const core: Node = {
				x: cx,
				y: cy,
				level: 0,
				angle: 0,
				children: [],
				phase: 0,
				pulse: 0,
			};
			nodes.push(core);

			// Recursively add branches
			function addBranches(parent: Node, level: number) {
				if (level > 3) return;
				const count = [6, 4, 3, 2][level] || 2;
				const r = 60 + level * 50;
				for (let i = 0; i < count; i++) {
					const a =
						parent.angle +
						i * ((2 * Math.PI) / count) +
						level * 0.3;
					const node: Node = {
						x: parent.x + Math.cos(a) * r,
						y: parent.y + Math.sin(a) * r,
						level: level + 1,
						angle: a,
						parent,
						children: [],
						phase: Math.random() * Math.PI * 2,
						pulse: Math.random() * Math.PI * 2,
					};
					parent.children.push(node);
					nodes.push(node);
					addBranches(node, level + 1);
				}
			}
			addBranches(core, 0);
			nodesRef.current = nodes;
		}

		// --- Spawn a packet (data pulse) ---
		function spawnPacket() {
			const nodes = nodesRef.current;
			if (nodes.length < 2) return;
			const inward = Math.random() > 0.5;
			let from: Node, to: Node;
			if (inward) {
				const outer = nodes.filter((n) => n.level > 2);
				from =
					outer[Math.floor(Math.random() * outer.length)] || nodes[1];
				to = nodes[0];
			} else {
				from = nodes[0];
				const outer = nodes.filter((n) => n.level > 1);
				to =
					outer[Math.floor(Math.random() * outer.length)] || nodes[1];
			}
			packetsRef.current.push({
				x: from.x,
				y: from.y,
				targetX: to.x,
				targetY: to.y,
				progress: 0,
				speed: 0.02 + Math.random() * 0.03,
				hue: inward ? 190 : 210, // cyan hues
				direction: inward ? "inward" : "outward",
				currentNode: from,
				targetNode: to,
			});
		}

		// --- Animation loop ---
		let t = 0;
		function draw() {
			if (!canvas || !ctx) return;
			t += 0.016;
			ctx.fillStyle = "rgba(0,0,0,0.15)";
			ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

			const nodes = nodesRef.current,
				packets = packetsRef.current;
			nodes.forEach((n) => {
				n.phase += 0.02;
				n.pulse += 0.025;
			});

			// --- Draw branches (curved lines) ---
			ctx.strokeStyle =
				getComputedStyle(document.documentElement).getPropertyValue(
					"--color-accent"
				) + "40"; // 25% opacity
			ctx.lineWidth = 1;
			nodes.forEach((n) => {
				if (!n.parent) return;
				const p = n.parent;
				const mx = (n.x + p.x) / 2,
					my = (n.y + p.y) / 2;
				const ang = Math.atan2(n.y - p.y, n.x - p.x);
				const ctrlX = mx + Math.cos(ang + Math.PI / 2) * 25;
				const ctrlY = my + Math.sin(ang + Math.PI / 2) * 25;
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.quadraticCurveTo(ctrlX, ctrlY, n.x, n.y);
				ctx.stroke();
			});

			// --- Draw nodes (pulsing) ---
			const accent = getComputedStyle(
				document.documentElement
			).getPropertyValue("--color-accent");
			nodes.forEach((n) => {
				const base = n.level === 0 ? 8 : 4 - n.level * 0.4;
				const pulse = Math.sin(n.pulse) * 0.5 + 0.5;
				const size = base + pulse * 2;
				ctx.save();
				ctx.fillStyle = accent;
				ctx.shadowColor = accent;
				ctx.shadowBlur = 15;
				ctx.beginPath();
				ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			});

			// --- Draw packets (moving dots) ---
			for (let i = packets.length - 1; i >= 0; i--) {
				const p = packets[i];
				p.progress += p.speed;
				if (p.progress >= 1) {
					packets.splice(i, 1);
					continue;
				}
				const eased = 1 - Math.pow(1 - p.progress, 3);
				p.x = p.currentNode.x + (p.targetX - p.currentNode.x) * eased;
				p.y = p.currentNode.y + (p.targetY - p.currentNode.y) * eased;
				ctx.save();
				ctx.fillStyle = accent;
				ctx.shadowColor = accent;
				ctx.shadowBlur = 15;
				ctx.beginPath();
				ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			}

			// --- Occasionally spawn a new packet ---
			if (Math.random() < 0.12) spawnPacket();
			animRef.current = requestAnimationFrame(draw);
		}

		buildNetwork();
		draw();

		return () => {
			window.removeEventListener("resize", resize);
			if (animRef.current) cancelAnimationFrame(animRef.current);
		};
	}, []);

	// --- Canvas covers parent ---
	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full"
			style={{ background: "transparent" }}
		/>
	);
}
