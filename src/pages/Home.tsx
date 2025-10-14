import { useEffect, useState, useRef } from "react";
import { FaGithub, FaLinkedin, FaBug, FaGraduationCap } from "react-icons/fa";
import { SiHackthebox } from "react-icons/si";
import { Link } from "react-router-dom";
import FractalNetworkCore from "../components/FractalNetworkCore";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

// Hook for scroll reveal animations
function useRevealAnimation(): [React.RefObject<HTMLElement | null>, boolean] {
	const ref = useRef<HTMLElement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) setVisible(true);
				});
			},
			{ threshold: 0.15 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return [ref, visible];
}

export default function Home() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 100);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// TODO: Move to data file
	// TODO: Add root and user owns
	// TODO: Fetch from API or database?
	const rootOwnsData = [
		{ month: "Aug", owns: 10 },
		{ month: "Sep", owns: 17 },
		{ month: "Oct", owns: 17 },
	];

	const [aboutRef, aboutVisible] = useRevealAnimation();
	const [statsRef, statsVisible] = useRevealAnimation();
	const [graphRef, graphVisible] = useRevealAnimation();
	const [projectsRef, projectsVisible] = useRevealAnimation();
	const [writeupsRef, writeupsVisible] = useRevealAnimation();

	return (
		<div className="min-h-screen font-inter bg-main card-text">
			{/* ------------------- HERO SECTION ------------------- */}
			<section className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden pt-24">
				{/* Jarvis Background */}
				<div className="absolute inset-0 opacity-40 pointer-events-none">
					<FractalNetworkCore />
				</div>

				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 z-0" />

				{/* Main Content */}
				<div className="relative z-10 flex flex-col items-center">
					<div className="mb-4 muted-text-color font-mono text-sm sm:text-base animate-typing overflow-hidden whitespace-nowrap border-r-2 card-border-accent pr-2 opacity-0 animate-fadeIn delay-[0.2s]">
						&gt; whoami
					</div>
					<h1 className="text-5xl sm:text-6xl font-extrabold primary-text-color mb-2 tracking-wide opacity-0 animate-fadeUp delay-[0.4s]">
						Will Ward
					</h1>
					<p className="text-lg sm:text-xl secondary-text-color font-medium opacity-0 animate-fadeUp delay-[0.6s]">
						Penetration Tester · CS Student · Software Developer
					</p>
					<p className="muted-text-color mt-3 max-w-xl mx-auto leading-relaxed opacity-0 animate-fadeUp delay-[0.8s]">
						Building tools and breaking systems to understand them
						better. Focused on{" "}
						<span className="primary-text-color font-semibold">
							offensive security, automation
						</span>{" "}
						and{" "}
						<span className="primary-text-color font-semibold">
							secure software
						</span>
						.
					</p>

					{/* CTA Buttons */}
					<div className="mt-8 flex flex-wrap justify-center gap-4 opacity-0 animate-fadeUp delay-[1s]">
						<Link
							to="/projects"
							className="px-6 py-2 rounded-lg card-border-accent primary-text-color border hover:bg-accent hover:card-text transition">
							View Projects
						</Link>
						<Link
							to="/labs"
							className="px-6 py-2 rounded-lg card-border-accent primary-text-color border hover:bg-accent hover:card-text transition">
							HTB Write-Ups
						</Link>
						<Link
							to="mailto:wilburward@proton.me"
							className="px-6 py-2 rounded-lg card-border-accent primary-text-color border hover:bg-accent hover:card-text transition">
							Contact
						</Link>
					</div>
				</div>
			</section>

			{/* ------------------- ABOUT SECTION ------------------- */}
			<section
				ref={aboutRef}
				className={`relative py-20 px-8 border-y border-gray-800 overflow-hidden bg-black transition-all duration-700 ${
					aboutVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_80%)] pointer-events-none" />
				<div className="max-w-6xl mx-auto relative z-10">
					<h2 className="text-3xl font-bold text-cyan-400 mb-4">
						About Me
					</h2>
					<p className="text-gray-300 leading-relaxed mb-4">
						<span className="font-semibold text-cyan-400">
							Second-year Computer Science student
						</span>{" "}
						at the University of Surrey, pursuing a placement year
						(2026). Passionate about vulnerability research, ethical
						hacking, and tool development in{" "}
						<span className="text-cyan-400">
							C, Python, Java, and React
						</span>
						.
					</p>
					<p className="text-gray-500">
						Completed{" "}
						<span className="text-cyan-400 font-semibold">
							CPTS
						</span>{" "}
						course (exam pending) with real-world experience across
						enumeration, exploitation, privilege escalation, and
						Active Directory compromise.
					</p>
				</div>
			</section>

			{/* ------------------- STATS SECTION ------------------- */}
			<section
				ref={statsRef}
				className={`relative bg-black py-20 px-8 border-b border-gray-800 transition-all duration-700 ${
					statsVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}>
				<div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
					<div className="w-3/4 h-3/4 rounded-3xl bg-cyan-500/30 blur-3xl" />
				</div>
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
						{[
							{
								icon: <FaBug />,
								value: "20+",
								label: "Machines Rooted",
							},
							{
								icon: <FaGraduationCap />,
								value: "CPTS",
								label: "Course Complete",
							},
							{
								icon: <SiHackthebox />,
								value: "CPTS Modules",
								label: "Enumeration · Exploitation · AD · Reporting",
							},
							{
								icon: <FaBug />,
								value: "200+",
								label: "Simulated Targets",
							},
						].map((card, idx) => (
							<div
								key={idx}
								className={`card rounded-2xl py-8 bg-black/50 border border-cyan-400/20 hover:border-cyan-400/40 transition flex flex-col items-center transform ${
									statsVisible
										? "opacity-100 translate-y-0 scale-100"
										: "opacity-0 translate-y-8 scale-95"
								}`}
								style={{ transitionDelay: `${idx * 0.15}s` }}>
								<div className="text-4xl mb-2 text-cyan-400">
									{card.icon}
								</div>
								<h3 className="text-3xl font-bold mb-2 text-white">
									{card.value}
								</h3>
								<p className="text-gray-400 text-sm mt-1">
									{card.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ------------------- GRAPH SECTION ------------------- */}
			<section
				ref={graphRef}
				className={`bg-black py-20 px-8 border-b border-gray-800 transition-all duration-700 ${
					graphVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}>
				<div className="max-w-6xl mx-auto text-center">
					<h2 className="text-3xl font-bold text-cyan-400 mb-6">
						Root Owns Over Time
					</h2>
					<div className="w-full h-80">
						<ResponsiveContainer>
							<LineChart data={rootOwnsData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#2f2f2f"
								/>
								<XAxis dataKey="month" stroke="#ccc" />
								<YAxis stroke="#ccc" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#111",
										border: "1px solid #0ff",
									}}
								/>
								<Line
									type="monotone"
									dataKey="owns"
									stroke="#00ffff"
									strokeWidth={2}
									dot={{ r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</section>

			{/* ------------------- TOP PROJECTS SECTION ------------------- */}
			<section
				ref={projectsRef}
				className={`relative max-w-6xl mx-auto px-8 py-24 transition-all duration-700 ${
					projectsVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}>
				<h2 className="text-3xl font-bold text-center text-cyan-400 mb-10">
					Top Projects
				</h2>
				<div className="grid md:grid-cols-3 gap-8 mb-10">
					{[
						{
							title: "WXL-Proxy",
							desc: "Java-based MITM proxy with TLS interception.",
						},
						{
							title: "LFI Scanner",
							desc: "Python tool for detecting and exploiting LFI.",
						},
						{
							title: "Portfolio Site",
							desc: "React + Tailwind responsive personal site.",
						},
					].map((proj, idx) => (
						<div
							key={proj.title}
							className={`p-6 rounded-lg bg-black/40 border border-cyan-400/20 hover:border-cyan-400/40 transition transform hover:scale-[1.03] ${
								projectsVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
							style={{ transitionDelay: `${idx * 0.2}s` }}>
							<h3 className="text-xl font-bold text-cyan-400 mb-2">
								{proj.title}
							</h3>
							<p className="text-gray-400 text-sm mb-4">
								{proj.desc}
							</p>
							<Link
								to="/projects"
								className="text-cyan-400 hover:text-cyan-200 underline">
								View Project →
							</Link>
						</div>
					))}
				</div>
				<div className="flex justify-center">
					<Link
						to="/projects"
						className="px-6 py-2 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
						View All Projects
					</Link>
				</div>
			</section>

			{/* ------------------- HTB WRITE-UPS SECTION ------------------- */}
			<section
				ref={writeupsRef}
				className={`relative bg-black py-20 px-8 border-t border-gray-800 transition-all duration-700 ${
					writeupsVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-8"
				}`}>
				<div className="max-w-6xl mx-auto text-center">
					<h2 className="text-3xl font-bold text-cyan-400 mb-4">
						HTB Write-Ups
					</h2>
					<p className="text-gray-400 mb-8 max-w-2xl mx-auto">
						Read my detailed walkthroughs of various Hack The Box
						machines, covering initial access, exploitation,
						privilege escalation, and capturing the flag.
					</p>
					<Link
						to="/labs"
						className="px-6 py-3 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
						View All Write-Ups
					</Link>
				</div>
			</section>
		</div>
	);
}
