// import React from "react";
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import { useRouter } from "next/router"; // Import useRouter

// interface MenuItemProps {
//   label: string;
//   path?: string; // Optional path for navigation
//   onClick?: () => void; // Optional custom click handler
// }

// interface PositionedMenuProps {
//   buttonLabel: string;
//   items: MenuItemProps[];
// }

// const PositionedMenu: React.FC<PositionedMenuProps> = ({
//   buttonLabel,
//   items,
// }) => {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const router = useRouter(); // Instantiate the router object

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle item click which could navigate or call a custom function
//   const handleMenuItemClick = (item: MenuItemProps) => {
//     if (item.path) {
//       router.push(item.path); // Navigate if path is provided
//     }
//     if (item.onClick) {
//       item.onClick(); // Call custom function if provided
//     }
//     handleClose(); // Always close the menu after the action
//   };

//   return (
//     <div>
//       <Button
//         id="demo-positioned-button"
//         aria-controls={open ? "demo-positioned-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? "true" : undefined}
//         onClick={handleClick}
//         variant="contained"
//         disableElevation
//         endIcon={<KeyboardArrowDownIcon />}
//       >
//         {buttonLabel}
//       </Button>
//       <Menu
//         id="demo-positioned-menu"
//         aria-labelledby="demo-positioned-button"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "left",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "left",
//         }}
//       >
//         {items.map((item, index) => (
//           <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
//             {item.label}
//           </MenuItem>
//         ))}
//       </Menu>
//     </div>
//   );
// };

// export default PositionedMenu;
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/router";
import styles from "../styles/navbar.module.css";

interface DropdownItem {
  label: string;
  path?: string;
  action?: () => void;
}

interface PositionedMenuProps {
  items: DropdownItem[];
}

const PositionedMenu: React.FC<PositionedMenuProps> = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: DropdownItem) => {
    if (item.path) {
      router.push(item.path);
    }
    if (item.action) {
      item.action();
    }
    handleClose();
  };

  return (
    <div>
      <Button
        className={styles.dropdownButton}
        aria-controls={open ? "customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {items.map((item, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default PositionedMenu;
