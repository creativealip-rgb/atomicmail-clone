import { Link } from "react-router-dom";
import { Button } from "@ui/ui";
import styles from "./CallToAction.module.css";

export function CallToAction() {
  return (
    <section className={styles.cta}>
      <h2>Self-host. Or just read the code.</h2>
      <p>
        The full architecture & design analysis is in <code>docs/struktur.md</code> and <code>docs/desain.md</code>.
        Boilerplate is ready to fork — install <code>@noble/curves</code> + <code>@noble/ed25519</code> for production crypto.
      </p>
      <div className={styles.buttons}>
        <Link to="/app/auth/sign-in">
          <Button size="lg">Try the app →</Button>
        </Link>
        <a
          href="https://github.com/creativealip-rgb/chainmail"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="lg" variant="secondary">GitHub repo</Button>
        </a>
      </div>
    </section>
  );
}
