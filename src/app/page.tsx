import Link from "next/link";
import GameOfLife from "./GameOfLife";

export default function Home() {
  return (
    <main>
      <GameOfLife />
      <h1>Douglas Lin</h1>
      <ul>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/fun">Fun</Link></li>
      </ul>
    </main>
  );
}
