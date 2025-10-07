import { useState, useMemo } from "react";
import { Copy } from "lucide-react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/github-dark.css";
import "../index.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);

export type CodeBlockProps = {
	code: string;
	language?: string;
	title?: string;
};

export default function CodeBlock({ code, language = "", title }: CodeBlockProps) {
	const [wrap, setWrap] = useState(true);

	const highlightedLines = useMemo(() => {
		const highlighted =
			language && hljs.getLanguage(language)
				? hljs.highlight(code, { language }).value
				: hljs.highlightAuto(code).value;
		return highlighted.split(/\n/);
	}, [code, language]);

	return (
		<div className="max-w-4xl mx-auto my-6">
			{title && <div className="mb-2 text-sm primary-text-color font-medium">{title}</div>}
			<div className="rounded-lg overflow-hidden shadow-lg border card-border bg-card">
				{/* Language header and controls */}
				<div className="flex items-center justify-between px-4 pt-3 pb-1">
					<div>
						{language && (
							<span className="text-xs muted-text-color font-mono bg-card-dark px-2 py-0.5 rounded">
								{language}
							</span>
						)}
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setWrap((w) => !w)}
							className="transition muted-text-color hover:primary-text-color opacity-70 hover:opacity-100 text-xs border card-border rounded px-2 py-0.5"
							title={wrap ? "Disable line wrap" : "Enable line wrap"}
							aria-label="Toggle line wrap"
						>
							{wrap ? "Wrap: On" : "Wrap: Off"}
						</button>
						<button
							onClick={() => navigator.clipboard.writeText(code)}
							className="transition muted-text-color hover:primary-text-color opacity-70 hover:opacity-100 z-10"
							title="Copy code"
							aria-label="Copy code"
						>
							<Copy className="w-4 h-4" />
						</button>
					</div>
				</div>
				<pre
					className={`m-0 p-4 overflow-x-auto text-sm font-mono card-text bg-transparent ${wrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}
					style={{ wordBreak: wrap ? "break-word" : "normal" }}
				>
					{highlightedLines.map((line, i) => (
						<div key={i} className="flex">
							<span className="select-none text-right pr-4 muted-text-color opacity-60 min-w-[2.5em] block">
								{i + 1}
							</span>
							<span
								className="block flex-1"
								style={{ minWidth: 0 }}
								dangerouslySetInnerHTML={{ __html: line }}
							/>
						</div>
					))}
				</pre>
			</div>
		</div>
	);
}
