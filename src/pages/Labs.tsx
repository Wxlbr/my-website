import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fm from "front-matter";
import LabCard from "../components/LabCard";
import "../index.css";

type LabMeta = {
	slug: string;
	title: string;
	summary: string;
	tags: string[];
	difficulty?: string;
	os?: string;
};

export default function Labs() {
	const [labs, setLabs] = useState<LabMeta[]>([]);

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
							difficulty: attrs.difficulty,
							os: attrs.os,
						};
					})
				);
				setLabs(results);
			} catch (err) {
				console.error("Error loading labs:", err);
			}
		})();
	}, []);

	return (
		<div className="max-w-6xl mx-auto px-6 py-12">
			<h1 className="text-3xl font-bold primary-text-color mb-4">
				HTB Labs
			</h1>
			<p className="secondary-text-color mb-8">
				Write-ups for various Hack The Box labs that I have completed.
				This does not represent an exhaustive list of all the labs I
				have done.
			</p>

			{labs.length === 0 && (
				<p className="muted-text-color">
					No labs found. Check index.json and paths.
				</p>
			)}

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{labs.map((lab) => (
					<Link
						key={lab.slug}
						to={`/labs/${lab.slug}`}
						className="block">
						<LabCard {...lab} />
					</Link>
				))}
			</div>
		</div>
	);
}
