import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import TerminalBlock from "../components/TerminalBlock";
import CodeBlock from "../components/CodeBlock";
import "../index.css";

const TERMINAL_LANGS = new Set([
	// Common terminal languages, likely be extended in the future
	"cmd",
	"bash",
	"sh",
	"zsh",
	"shell",
	"ps",
	"powershell",
]);
const CODE_LANGS = new Set([
	// Common programming languages, likely be extended in the future
	"python",
	"js",
	"javascript",
	"typescript",
	"java",
	"c",
	"cpp",
	"go",
	"rust",
	"php",
	"html",
	"css",
	"json",
	"yaml",
	"yml",
	"sql",
]);

function convertObsidianEmbeds(md: string, slug: string): string {
	// Convert ![[filename.png]] or ![[folder/filename.png]] to /labs/slug/folder/filename.png
	// so that images are correctly loaded from the lab's folder
	return md.replace(
		/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/gi,
		(_m: any, filename: string) => {
			const safe = filename
				.trim()
				.split("/")
				.map(encodeURIComponent)
				.join("/");
			return `![${filename}](/labs/${slug}/${safe})`;
		}
	);
}

function parseMarkdownWithTerminals(md: string): any[] {
	// Parses markdown content and extracts terminal blocks and code blocks
	// AAssigns 'md' type to regular markdown text, 'term' to terminal blocks, and 'code' to code blocks
	const pieces = [];
	const fenceRe = /```(?:([\w-]+))?\n([\s\S]*?)```/g;
	let m,
		lastIndex = 0;
	const promptRe = /^\(([^@]+)@([^\)]+)\)-\[([^\]]+)\]\$\s*(.*)$/;
	while ((m = fenceRe.exec(md)) !== null) {
		const lang = m[1] ? m[1].toLowerCase() : null;
		const code = m[2];
		if (m.index > lastIndex)
			pieces.push({ type: "md", text: md.slice(lastIndex, m.index) });
		if (lang && TERMINAL_LANGS.has(lang)) {
			const lines = code.split(/\r?\n/);
			let i = 0,
				entries = [];
			while (i < lines.length) {
				const promptMatch = lines[i].match(promptRe);
				if (promptMatch) {
					const [_, user, machine, path, cmd] = promptMatch;
					let outputLines = [];
					i++;
					while (i < lines.length && !promptRe.test(lines[i]))
						outputLines.push(lines[i++]);
					entries.push({
						command: cmd.trim(),
						output: outputLines.length
							? outputLines.join("\n").trim()
							: undefined,
						user,
						machine,
						path,
					});
				} else {
					let codeBlock = [];
					while (i < lines.length && !promptRe.test(lines[i]))
						codeBlock.push(lines[i++]);
					if (codeBlock.join("").trim())
						entries.push({ command: codeBlock.join("\n").trim() });
				}
			}
			if (entries.length) pieces.push({ type: "term", entries });
		} else if (lang && CODE_LANGS.has(lang)) {
			pieces.push({ type: "code", lang, code: code.trim() });
		} else {
			pieces.push({ type: "md", text: code });
		}
		lastIndex = fenceRe.lastIndex;
	}
	if (lastIndex < md.length)
		pieces.push({ type: "md", text: md.slice(lastIndex) });
	return pieces;
}

function formatDateField(d: unknown): string {
	// Formats date field
	if (!d) return "—";
	if (d instanceof Date) return d.toLocaleDateString("en-GB");
	if (typeof d === "string") {
		const parsed = new Date(d);
		if (!Number.isNaN(parsed.getTime()))
			return parsed.toLocaleDateString("en-GB");
		return d;
	}
	return String(d);
}

function MarkdownBlock({ text }: { text: string }) {
	// Renders markdown text with palette utility classes
	return (
		<ReactMarkdown
			rehypePlugins={[rehypeRaw, rehypeHighlight]}
			components={{
				h1: (props) => (
					<h1
						className="text-3xl font-bold primary-text-color mt-10 mb-4 border-b card-border pb-2"
						{...props}
					/>
				),
				h2: (props) => (
					<h2
						className="text-2xl font-semibold primary-text-color mt-8 mb-3"
						{...props}
					/>
				),
				h3: (props) => (
					<h3
						className="text-xl font-semibold secondary-text-color mt-6 mb-2"
						{...props}
					/>
				),
				h4: (props) => (
					<h4
						className="text-lg font-semibold muted-text-color mt-4 mb-2"
						{...props}
					/>
				),
				p: ({ children, ...props }) =>
					Array.isArray(children) &&
					children.length === 1 &&
					children[0]?.type === "img" ? (
						<>{children}</>
					) : (
						<p
							className="card-text leading-relaxed my-3"
							{...props}>
							{children}
						</p>
					),
				li: (props) => <li className="my-1" {...props} />,
				strong: (props) => (
					<strong
						className="primary-text-color font-semibold"
						{...props}
					/>
				),
				img: ({ src, alt }) => (
					<img
						src={src}
						alt={alt || ""}
						className="my-6 rounded-lg border card-border shadow-md mx-auto max-h-[500px] object-contain block"
						loading="lazy"
					/>
				),
				hr: () => <hr className="my-8 card-border" />,
			}}>
			{text}
		</ReactMarkdown>
	);
}

