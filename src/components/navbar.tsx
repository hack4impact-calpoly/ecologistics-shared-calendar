import React, { useState , useEffect} from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css"; // Changed to import as a module
import PositionedMenu from "./PositionedMenu";
import Alert from "./Alert";
import PendingApprovals from "../admin_components/PendingApprovals";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/clerk-react";


const Navbar: React.FC = () => {
    const router = useRouter();
    const clerk = useClerk();
    const [isOpen, setIsOpen] = useState(false)
    const [hasPending, setHasPending] = useState(false);
    const { pathname } = router;

    const menuItems = [];

    const { isLoaded, isSignedIn, session } = useSession();
    const role = session?.user?.publicMetadata?.role;

    const DONT_SHOW_LOGIN_PATHS = ["/login", "/signup", "/forgot-password"];
    useEffect(() => {
    const checkPending = async () => {
        try {
            const eventsRes = await fetch("/api/users/eventRoutes");
            const orgsRes = await fetch("/api/admins/userRoutes");

            if (!eventsRes.ok || !orgsRes.ok) return;

            const eventsData = await eventsRes.json();
            const orgsData = await orgsRes.json();

            const pendingEvents = (eventsData?.data || []).filter(
                (e: any) => e.status === "Pending"
            );

            const pendingOrgs = (orgsData?.data || []).filter(
                (u: any) => u.role === "pending"
            );

            setHasPending(pendingEvents.length > 0 || pendingOrgs.length > 0);
        } catch (err) {
            console.error("Error checking pending approvals:", err);
        }
    };

    checkPending();
}, []);

    var eventsPath: string;
    if (role === "admin") {
        eventsPath = "/adminEvents";
    } else {
        eventsPath = "/organizationEvents";
    }

    if (!isLoaded) {
        return null;
    }
    console.log(`role: ${role}`);

    if (!clerk.user) {
        menuItems.push({ path: "/login", label: "Login" });
    } else {
        if (role === "admin") {
            menuItems.push({ path: "/calendar", label: "Calendar" });
            menuItems.push({ path: "/adminEvents", label: "Event Management" });
            menuItems.push({
                path: "/adminAccounts",
                label: "Organization Management",
            });
            menuItems.push({ path: "/profile", label: "Account Settings" });
            menuItems.push({ path: "/publicCalendar", label: "Logout" });
        } else {
            menuItems.push({ path: "/calendar", label: "Calendar" });
            menuItems.push({ path: "/organizationEvents", label: "My Events" });
            menuItems.push({ path: "/profile", label: "Account Settings" });
            menuItems.push({ path: "/publicCalendar", label: "Logout" });
        }
    }

    return (
        <nav className={styles.navbar}>
            <Link
                className={styles.link}
                href={clerk.user ? "/calendar" : "/publicCalendar"}
            >
                <img src="/images/Logo.png" className={styles.logo} />
            </Link>
            {clerk.user && (role === "approved" || role === "admin") && (
                <div className={styles.dropdown}>
                    <Alert onClick={() => setIsOpen(true)} hasPending={hasPending} />
                    <PositionedMenu items={menuItems} />
                </div>
            )}{" "}
            {isOpen && (
                <>
                <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}/>
                <div className={styles.modalBox}>
                    <button className={styles.modalClose} onClick={() => setIsOpen(false)} type = "button">
                        x
                    </button>
                    <PendingApprovals />
                </div>
                </>
            )}
            {(!clerk.user ||
                role === "pending" ||
                role === "declined" ||
                !role) &&
                !DONT_SHOW_LOGIN_PATHS.includes(pathname) && (
                    <div className={styles.charityLoginButton}>
                        <button onClick={() => router.push("/login")}>
                            Charity Login
                        </button>
                    </div>
                )}
        </nav>
    );
};

export default Navbar;
