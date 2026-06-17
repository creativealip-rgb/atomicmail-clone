import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setSearchQuery } from "@/store/slices/uiSlice";
import { open as openComposer } from "@/store/slices/composerSlice";
import { AvatarMenu } from "./AvatarMenu";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./TopBar.module.css";

export function TopBar() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.ui.searchQuery);
  const user = useAppSelector((s) => s.user.profile);
  const [search, setSearch] = useState(query);

  return (
    <header className={styles.topbar}>
      <form
        className={styles.search}
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(setSearchQuery(search));
        }}
      >
        <span className={styles.searchIcon} aria-hidden>🔍</span>
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </form>

      <div className={styles.right}>
        <button className={styles.composeBtn} onClick={() => dispatch(openComposer())}>
          ✎ Compose
        </button>
        <ThemeToggle />
        <AvatarMenu user={user} />
      </div>
    </header>
  );
}
