"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import styles from "./loginRegister.module.css";

export default function UserInfo() {
  const { data: session } = useSession();
  return (
    <div>
      <div>
        <div>
          Name: <span>{session?.user?.name}</span>
        </div>
        <div>
          Email: <span>{session?.user?.email}</span>
        </div>
          <button className={styles.button}
            onClick={() => signOut()}>
              Log Out
          </button>
      </div>
    </div>
  );
}