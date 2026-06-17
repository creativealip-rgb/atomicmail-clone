import { Sidebar } from "@/components/sidebar/Sidebar";
import { TopBar } from "@/components/topbar/TopBar";
import { MailboxView } from "@/components/mailbox/MailboxView";
import { useParams } from "react-router-dom";

export default function MailboxRoute() {
  const { mailbox } = useParams<{ mailbox: string }>();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar />
        <MailboxView mailboxId={mailbox ?? "inbox"} />
      </div>
    </div>
  );
}
