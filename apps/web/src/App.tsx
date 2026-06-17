import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Spinner } from "@ui/ui";

// Landing is loaded immediately (it's the homepage)
import LandingPage from "@/routes/LandingPage";

// Lazy-load the rest — aggressive code splitting per struktur.md section 12
const AuthLayout = lazy(() => import("@/routes/AuthLayout"));
const MailboxRoute = lazy(() => import("@/routes/MailboxRoute"));
const MessageRoute = lazy(() => import("@/routes/MessageRoute"));
const EncryptedRoute = lazy(() => import("@/routes/EncryptedRoute"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app/*"
        element={
          <Suspense fallback={<Spinner fullscreen />}>
            <Routes>
              <Route path="auth/*" element={<AuthLayout />} />
              <Route path="mailbox/:mailbox" element={<MailboxRoute />} />
              <Route path="mailbox/:mailbox/message/:id" element={<MessageRoute />} />
              <Route path="encrypted/:key" element={<EncryptedRoute />} />
              <Route index element={<AuthLayout />} />
            </Routes>
          </Suspense>
        }
      />
    </Routes>
  );
}
