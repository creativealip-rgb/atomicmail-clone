import { lazy, Suspense, useEffect, type ReactElement } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "@ui/ui";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { open as openComposer } from "@/store/slices/composerSlice";
import { fetchMe } from "@/store/slices/authSlice";
import { dismiss as dismissToast } from "@/store/slices/notificationsSlice";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { PrivacyCenter } from "@/components/privacy/PrivacyCenter";

// Landing is loaded immediately (it's the homepage)
import LandingPage from "@/routes/LandingPage";

// Lazy-load the rest — aggressive code splitting per struktur.md section 12
const AuthLayout = lazy(() => import("@/routes/AuthLayout"));
const MailboxRoute = lazy(() => import("@/routes/MailboxRoute"));
const MessageRoute = lazy(() => import("@/routes/MessageRoute"));
const EncryptedRoute = lazy(() => import("@/routes/EncryptedRoute"));
const RecoverySetupPage = lazy(() => import("@/routes/auth/RecoverySetupPage"));
const LedgerRoute = lazy(() => import("@/routes/LedgerRoute"));
const NotFound = lazy(() => import("@/routes/NotFound"));

const PAGE_TITLES: Record<string, string> = {
  "/": "Chainmail — Encrypted email for the on-chain generation",
  "/app": "Sign in · Chainmail",
  "/app/auth/sign-in": "Sign in · Chainmail",
  "/app/auth/sign-up": "Create account · Chainmail",
  "/app/auth/recovery": "Recover account · Chainmail",
  "/app/auth/welcome": "Welcome · Chainmail",
  "/app/setup-recovery": "Save recovery code · Chainmail",
  "/app/ledger": "Tax ledger · Chainmail",
};

function deriveTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/app\/mailbox\/[^/]+\/message\/[^/]+/.test(pathname)) return "Message · Chainmail";
  if (/^\/app\/mailbox\//.test(pathname)) {
    const folder = pathname.split("/")[3] ?? "Inbox";
    return `${folder.charAt(0).toUpperCase()}${folder.slice(1)} · Chainmail`;
  }
  if (/^\/app\/label\//.test(pathname)) return "Label · Chainmail";
  if (/^\/app\/encrypted\//.test(pathname)) return "Encrypted · Chainmail";
  if (pathname.startsWith("/app")) return "Chainmail";
  return "Page not found · Chainmail";
}

function PageTitle() {
  const location = useLocation();
  useEffect(() => {
    document.title = deriveTitle(location.pathname);
  }, [location.pathname]);
  return null;
}

function GlobalShortcuts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const composerOpen = useAppSelector((s) => s.composer.open);
  const activeModal = useAppSelector((s) => s.ui.activeModal);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (activeModal) return;

      if (e.key === "Escape" && composerOpen) {
        dispatch({ type: "composer/close" });
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (key === "c" && isAuth) {
        e.preventDefault();
        dispatch(openComposer());
      } else if (key === "/") {
        e.preventDefault();
        const search = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[aria-label*="earch" i], input[placeholder*="earch" i]',
        );
        search?.focus();
      } else if (key === "g" && isAuth) {
        sessionStorage.setItem("__awaitG", "1");
        setTimeout(() => sessionStorage.removeItem("__awaitG"), 1200);
      } else if (sessionStorage.getItem("__awaitG") === "1") {
        sessionStorage.removeItem("__awaitG");
        if (key === "i" && isAuth) navigate("/app/mailbox/inbox");
        else if (key === "s" && isAuth) navigate("/app/mailbox/sent");
        else if (key === "d" && isAuth) navigate("/app/mailbox/drafts");
        else if (key === "t" && isAuth) navigate("/app/mailbox/trash");
        else if (key === "l" && isAuth) navigate("/app/ledger");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [dispatch, navigate, isAuth, composerOpen, activeModal]);

  return null;
}

function ProfileModalGate() {
  const activeModal = useAppSelector((s) => s.ui.activeModal);
  if (activeModal !== "profile") return null;
  return <ProfileModal />;
}

function AuthHydrator() {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  useEffect(() => {
    if (isAuth && !user) dispatch(fetchMe());
  }, [dispatch, isAuth, user]);
  return null;
}

function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { isAuthenticated, status, user } = useAppSelector((s) => s.auth);
  const demoMode = useAppSelector((s) => s.auth.demoMode) || import.meta.env.VITE_DEMO === "true";

  if (demoMode) return children;

  if (status === "loading" || (isAuthenticated && !user)) {
    return <Spinner fullscreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/auth/sign-in" replace state={{ from: location }} />;
  }

  return children;
}

export function App() {
  return (
    <ErrorBoundary>
      <PageTitle />
      <AuthHydrator />
      <GlobalShortcuts />
      <ToastContainer />
      <ProfileModalGate />
      <PrivacyCenter />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app/*"
          element={
            <Suspense fallback={<Spinner fullscreen />}>
              <Routes>
                <Route path="auth/*" element={<AuthLayout />} />
                <Route path="mailbox/:mailbox" element={<RequireAuth><MailboxRoute /></RequireAuth>} />
                <Route path="label/:labelId" element={<RequireAuth><MailboxRoute labelView /></RequireAuth>} />
                <Route path="mailbox/:mailbox/message/:id" element={<RequireAuth><MessageRoute /></RequireAuth>} />
                <Route path="ledger" element={<RequireAuth><LedgerRoute /></RequireAuth>} />
                <Route path="encrypted/:key" element={<EncryptedRoute />} />
                <Route path="setup-recovery" element={<RecoverySetupPage />} />
                <Route index element={<AuthLayout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}