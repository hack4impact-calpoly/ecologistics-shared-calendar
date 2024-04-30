import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/router";
import CircleIcon from "@mui/icons-material/Circle";
import Box from "@mui/material/Box"; // Import Box

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
  const buttonRef = useRef(null); // Reference to the button
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(buttonRef.current); // Use the button reference
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

  // Get the button width using the button reference
  const buttonWidth = buttonRef.current
    ? buttonRef.current.offsetWidth
    : undefined;

  return (
        <div>
            <Button
                ref={buttonRef} // Set the reference to the button
                aria-controls={open ? "customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleClick}
                color="inherit"
                sx={{
                width: "100%", // Use 100% if the button should take the full width of its container
                borderRadius: "5%", // Rounded corners
                border: "2px solid black", // Border styling
                margin: "18px 10px",
                textTransform: "none", // Prevent uppercase transformation
                }}
            >
                <CircleIcon
                sx={{
                    color: "darkgreen",
                    bgcolor: "transparent",
                    borderRadius: "50%",
                    fontSize: 28,
                }}
                />
                Username
            </Button>
            <Menu
                id="customized-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
                }}
                transformOrigin={{
                vertical: "top",
                horizontal: "center",
                }}
                PaperProps={{
                sx: {
                    width: buttonWidth - 3, // Ensure the menu width matches the button width
                    marginTop: "5px", // Adds space between the button and the menu
                    marginLeft: "4px", // Adds space between the button and the menu
                    border: "2px solid black", // Apply a border similar to the button
                    boxShadow: 3, // Optional: adds shadow for better visual separation
                    borderColor: "inherit", // Uses the theme's primary color for the border
                },
                }}
                MenuListProps={{
                sx: {
                    "& .MuiMenuItem-root": {
                    bgcolor: "#F7AB74",
                    margin: "5px", // Margin between MenuItems
                    borderRadius: "5%", // Rounded corners for MenuItems
                    color: "black",
                    "&:hover": {
                        bgcolor: "orange",
                    },
                    padding: "10px 16px", // Padding inside each MenuItem
                    },
                },
                }}
            >
                {items.map((item, index) => (
                <MenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    sx={{
                    justifyContent: "center", // Center the MenuItem text if desired
                    }}
                >
                    {item.label}
                </MenuItem>
                ))}
            </Menu>
        </div>
  );
};

export default PositionedMenu;