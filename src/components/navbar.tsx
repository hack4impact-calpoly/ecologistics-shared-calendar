import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css"; // Changed to import as a module
import PositionedMenu from "./PositionedMenu";
import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { el } from "@fullcalendar/core/internal-common";


const Navbar: React.FC = () => {
  const router = useRouter(); // Get the router object
  const { pathname } = router; // Destructure the pathname from the router

  const menuItems = [];

  const { isLoaded, isSignedIn, session } = useSession();
  const role = session?.user?.unsafeMetadata?.role;
  var eventsPath;
  if (role === "admin") {
    eventsPath = "/adminEvents";
  } else {
    eventsPath = "/organizationEvents";
  }
  if (!isLoaded) {
    return null;
  }
  if (pathname === '/publicCalendar' || pathname === '/') {
    menuItems.push({ path: "/login", label: "Login" });
  } else {
    menuItems.push({ path: "/profile", label: "Account Settings" });
    menuItems.push({ path: eventsPath, label: "My Events" });
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
