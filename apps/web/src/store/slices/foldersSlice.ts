import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Folder } from "@ui/shared-types";

export interface ApiFolder extends Folder {
  totalCount?: number;
}
export interface ApiLabel {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  kind: "custom";
  unreadCount: number;
  totalCount: number;
}

interface FoldersState {
  folders: ApiFolder[];           // system folders
  labels: ApiLabel[];             // custom labels
  active: string | null;          // current mailbox id (folder id or label id)
  loading: boolean;
  error: string | null;
}

const initialState: FoldersState = {
  folders: [],
  labels: [],
  active: null,
  loading: false,
  error: null,
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(["chainmail", "access"].join("."));
}

function authHeader(): Record<string, string> {
  const t = getToken();
  return t ? { authorization: `Bearer ${t}` } : {};
}

// ── Thunks ────────────────────────────────────────────────────
export const fetchFolders = createAsyncThunk<ApiFolder[], void, { rejectValue: string }>(
  "folders/fetch",
  async (_, { rejectWithValue }) => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/folders", {
      headers: authHeader(),
    });
    if (!res.ok) return rejectWithValue(`folders failed (${res.status})`);
    const data = (await res.json()) as { folders: ApiFolder[] };
    return data.folders;
  }
);

export const fetchLabels = createAsyncThunk<ApiLabel[], void, { rejectValue: string }>(
  "folders/fetchLabels",
  async (_, { rejectWithValue }) => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/labels", {
      headers: authHeader(),
    });
    if (!res.ok) return rejectWithValue(`labels failed (${res.status})`);
    const data = (await res.json()) as { labels: ApiLabel[] };
    return data.labels;
  }
);

export const createLabel = createAsyncThunk<
  ApiLabel,
  { name: string; color?: string },
  { rejectValue: string }
>("folders/createLabel", async (input, { rejectWithValue }) => {
  const res = await fetch(import.meta.env.VITE_API_URL + "/api/labels", {
    method: "POST",
    headers: { ...authHeader(), "content-type": "application/json" },
    body: JSON.stringify({ name: input.name, color: input.color ?? "#6366f1" }),
  });
  if (!res.ok) {
    const e = (await res.json().catch(() => ({}))) as { error?: string };
    return rejectWithValue(e.error ?? `create failed (${res.status})`);
  }
  const data = (await res.json()) as { label: ApiLabel };
  return data.label;
});

export const deleteLabel = createAsyncThunk<string, string, { rejectValue: string }>(
  "folders/deleteLabel",
  async (id, { rejectWithValue }) => {
    const res = await fetch(import.meta.env.VITE_API_URL + `/api/labels/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (!res.ok) return rejectWithValue(`delete failed (${res.status})`);
    return id;
  }
);

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    /** Set the system folder list (used by demo mode to populate without auth) */
    setFolders: (state, action: PayloadAction<ApiFolder[]>) => {
      state.folders = action.payload;
    },
    /** Bump unread count down for a folder (after marking a message read) */
    decrementUnread: (state, action: PayloadAction<string>) => {
      const f = state.folders.find((x) => x.id === action.payload);
      if (f && f.unreadCount > 0) f.unreadCount -= 1;
      const l = state.labels.find((x) => x.id === action.payload);
      if (l && l.unreadCount > 0) l.unreadCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.fulfilled, (s, a: PayloadAction<ApiFolder[]>) => {
        s.folders = a.payload;
      })
      .addCase(fetchLabels.fulfilled, (s, a: PayloadAction<ApiLabel[]>) => {
        s.labels = a.payload;
      })
      .addCase(createLabel.fulfilled, (s, a: PayloadAction<ApiLabel>) => {
        s.labels.push(a.payload);
        s.labels.sort((x, y) => x.name.localeCompare(y.name));
      })
      .addCase(deleteLabel.fulfilled, (s, a: PayloadAction<string>) => {
        s.labels = s.labels.filter((l) => l.id !== a.payload);
      });
  },
});

export const { setActive, decrementUnread, setFolders } = foldersSlice.actions;
export default foldersSlice.reducer;
