import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";

export default function App() {
	return (
		<div className="bg-main card-text min-h-screen flex flex-col">
			{/* Navbar */}
			<nav className="bg-card sticky top-0 z-50 border-b card-border">
				<div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
					{/* Logo/Name */}
					<NavLink
						to="/"
						className="text-2xl font-bold tracking-tight primary-text-color hover:text-emerald-300 transition">
						Will Ward
					</NavLink>

					{/* Links */}
					<div className="flex gap-6">
						<NavLink
							to="/projects"
							className={({ isActive }) =>
								`transition ${
									isActive
										? "primary-text-color font-semibold"
									: "secondary-text-color hover:primary-text-color"
								}`
							}>
							Projects
						</NavLink>
						<NavLink
							to="/labs"
							className={({ isActive }) =>
								`transition ${
									isActive
										? "primary-text-color font-semibold"
									: "secondary-text-color hover:primary-text-color"
								}`
							}>
							HTB Write-Ups
						</NavLink>
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
			<footer className="bg-card border-t card-border p-4 text-center text-sm muted-text-color">
				© {new Date().getFullYear()} Will Ward
			</footer>
		</div>
	);
}
