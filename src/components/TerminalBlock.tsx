import { useState } from "react";
import { Copy, ChevronDown } from "lucide-react";
import "../index.css";

export type TerminalBlockEntry = {
	command: string;
	output?: string;
	user?: string;
	machine?: string;
	path?: string;
};

export type TerminalBlockProps = {
	title?: string;
	entries: TerminalBlockEntry[];
	collapsed?: boolean;
};

export default function TerminalBlock({
	title,
	entries,
	collapsed = false,
}: TerminalBlockProps) {
	const [open, setOpen] = useState(!collapsed);
	const copyText = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	return (
		<div className="max-w-4xl mx-auto my-6">
			{title && (
				<div className="mb-2 text-sm primary-text-color font-medium">
					{title}
				</div>
			)}
			<div className="rounded-lg overflow-hidden shadow-lg border card-border bg-card">
				{/* Toolbar */}
				<div className="flex items-center justify-between px-3 py-2 border-b card-border">
								<div className="flex items-center gap-2">
									<span className="w-3 h-3 rounded-full bg-[#ef4444] shadow" />
									<span className="w-3 h-3 rounded-full bg-[#facc15] shadow" />
									<span className="w-3 h-3 rounded-full primary-text-color shadow" />
									<span className="ml-3 text-xs muted-text-color">
										Terminal
									</span>
								</div>
					<button
						onClick={() => setOpen(!open)}
						aria-expanded={open}
						className="transition-transform muted-text-color hover:primary-text-color"
						title={open ? "Collapse output" : "Expand output"}>
						<ChevronDown
							className={`w-4 h-4 transform transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
						/>
					</button>
				</div>
				{/* Commands and Outputs */}
				<div className="group px-4 py-3 bg-card-dark font-mono text-sm card-text">
					{entries.map((entry, idx) => (
						<div key={idx} className="mb-2">
							<div className="flex items-start gap-2">
								<span className="primary-text-color select-none">
									{entry.user || "wxlbr"}@
									{entry.machine || "htb-lab"}:
									{entry.path || "~/htb"}$
								</span>
															<pre className="m-0 flex-1 overflow-x-auto inline-block align-middle">
																<code className="whitespace-pre-wrap break-words secondary-text-color font-semibold">
																	{entry.command}
																</code>
															</pre>
								<button
									onClick={() => copyText(entry.command)}
									className="ml-2 transition muted-text-color hover:primary-text-color opacity-70 hover:opacity-100"
									title="Copy command">
									<Copy className="w-4 h-4" />
								</button>
							</div>
							{open && entry.output && (
								<div className="relative mt-1">
									<button
										onClick={() =>
										copyText(entry.output || "")
									}
									className="absolute top-0 right-0 transition muted-text-color hover:primary-text-color opacity-70 hover:opacity-100 text-xs"
									title="Copy output">
									<Copy className="w-4 h-4 inline-block" />
								</button>
								<div className="whitespace-pre-wrap break-words secondary-text-color font-mono text-sm pr-8">
									{entry.output}
								</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
