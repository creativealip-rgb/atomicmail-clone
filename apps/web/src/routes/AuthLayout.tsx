import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Spinner } from "@ui/ui";

const SignInPage = lazy(() => import("@/routes/auth/SignInPage"));
const SignUpPage = lazy(() => import("@/routes/auth/SignUpPage"));
const WelcomePage = lazy(() => import("@/routes/auth/WelcomePage"));
const RecoveryPage = lazy(() => import("@/routes/auth/RecoveryPage"));

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <Suspense fallback={<Spinner fullscreen />}>
        <Routes>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="recovery" element={<RecoveryPage />} />
          <Route index element={<Navigate to="sign-in" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
