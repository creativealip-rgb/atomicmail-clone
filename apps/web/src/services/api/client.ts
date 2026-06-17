import ky from "ky";
import type { SWRConfiguration } from "swr";

const API_URL = import.meta.env.VITE_API_URL ?? "https://api.atomicmail.io";

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: "include",
  timeout: 30_000,
  retry: 3,
  hooks: {
    beforeRequest: [
      (req) => {
        // attach auth token from localStorage if available (alternative: HttpOnly cookie)
        const token = localStorage.getItem("session_token");
        if (token) req.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async (_req, _opts, res) => {
        if (res.status === 401) {
          // session expired — dispatch signOut
          window.dispatchEvent(new CustomEvent("auth:expired"));
        }
      },
    ],
  },
});

export const apiFetcher = <T = unknown>(url: string): Promise<T> =>
  api.get(url).json<T>();

export const apiSWRConfig: SWRConfiguration = {
  fetcher: apiFetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
};
