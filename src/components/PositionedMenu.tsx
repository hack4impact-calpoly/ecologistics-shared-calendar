import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/router";
import styles from "../styles/navbar.module.css";
import CircleIcon from "@mui/icons-material/Circle";
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
        color="inherit"
        sx={{
          borderRadius: "5%",
          border: "2px solid black",
          margin: "18px 10px",
        }}
      >
        <div>
          <CircleIcon
            sx={{
              color: "darkgreen", // Color of the icon
              bgcolor: "transparent", // Background color of the icon
              borderRadius: "50%",
              fontSize: 28, // Size of the icon
            }}
          />
        </div>
        Username
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
        MenuListProps={{
          "aria-labelledby": "customized-menu",
          sx: {
            "& .MuiMenuItem-root": {
              // Styles for all MenuItems
              bgcolor: "orange", // Background color
              color: "black", // Text color
              "&:hover": {
                bgcolor: "darkorange", // Background color on hover
              },
            },
          },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            className={styles.menuItem}
            key={index}
            onClick={() => handleMenuItemClick(item)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default PositionedMenu;
