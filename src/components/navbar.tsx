import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css"; // Changed to import as a module
import PositionedMenu from "./PositionedMenu";
import Image from "next/image";
import { useSignIn, useSession } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const menuItems = [];

  const { isLoaded, isSignedIn, session } = useSession();
  const role = session?.user?.unsafeMetadata?.role;
  if (!isLoaded) {
    return null;
  }
  if (!isSignedIn) {
    menuItems.push({ path: "/login", label: "Login" });
  } else {
    menuItems.push({ path: "/profile", label: "Account Settings" });
    menuItems.push({ path: "/login", label: "My Events" });
    if (role === "admin") {
      menuItems.push({ path: "/adminEvents", label: "My Organizations" });
    }
    menuItems.push({ path: "/login", label: "Logout" });
  }

  return (
    <nav className={styles.navbar}>
      <Link className={styles.link} href="/">
        <Image src="/images/Home.png" alt="Home" width={177} height={113} />
      </Link>
      <div className={styles.dropdown}>
        <PositionedMenu items={menuItems} />
      </div>
    </nav>
  );
};

export default Navbar;