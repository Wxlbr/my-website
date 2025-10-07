export type LabCardProps = {
	slug: string;
	title: string;
	summary: string;
	tags: string[];
	difficulty?: string;
	os?: string;
};
import "../index.css";

export default function LabCard(props: LabCardProps) {
	const { slug, title, summary, tags, difficulty, os } = props;
	return (
		<div className="card card-hover p-5 relative">
			<div className="flex items-start relative">
				<h3 className="card-header flex-1 break-words leading-tight">
					{title}
				</h3>
				<img
					src={`/labs/${slug}/logo.png`}
					alt={title + " logo"}
					className="w-16 h-16 rounded-full object-cover border-4 card-border absolute -top-8 -right-8 bg-card-dark shadow-lg z-10"
					style={{ background: "var(--color-bg-card-dark)" }}
					onError={(e) => {
						(e.target as HTMLImageElement).style.display = "none";
					}}
				/>
			</div>
			{summary && <p className="mt-2 secondary-text-color text-sm">{summary}</p>}
			{tags?.length > 0 && (
				<div className="mt-4 flex gap-2 flex-wrap">
					{tags.map((t) => (
						<span
							key={t}
							className="tag">
							{t}
						</span>
					))}
				</div>
			)}
			{(difficulty || os) && (
				<div className="mt-3 text-xs muted-text-color">
					{[difficulty, os].filter(Boolean).join(" • ")}
				</div>
			)}
		</div>
	);
}
