import { useEffect } from "react";
import useSWR from "swr";
import { useAppDispatch } from "@/hooks/redux";
import { setMessages } from "@/store/slices/messagesSlice";
import { apiFetcher } from "@/services/api/client";
import { MessageList } from "./MessageList";
import { ActionToolbar } from "./ActionToolbar";
import type { Message } from "@ui/shared-types";
import styles from "./MailboxView.module.css";

interface Props {
  mailboxId: string;
}

export function MailboxView({ mailboxId }: Props) {
  const { data, error, isLoading } = useSWR<Message[]>(
    `/mailboxes/${mailboxId}/messages`,
    apiFetcher
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) dispatch(setMessages({ mailbox: mailboxId, messages: data }));
  }, [data, mailboxId, dispatch]);

  if (isLoading) return <div className={styles.empty}>Loading…</div>;
  if (error) return <div className={styles.empty}>Failed to load.</div>;
  if (!data?.length) return <div className={styles.empty}>No messages</div>;

  return (
    <div className={styles.view}>
      <ActionToolbar />
      <MessageList messages={data} />
    </div>
  );
}
