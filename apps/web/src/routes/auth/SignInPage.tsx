// Auth pages — skeletons. Full implementation per struktur.md section 6.
export default function SignInPage() {
  return (
    <div className="auth-page">
      <h1>Welcome back to Chainmail!</h1>
      <p>Enter your email address</p>
      <form>{/* Step 1: email, Step 2: password/seed */}</form>
    </div>
  );
}
