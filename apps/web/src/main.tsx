import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/store";
import { App } from "@/App";
import { isDemoMode } from "@/services/api/client";
import { signInSuccess } from "@/store/slices/authSlice";
import { setFolders } from "@/store/slices/foldersSlice";
import { DEMO_USER, DEMO_FOLDERS } from "@/services/demo/seed";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// Demo mode: bootstrap auth + folders so the dashboard is fully populated
// without ever calling the real chainmail.app API.
if (isDemoMode()) {
  store.dispatch(
    signInSuccess({ email: DEMO_USER.email, token: "demo-token" })
  );
  store.dispatch(setFolders(DEMO_FOLDERS));
  // tag the session so other tabs / reloads know we're in demo
  try {
    localStorage.setItem("__demo_mode", "1");
    localStorage.setItem("session_token", "demo-token");
  } catch {
    /* localStorage may be blocked in some sandboxes */
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
