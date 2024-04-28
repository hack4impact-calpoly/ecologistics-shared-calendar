import React, { useState } from 'react';
import Link from 'next/link';
import './navbar.component.css';
import Dropdown from './Dropdown';

const Navbar: React.FC = () => {
    const [isActive, setIsActive] = useState(false);

    const menuItems = [
        { path: "/login", label: "Login" }
        // Add more menu items here as needed
    ];

    return (
        <nav className="navbar">
            <Link href="/" className="link">Home</Link>
            <div className="dropdown" onClick={() => setIsActive(!isActive)}>
                <button>Menu</button>
                <Dropdown items={menuItems} isActive={isActive} />
            </div>
        </nav>
    );
};

export default Navbar;
