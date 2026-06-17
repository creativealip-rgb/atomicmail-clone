import { Link } from "react-router-dom";
import { Avatar } from "@ui/ui";
import type { Message } from "@ui/shared-types";
import styles from "./MailboxView.module.css";

interface Props {
  message: Message;
}

export function MessageRow({ message }: Props) {
  const date = new Date(message.receivedAt);
  const dateStr = date.toLocaleString();

  return (
    <li className={styles.row}>
      <Link to={`./message/${message.id}`} className={styles.rowLink}>
        <span className={styles.checkbox} aria-hidden>
          <input type="checkbox" />
        </span>
        <Avatar name={message.from} size={40} />
        <div className={styles.rowContent}>
          <div className={styles.rowTop}>
            <span className={styles.sender}>{message.fromName ?? message.from}</span>
            <span className={styles.time}>{dateStr}</span>
          </div>
          <div className={styles.subject}>{message.subject ?? "(no subject)"}</div>
          <div className={styles.preview}>{message.preview}</div>
        </div>
      </Link>
    </li>
  );
}
