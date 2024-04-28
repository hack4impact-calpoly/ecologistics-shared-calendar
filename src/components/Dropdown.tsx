import React from "react";
import Link from "next/link";
import styles from "../styles/navbar.module.css"; 

interface DropdownProps {
  items: { path: string; label: string }[];
  isActive: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ items, isActive }) => {
  if (!isActive) return null;

  return (
    <div className={styles.dropdown}> 
      {items.map((item, index) => (
        <Link key={index} href={item.path}>
          <a className={styles.dropdownItem}>{item.label}</a>       
        </Link>
      ))}
    </div>
  );
};

export default Dropdown;
