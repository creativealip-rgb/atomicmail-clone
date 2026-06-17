import ky from "ky";
import type { SWRConfiguration } from "swr";
import {
  DEMO_MAILBOXES,
  DEMO_USER,
  DEMO_FOLDERS,
  DEMO_ALIASES,
  findDemoMessage,
} from "@/services/demo/seed";
import type { Message, Folder, User, Alias } from "@ui/shared-types";

const API_URL = import.meta.env.VITE_API_URL ?? "https://api.atomicmail.io";
const IS_DEMO = import.meta.env.VITE_DEMO === "true";

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: "include",
  timeout: 30_000,
  retry: 3,
  hooks: {
    beforeRequest: [
      (req) => {
        const token = localStorage.getItem("session_token");
        if (token) req.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (_req, _opts, res) => {
        if (res.status === 401) {
          window.dispatchEvent(new CustomEvent("auth:expired"));
        }
      },
    ],
  },
});

/**
 * Returns mock data for demo mode. The rest of the app calls apiFetcher
 * through SWR — they don't know they're hitting fake data.
 */
function demoRoute<T>(url: string): T | null {
  // /mailboxes/:id/messages
  const mboxMatch = url.match(/^\/mailboxes\/([^/]+)\/messages$/);
  if (mboxMatch && mboxMatch[1]) {
    const id = mboxMatch[1];
    return (DEMO_MAILBOXES[id] ?? []) as unknown as T;
  }
  // /messages/:id
  const msgMatch = url.match(/^\/messages\/([^/]+)$/);
  if (msgMatch && msgMatch[1]) {
    const m = findDemoMessage(msgMatch[1]);
    return (m ?? null) as unknown as T;
  }
  // /me, /user, /v1/user
  if (url === "/me" || url === "/user" || url === "/v1/user") {
    return DEMO_USER as unknown as T;
  }
  // /folders
  if (url === "/folders" || url === "/v1/folders") {
    return DEMO_FOLDERS as unknown as T;
  }
  // /aliases
  if (url === "/aliases" || url === "/v1/aliases") {
    return DEMO_ALIASES as unknown as T;
  }
  return null;
}

export const apiFetcher = <T = unknown>(url: string): Promise<T> => {
  if (IS_DEMO) {
    const hit = demoRoute<T>(url);
    if (hit !== null) {
      // simulate a tiny network delay so the loading state shows briefly
      return new Promise((resolve) => setTimeout(() => resolve(hit), 80));
    }
  }
  return api.get(url).json<T>();
};

export const apiSWRConfig: SWRConfiguration = {
  fetcher: apiFetcher,
  revalidateOnFocus: false, // demo: don't refetch on tab focus
  revalidateOnReconnect: false,
  dedupingInterval: 2_000,
};

/** expose demo flag so the UI can show a "DEMO" badge */
export const isDemoMode = (): boolean => IS_DEMO;
