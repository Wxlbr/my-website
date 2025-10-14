import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";

export default function App() {
	const [scrollPercent, setScrollPercent] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.body.scrollHeight - window.innerHeight;
			const scrolled = (scrollTop / docHeight) * 100;
			setScrollPercent(scrolled);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="bg-main card-text min-h-screen flex flex-col font-inter">
			{/* Scroll Progress Bar */}
			<div
				className="fixed top-0 left-0 h-[2px] bg-accent z-[60] transition-all duration-200 ease-linear"
				style={{ width: `${scrollPercent}%` }}
			/>

			{/* Navbar */}
			<nav className="sticky top-0 z-50 backdrop-blur-md bg-main/80 border-b card-border shadow-lg relative">
				{/* Gradient scanline */}
				<div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
					{/* Logo with CLI Easter egg */}
					<NavLink
						to="/"
						className="text-2xl font-bold tracking-wide primary-text-color group relative">
						<span className="primary-text-color group-hover:secondary-text-color transition-colors">
							&gt;_
						</span>{" "}
						Will Ward
					</NavLink>

					{/* Nav Links */}
					<div className="flex gap-8 items-center">
						<NavLink
							to="/projects"
							className={({ isActive }) =>
								`relative pb-1 transition duration-300 ${
									isActive
										? "primary-text-color font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-accent"
										: "muted-text-color hover:primary-text-color"
								}`
							}>
							Projects
						</NavLink>

						<NavLink
							to="/labs"
							className={({ isActive }) =>
								`relative pb-1 transition duration-300 ${
									isActive
										? "primary-text-color font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-accent"
										: "muted-text-color hover:primary-text-color"
								}`
							}>
							HTB Write-Ups
						</NavLink>

						{/* Vertical divider */}
						<div className="h-6 w-px card-border mx-1"></div>

						{/* Social Icons */}
						<a
							href="https://github.com/Wxlbr"
							target="_blank"
							rel="noopener noreferrer"
							className="muted-text-color hover:primary-text-color transition-colors"
							aria-label="GitHub">
							<FaGithub className="text-2xl" />
						</a>

						<a
							href="https://www.linkedin.com/in/will-r-ward/"
							target="_blank"
							rel="noopener noreferrer"
							className="muted-text-color hover:primary-text-color transition-colors"
							aria-label="LinkedIn">
							<FaLinkedin className="text-2xl" />
						</a>
					</div>
				</div>
			</nav>

			{/* Page Content */}
			<main className="flex-grow">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/labs" element={<Labs />} />
					<Route path="/labs/:id" element={<LabDetail />} />
				</Routes>
			</main>

			{/* Footer */}
			<footer className="bg-main/90 border-t card-border p-4 text-center text-sm muted-text-color">
				© {new Date().getFullYear()} Will Ward · Built with React +
				Tailwind
			</footer>
		</div>
	);
}
