import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css"; // Changed to import as a module
import PositionedMenu from "./PositionedMenu";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const menuItems = [
    { path: "/login", label: "Login" },
    // { path: "/login", label: "Login" },

    // Add more menu items here as needed
  ];

  return (
    <nav className={styles.navbar}>
      <Link className={styles.link} href="/">
        <Image src="/images/Home.png" alt="Home" width={177} height={113} />

      </Link>
      <div className={styles.dropdown}>
        {/* <PositionedMenu
          buttonLabel="Menu"
          items={[
            { label: "Home", path: "/" },
            { label: "Profile", path: "/profile" },
            { label: "Settings", path: "/settings" },
            { label: "Logout", onClick: () => console.log("Logging out...") },
          ]}
        /> */}
        <PositionedMenu items={menuItems} />
      </div>
    </nav>
  );
};

export default Navbar;
