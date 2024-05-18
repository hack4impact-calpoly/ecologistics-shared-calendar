import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css"; // Changed to import as a module
import PositionedMenu from "./PositionedMenu";
import { useSession } from "@clerk/nextjs";
import { useRouter } from 'next/router';


const Navbar: React.FC = () => {
  const router = useRouter(); // Get the router object
  const { pathname } = router; // Destructure the pathname from the router

  const menuItems = [];

  const { isLoaded, isSignedIn, session } = useSession();
  const role = session?.user?.unsafeMetadata?.role;

  let orgsPath: string;
  
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

    if (role === "admin") {
      menuItems.push({ path: "/profile", label: "Account Settings" });
      menuItems.push({ path: "/adminEvents", label: "My Events" });
      menuItems.push({ path: "/adminAccounts", label: "My Organizations" });
      menuItems.push({ path: "/login", label: "Logout" });
    } else{
      menuItems.push({ path: "/profile", label: "Account Settings" });
      menuItems.push({ path: "/organizationEvents", label: "My Events" });
      menuItems.push({ path: "/login", label: "Logout" });
    }
  }

  return (
    <nav className={styles.navbar}>
      <Link className={styles.link} href="/">
	<img 
	  src="/images/Logo.png" 
	  className={styles.logo}
	/>
      </Link>
      <div className={styles.dropdown}>
        <PositionedMenu items={menuItems} />
      </div>
    </nav>
  );
};

export default Navbar;



