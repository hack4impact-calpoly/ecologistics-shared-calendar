import React from "react";
import { FaBell } from "react-icons/fa";
import styles from "../styles/navbar.module.css";

type AlertProps = {
  onClick: () => void;
  hasPending?: boolean;
};

function Alert({ onClick, hasPending = false }: AlertProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.iconButton}>
      <span className={styles.iconWrapper}>
        <FaBell className={styles.bellIcon} />
        {hasPending && <span className={styles.notificationBadge} />}
      </span>
    </button>
  );
}

export default Alert;