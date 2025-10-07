import { FaGithub, FaLinkedin, FaBug, FaGraduationCap } from "react-icons/fa";
import { SiHackthebox } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="min-h-screen bg-main card-text font-inter">
			{/* hero/header */}
			<section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-bg-main to-bg-card">
				
				{/* To add a headshot image rather than W */}
				<div className="w-28 h-28 flex items-center justify-center rounded-full bg-card-dark border-4 card-border-accent shadow mb-6">
					<span className="text-5xl font-extrabold primary-text-color">
						W
					</span>
				</div>

				<h1 className="text-5xl sm:text-6xl font-extrabold primary-text-color mb-2">
					Will Ward
				</h1>
				<p className="text-lg sm:text-xl secondary-text-color font-medium">
					Penetration Tester · CS Student · Software Developer
				</p>
				<p className="muted-text-color mt-3 max-w-xl">
					Building tools and breaking systems to understand them
					better. Focused on{" "}
					<span className="primary-text-color font-semibold">
						offensive security, automation
					</span>{" "}
					and{" "}
					<span className="primary-text-color font-semibold">
						secure software
					</span>
					.
				</p>

				<div className="flex gap-4 mt-8">
					<a
						href="https://github.com/Wxlbr"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 bg-card border card-border-accent px-5 py-2.5 rounded-lg hover:bg-card-dark transition-all duration-200">
						<FaGithub className="text-xl primary-text-color" /> GitHub
					</a>
					<a
						href="https://www.linkedin.com/in/will-r-ward/"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 bg-card border card-border px-5 py-2.5 rounded-lg hover:bg-card-dark transition-all duration-200">
						<FaLinkedin className="text-xl" style={{ color: '#bfae9a' }} /> LinkedIn
					</a>
					<a
						href="https://app.hackthebox.com/profile/537135"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 bg-card border card-border px-5 py-2.5 rounded-lg hover:bg-card-dark transition-all duration-200">
						<SiHackthebox className="text-xl primary-text-color" /> HTB
					</a>
				</div>
			</section>

			{/* About me */}
			<section className="bg-card border-y card-border py-20 px-8">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl font-bold primary-text-color mb-4">
						About Me
					</h2>
					<p className="secondary-text-color leading-relaxed mb-4">
						<span className="font-semibold primary-text-color">
							Second-year Computer Science student
						</span>
						<span>
						{" "}at the University of Surrey, pursuing a placement year
						(2026). Passionate about vulnerability research, ethical
						hacking, and tool development in{" "}
						</span>
						<span className="primary-text-color">
							Java, Python, and React
						</span>
						.
					</p>
					<p className="muted-text-color">
						Completed{" "}
						<span className="primary-text-color font-semibold">
							CPTS
						</span>{" "}
						course (awaiting exam) with real-world experience across
						enumeration, exploitation, privilege escalation, and
						Active Directory compromise.
					</p>
				</div>
			</section>

			{/* Stats */}
			<section className="bg-card border-b card-border py-20 px-8">
				<div className="max-w-6xl mx-auto">
					<div className="relative">
						{/* Highlight behind stats cards */}
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
							<div className="w-3/4 h-3/4 rounded-3xl bg-accent opacity-40 blur-2xl" />
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center relative">
						<div className="card rounded-2xl py-8 hover:shadow transition flex flex-col items-center">
							<FaBug className="text-4xl mb-2 primary-text-color" />
							<h3 className="text-3xl font-bold mb-2">20+</h3>
							<p className="text-gray-400 text-sm mt-1">
								Machines Rooted
							</p>
						</div>
						<div className="card rounded-2xl py-8 hover:shadow transition flex flex-col items-center">
							<FaGraduationCap className="text-4xl mb-2 primary-text-color" />
							<h3 className="text-3xl font-bold mb-2">CPTS</h3>
							<p className="text-gray-400 text-sm mt-1">
								Course Complete (Exam Pending)
							</p>
						</div>
						<div className="card rounded-2xl py-8 hover:shadow transition flex flex-col items-center">
							<SiHackthebox className="text-4xl mb-2 primary-text-color" />
							<h3 className="text-xl font-bold mb-2">
								CPTS Modules
							</h3>
							<p className="muted-text-color text-sm mt-1">
								Enumeration{" "}
								<span className="mx-1">&middot;</span>{" "}
								Exploitation{" "}
								<span className="mx-1">&middot;</span> Privilege
								Escalation{" "}
								<span className="mx-1">&middot;</span> AD{" "}
								<span className="mx-1">&middot;</span> Reporting
							</p>
						</div>
					</div>
				</div>
					</div>
			</section>

			{/* labs */}
			<section className="bg-card border-y card-border py-20 px-8">
				<div className="max-w-5xl mx-auto text-center">
					<h2 className="text-3xl font-bold primary-text-color mb-6 flex items-center justify-center gap-2">
						<SiHackthebox className="primary-text-color" /> Hack The Box
						Write-ups
					</h2>
					<p className="secondary-text-color mb-8 max-w-3xl mx-auto leading-relaxed">
						Detailed analyses of Hack The Box machines following
						CPTS methodology — from initial enumeration to
						post-exploitation reporting. Each report is written for
						technical clarity and reproducibility.
					</p>
					<div className="relative inline-block">
						{/* Highlight behind View Labs button */}
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
							<div className="w-full h-full rounded-lg bg-accent opacity-40 blur-xl" />
						</div>
						<Link
							to="/labs"
							className="inline-block button-primary font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 relative">
							View Labs
						</Link>
					</div>
				</div>
			</section>

			{/* skills */}
			<section className="max-w-6xl mx-auto px-8 py-24">
				<h2 className="text-3xl font-bold text-center primary-text-color mb-10">
					Technical Stack
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{/* Pentest Tools skills */}
					<div className="card p-6 shadow mb-3">
						<h3 className="text-xl font-bold primary-text-color mb-3">
							Penetration Testing
						</h3>
						<div className="flex flex-wrap gap-2">
							{[
								"Nmap",
								"Burp Suite",
								"Metasploit",
								"Wireshark",
								"Hashcat",
								"BloodHound",
								"Responder",
								"Evil-WinRM",
								"Chisel",
							].map((tool) => (
								<span
									key={tool}
									className="px-3 py-1.5 text-sm rounded-full border card-border bg-card-dark card-text">
									{tool}
								</span>
							))}
						</div>
					</div>

					{/* Programming skills */}
					<div className="card p-6 shadow mb-3">
						<h3 className="text-xl font-bold primary-text-color mb-3">
							Programming
						</h3>
						<div className="flex flex-wrap gap-2">
							{[
								"Java",
								"Python",
								"C++",
								"Bash",
								"SQL",
								"PowerShell",
							].map((lang) => (
								<span
									key={lang}
									className="px-3 py-1.5 text-sm rounded-full border card-border bg-card-dark card-text">
									{lang}
								</span>
							))}
						</div>
					</div>

					{/* Web Development skills */}
					<div className="card p-6 shadow mb-3">
						<h3 className="text-xl font-bold primary-text-color mb-3">
							Web Development
						</h3>
						<div className="flex flex-wrap gap-2">
							{[
								"React",
								"Tailwind",
								"HTML5",
								"CSS3",
								"JavaScript",
								"Git",
							].map((tech) => (
								<span
									key={tech}
									className="px-3 py-1.5 text-sm rounded-full border card-border bg-card-dark card-text">
									{tech}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