// ---------------------------
// Main Component
// ---------------------------

export default function LabDetail() {
	const { id } = useParams<{ id?: string }>();
	const [content, setContent] = useState<string>("");
	const [meta, setMeta] = useState<Record<string, any>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Fetch and parse Markdown from the lab's markdown file
	useEffect(() => {
		async function fetchLab() {
			if (!id) return;
			setLoading(true);
			try {
				const folderName = id; // For now the id will always match the folder name, check for mapping in the future
				const path = `/labs/${folderName}/${folderName}.md`;
				const res = await fetch(path);
				const text = await res.text();
				if (!res.ok || text.startsWith("<!DOCTYPE"))
					throw new Error("Invalid response");
				const parsed = fm<any>(text);
				console.log(
					"Using folderName for images and markdown:",
					folderName
				); // Debug log
				const body = convertObsidianEmbeds(
					parsed.body || "",
					folderName
				);
				setMeta(parsed.attributes || {});
				setContent(body);
			} catch (err: any) {
				console.error("Failed to load lab", err);
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		}
		fetchLab();
	}, [id]);

	const pieces = content ? parseMarkdownWithTerminals(content) : [];
	const prettyDate = formatDateField(meta.date);
	const tags: string[] = Array.isArray(meta.tags)
		? meta.tags
		: typeof meta.tags === "string"
		? meta.tags.split(",").map((t: string) => t.trim())
		: [];

	if (loading)
		return (
			<div className="text-gray-400 text-center mt-10">
				Loading lab...
			</div>
		);
	if (error)
		return (
			<div className="max-w-4xl mx-auto bg-red-900/30 border border-red-800 text-red-300 p-6 mt-10 rounded-lg">
				<strong>Error:</strong> {error}
			</div>
		);

	return (
		<div className="relative min-h-screen bg-main card-text">
			{/* Main content */}
			<div className="max-w-4xl mx-auto py-10 px-2 sm:px-6">
				{/* Back to Labs */}
				<div className="mb-6">
					<Link
						to="/labs"
						className="inline-block primary-text-color hover:secondary-text-color text-sm font-semibold transition">
						← Back to Labs
					</Link>
				</div>
				{/* Header */}
				<header className="mb-12 border-b card-border pb-6 flex flex-col items-center text-center relative">
					<img
						src={`/labs/${id}/logo.png`}
						alt={(meta.title || id) + " logo"}
						className="w-24 h-24 rounded-full object-cover border-4 card-border bg-card-dark shadow-2xl mb-4 drop-shadow-lg"
						style={{ background: "var(--color-bg-card-dark)" }}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display =
								"none";
						}}
					/>
					<h1 className="text-4xl font-bold primary-text-color mb-2 break-words leading-tight">
						{meta.title || id}
					</h1>
					<p className="text-base muted-text-color mb-2">
						Difficulty: {meta.difficulty || "—"} • OS:{" "}
						{meta.os || "—"} • Date: {prettyDate}
					</p>
					{meta.summary && (
						<p className="text-lg card-text italic font-medium mt-2 mb-2 max-w-2xl mx-auto">
							{meta.summary}
						</p>
					)}
					{tags.length > 0 && (
						<div className="mt-4 flex gap-2 flex-wrap justify-center">
							{tags.map((t) => (
								<span
									key={t}
									className="tag cursor-pointer hover:tag-hover">
									{t}
								</span>
							))}
						</div>
					)}
					{/* Divider */}
					<div className="w-full flex justify-center mt-8">
						<hr className="w-2/3 border-t-2 card-border shadow" />
					</div>
				</header>
				{/* Markdown body */}
				<article
					className="prose prose-invert max-w-5xl bg-card border-2 card-border shadow-2xl rounded-2xl px-6 sm:px-12 py-10 mx-auto mb-10 transition-all duration-200"
					style={{ lineHeight: 1.85 }}>
					{pieces.map((p, i) => {
						if (p.type === "md")
							return <MarkdownBlock key={i} text={p.text} />;
						if (p.type === "term")
							return (
								<div key={i} className="my-8">
									<TerminalBlock entries={p.entries ?? []} />
								</div>
							);
						if (p.type === "code")
							return (
								<CodeBlock
									key={i}
									code={p.code ?? ""}
									language={p.lang}
								/>
							);
						return null;
					})}
				</article>
			</div>
		</div>
	);
}
