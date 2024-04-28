import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/navbar.module.css'; // Changed to import as a module
import Dropdown from './Dropdown';

const Navbar: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    const menuItems = [
        { path: "/login", label: "Login" }
        // Add more menu items here as needed
    ];

    return (
        <nav className={styles.navbar}>
            <Link className={styles.link} href="/">
                Ecologistics
            </Link>
            <div className={styles.dropdown}>
                <button
                    className={styles.menuButton}
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    onClick={() => setIsActive(!isActive)}
                >
                    Menu
                </button>
                <Dropdown items={menuItems} isActive={isActive} />
            </div>
        </nav>
    );
};

export default Navbar;
