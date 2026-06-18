import { Link } from "react-router-dom";
import { Button } from "@ui/ui";
import styles from "./CallToAction.module.css";

export function CallToAction() {
  return (
    <section className={styles.cta}>
      <h2>Stop losing receipts.</h2>
      <p>
        Set up a Chainmail alias in 30 seconds. Forward your first
        Coinbase or Binance email and see it parsed, encrypted, and
        searchable. No credit card.
      </p>
      <div className={styles.buttons}>
        <Link to="/app/auth/sign-in">
          <Button size="lg">Get your free alias →</Button>
        </Link>
        <a
          href="https://github.com/creativealip-rgb/chainmail"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="lg" variant="secondary">Star on GitHub</Button>
        </a>
      </div>
      <p className={styles.fineprint}>
        Early access — feedback shapes the roadmap. See{" "}
        <a href="/PLAN.md" target="_blank" rel="noreferrer">PLAN.md</a> for milestones.
      </p>
    </section>
  );
}
