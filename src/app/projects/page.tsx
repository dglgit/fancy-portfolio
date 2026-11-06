import Link from "next/link";

export default function Projects() {
  return (
    <main>
      <p><Link href="/">← Home</Link></p>
      <h1>Projects</h1>

      <h2><Link href="/projects/capable">Work at Capable</Link></h2>
      <p>One-sentence summary goes here.</p>

      <h2><Link href="/projects/baker-lab">Baker Lab research</Link></h2>
      <p>One-sentence summary goes here.</p>

      <h2><Link href="/projects/igem-kinetics">High school iGEM and kinetics research</Link></h2>
      <p>One-sentence summary goes here.</p>
    </main>
  );
}
