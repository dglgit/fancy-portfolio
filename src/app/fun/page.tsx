import Link from "next/link";
import MeltingName from "./MeltingName";
import Repressilator from "./Repressilator";

export default function Fun() {
  return (
    <main>
      <p><Link href="/">← Home</Link></p>
      <h1>Fun</h1>

      <h2>Melting name</h2>
      <p>My name spelled out in protein helices. Heat it to 500 K and watch it unfold, then cool it back down.</p>
      <MeltingName />

      <h2>Repressilator</h2>
      <p>
        Three genes in a ring, each repressing the next (LacI ⊣ TetR ⊣ cI ⊣ LacI). The top version is simulated molecule by
        molecule with Gillespie&apos;s algorithm, so noise lets one gene briefly get the upper hand. The bottom one runs the
        same rates as ordinary differential equations for contrast.
      </p>
      <Repressilator />
    </main>
  );
}
