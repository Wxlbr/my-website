import "../index.css";
import { projects } from "../data/projectsData";

export default function Projects() {
	return (
		<div className="max-w-6xl mx-auto px-6 py-12">
			<h1 className="text-3xl font-bold primary-text-color mb-6">
				Projects
			</h1>
			<p className="secondary-text-color mb-10">
				A selection of my open-source projects, tools, and experiments.
			</p>

			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{projects.map((project) => (
					<div
						key={project.name}
						className="card card-hover p-6 shadow-lg">
					<h3 className="card-header">
							{project.name}
						</h3>
						<p className="mt-2 secondary-text-color text-sm">
							{project.description}
						</p>
						<div className="flex flex-wrap gap-2 mt-4">
							{project.tags.map((tag) => (
								<span
									key={tag}
									className="tag hover:tag-hover">
									{tag}
								</span>
							))}
						</div>
						<a
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block mt-4 primary-text-color hover:secondary-text-color font-medium">
							View on GitHub →
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
