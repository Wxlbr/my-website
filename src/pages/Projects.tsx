import { useState, useMemo } from "react";
import "../index.css";
import { projects } from "../data/projectsData";

export default function Projects() {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTag, setActiveTag] = useState<string | null>(null);

	// Extract all unique tags
	const allTags = useMemo<string[]>(() => {
		const tagSet = new Set<string>();
		projects.forEach((p) => p.tags.forEach((t: string) => tagSet.add(t)));
		return Array.from(tagSet).sort();
	}, []);

	// Filter projects by search and tag
	const filteredProjects = projects.filter((project) => {
		const matchesSearch =
			project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			project.description
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			project.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesTag = activeTag ? project.tags.includes(activeTag) : true;

		return matchesSearch && matchesTag;
	});

	return (
		<div className="max-w-6xl mx-auto px-6 py-12">
			{/* Header */}
			<h1 className="text-3xl font-bold primary-text-color mb-4 flex items-center gap-2">
				&gt;_ Projects
			</h1>
			<p className="muted-text-color mb-8">
				A selection of my open-source projects, tools, and experiments.
			</p>

			{/* Search and Filters */}
			<div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-[4.125rem] bg-main/90 backdrop-blur-md z-20 border-b card-border pb-4 pt-2">
				{/* Search bar */}
				<input
					type="text"
					placeholder="Search projects..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full sm:w-1/2 px-4 py-2 bg-main/60 border card-border rounded-md focus:outline-none focus:card-border-accent card-text placeholder-gray-500 transition"
				/>

				{/* Tags */}
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => setActiveTag(null)}
						className={`px-3 py-1.5 text-sm rounded-full border transition ${
							!activeTag
								? "card-border-accent bg-accent text-black font-semibold"
								: "card-border text-gray-400 hover:card-border-accent hover:primary-text-color"
						}`}>
						All
					</button>
					{allTags.map((tag) => (
						<button
							key={tag}
							onClick={() =>
								setActiveTag(tag === activeTag ? null : tag)
							}
							className={`px-3 py-1.5 text-sm rounded-full border transition ${
								activeTag === tag
									? "card-border-accent bg-accent text-black font-semibold"
									: "card-border text-gray-400 hover:card-border-accent hover:primary-text-color"
							}`}>
							{tag}
						</button>
					))}
				</div>
			</div>

			{/* Project Cards (Full-width Rows) */}
			<div className="flex flex-col gap-4">
				{filteredProjects.length > 0 ? (
					filteredProjects.map((project) => (
						<div
							key={project.name}
							className="w-full bg-card border card-border hover:card-border-accent transition rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-md hover:shadow-cyan-400/10 transform hover:-translate-y-1">
							{/* Left Side: Info */}
							<div className="flex-1 pr-4">
								<h3 className="text-xl font-bold primary-text-color mb-2">
									{project.name}
								</h3>
								<p className="muted-text-color text-sm mb-4">
									{project.description}
								</p>
								<div className="flex flex-wrap gap-2">
									{project.tags.map((tag) => (
										<span
											key={tag}
											className="px-3 py-1 text-xs rounded-full border card-border secondary-text-color">
											{tag}
										</span>
									))}
								</div>
							</div>

							{/* Right Side: Action */}
							<div className="mt-4 sm:mt-0 flex-shrink-0">
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
									className="px-5 py-2 rounded-lg border card-border-accent primary-text-color hover:bg-accent hover:card-text transition text-sm font-medium">
									View on GitHub →
								</a>
							</div>
						</div>
					))
				) : (
					<p className="text-gray-500 text-center w-full">
						No projects found matching your search.
					</p>
				)}
			</div>
		</div>
	);
}
