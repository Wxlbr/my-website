import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import fm from "front-matter";
import "../index.css";

type LabMeta = {
	slug: string;
	title: string;
	summary: string;
	tags: string[];
	difficulty?: string;
	os?: string;
	logo?: string; // optional custom logo image path
};

export default function Labs() {
	const [labs, setLabs] = useState<LabMeta[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState<string | null>(null);

	// Fetch lab metadata
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/labs/index.json");
				const slugs: string[] = await res.json();
				const results = await Promise.all(
					slugs.map(async (slug) => {
						const text = await fetch(
							`/labs/${slug}/${slug}.md`
						).then((r) => r.text());
						const attrs = fm(text).attributes as Record<
							string,
							any
						>;
						return {
							slug,
							title: attrs.title || slug,
							summary: attrs.summary || "",
							tags: attrs.tags || [],
							difficulty: attrs.difficulty || "Unknown",
							os: attrs.os || "Unknown",
							logo: attrs.logo || `/labs/${slug}/logo.png`, // default path
						};
					})
				);
				setLabs(results);
			} catch (err) {
				console.error("Error loading labs:", err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// Collect unique filters (tags + difficulty + OS)
	const allFilters = useMemo(() => {
		const f = new Set<string>();
		labs.forEach((lab) => {
			lab.tags.forEach((t) => f.add(t));
			if (lab.difficulty) f.add(lab.difficulty);
			if (lab.os) f.add(lab.os);
		});
		return Array.from(f).sort();
	}, [labs]);

	// Filtered labs
	const filteredLabs = labs.filter((lab) => {
		const matchesSearch =
			lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lab.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lab.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			) ||
			(lab.difficulty &&
				lab.difficulty
					.toLowerCase()
					.includes(searchTerm.toLowerCase())) ||
			(lab.os && lab.os.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesFilter =
			activeFilter == null ||
			lab.tags.includes(activeFilter) ||
			lab.difficulty === activeFilter ||
			lab.os === activeFilter;

		return matchesSearch && matchesFilter;
	});

	return (
		<div className="max-w-6xl mx-auto px-6 py-12">
			{/* Header */}
			<h1 className="text-3xl font-bold primary-text-color mb-4 flex items-center gap-2">
				&gt;_ HTB Labs
			</h1>
			<p className="muted-text-color mb-8">
				Write-ups for various Hack The Box labs I’ve completed. This
				list focuses on the most interesting and technically challenging
				ones.
			</p>

			{/* Search and Filters */}
			<div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-[4.125rem] bg-main/90 backdrop-blur-md z-20 border-b card-border pb-4 pt-2">
				<input
					type="text"
					placeholder="Search labs..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full sm:w-1/2 px-4 py-2 bg-main/60 border card-border rounded-md focus:outline-none focus:card-border-accent card-text placeholder-gray-500 transition"
				/>

				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => setActiveFilter(null)}
						className={`px-3 py-1.5 text-sm rounded-full border transition ${
							!activeFilter
								? "card-border-accent bg-accent text-black font-semibold"
								: "card-border text-gray-400 hover:card-border-accent hover:primary-text-color"
						}`}>
						All
					</button>
					{allFilters.map((f) => (
						<button
							key={f}
							onClick={() =>
								setActiveFilter(f === activeFilter ? null : f)
							}
							className={`px-3 py-1.5 text-sm rounded-full border transition ${
								activeFilter === f
									? "card-border-accent bg-accent text-black font-semibold"
									: "card-border text-gray-400 hover:card-border-accent hover:primary-text-color"
							}`}>
							{f}
						</button>
					))}
				</div>
			</div>

			{/* Loading state */}
			{loading && (
				<div className="text-center muted-text-color py-8 animate-pulse">
					Loading labs...
				</div>
			)}

			{/* Empty state */}
			{!loading && filteredLabs.length === 0 && (
				<p className="text-gray-500 text-center w-full">
					No labs found matching your filters.
				</p>
			)}

			{/* Grid Cards */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredLabs.map((lab) => (
					<Link
						key={lab.slug}
						to={`/labs/${lab.slug}`}
						className="group relative bg-card border card-border hover:card-border-accent transition rounded-lg p-6 shadow-md hover:shadow-cyan-400/10 transform hover:-translate-y-1">
						{/* Logo that overlaps card */}
						{lab.logo && (
							<img
								src={lab.logo}
								alt={`${lab.title} logo`}
								className="absolute -top-6 left-6 w-12 h-12 object-contain rounded-full border card-border bg-main p-1 group-hover:card-border-accent transition"
							/>
						)}

						{/* Title */}
						<h3 className="text-xl font-bold primary-text-color mt-6 mb-2">
							{lab.title}
						</h3>

						{/* Summary */}
						<p className="muted-text-color text-sm mb-4 line-clamp-3">
							{lab.summary || "No summary available."}
						</p>

						{/* Tags */}
						<div className="flex flex-wrap gap-2">
							{lab.tags.map((tag) => (
								<span
									key={tag}
									className="px-3 py-1 text-xs rounded-full border card-border secondary-text-color">
									{tag}
								</span>
							))}
							{lab.difficulty && (
								<span className="px-3 py-1 text-xs rounded-full border card-border secondary-text-color">
									{lab.difficulty}
								</span>
							)}
							{lab.os && (
								<span className="px-3 py-1 text-xs rounded-full border card-border secondary-text-color">
									{lab.os}
								</span>
							)}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
