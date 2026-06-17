import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { signOut } from "@/store/slices/authSlice";
import { lock } from "@/store/slices/encryptionSlice";
import { setPrivacyCenter, setActiveModal } from "@/store/slices/uiSlice";
import type { User } from "@ui/shared-types";
import { Avatar } from "@ui/ui";
import styles from "./TopBar.module.css";

interface Props {
  user: User | null;
}

export function AvatarMenu({ user }: Props) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    dispatch(lock());
    dispatch(signOut());
    setOpen(false);
  };

  return (
    <div className={styles.avatarMenu}>
      <button
        className={styles.avatarBtn}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup
      >
        {user ? <Avatar name={user.email} size={32} /> : <Avatar name="?" size={32} />}
      </button>

      {open && (
        <div className={styles.menu}>
          <button
            className={styles.menuItem}
            onClick={() => {
              dispatch(setPrivacyCenter(true));
              setOpen(false);
            }}
          >
            🔒 Privacy Center
          </button>
          <button
            className={styles.menuItem}
            onClick={() => {
              dispatch(setActiveModal("twoFactorSetup"));
              setOpen(false);
            }}
          >
            🛡 2FA
          </button>
          <button
            className={styles.menuItem}
            onClick={() => {
              dispatch(setActiveModal("settings"));
              setOpen(false);
            }}
          >
            ⚙ Settings
          </button>
          <hr className={styles.divider} />
          <button className={styles.menuItem} onClick={handleSignOut}>
            ⤴ Sign out
          </button>
        </div>
      )}
    </div>
  );
}
