import { MessageRow } from "./MessageRow";
import type { Message } from "@ui/shared-types";
import styles from "./MailboxView.module.css";

interface Props {
  messages: Message[];
}

export function MessageList({ messages }: Props) {
  return (
    <ul className={styles.list}>
      {messages.map((m) => (
        <MessageRow key={m.id} message={m} />
      ))}
    </ul>
  );
}
