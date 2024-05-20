import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/router";
import CircleIcon from "@mui/icons-material/Circle";
import { useClerk } from "@clerk/clerk-react";
import { RxBox, RxHamburgerMenu } from "react-icons/rx";


const PositionedMenu = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const buttonRef = useRef(null);
  const router = useRouter();
  const pathname = router.pathname;
  const open = Boolean(anchorEl);
  const { signOut } = useClerk();

  var placeholder = "Login";

  if (pathname === '/publicCalendar' || pathname === '/') {
    placeholder = "Login";
  } else {
    placeholder = "Username";
  }

  const handleClick = (event) => {
    setAnchorEl(buttonRef.current); // Use the button reference
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (item) => {
    if (item.path) {
      router.push(item.path);
    }
    if (item.label === "Logout") {
      try {
        // Call signOut function to log out the current user
        await signOut();
        // Redirect to a different page after logout if needed
        window.location.href = "/login";
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
    handleClose();
  };

  // Get the button width using the button reference
  const buttonWidth = buttonRef.current ? buttonRef.current.offsetWidth : 0;

  return (
    <div>
      <Button
        ref={buttonRef} // Set the reference to the button
        aria-controls={open ? "customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{
          width: "100%", // Use 100% if the button should take the full width of its container
          margin: "18px 10px",
          textTransform: "none", // Prevent uppercase transformation
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RxHamburgerMenu fontSize={28} color={"white"} />
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
            minWidth: buttonWidth - 3, // Ensure the menu width matches the button width
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
                bgcolor: "#e69153", // Hover color for MenuItem
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

