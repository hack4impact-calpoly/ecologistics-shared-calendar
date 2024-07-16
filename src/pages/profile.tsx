import Layout from "../components/layout";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button, Paper, Typography } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/navbar";

export default function ProfilePage() {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/editProfile");
  };
  const { styles } = useProfileStyles();
  const { user } = useUser();

  const [orgName, setOrg] = useState("");
  const [uid, setUID] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [userOrAdmin, setUserOrAdmin] = useState("user");

  let tagColor = "#497cb0";
  let tagColor2 = "#d4e9ff";
  if (uid == "" && user) {
    setUID(user.id);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/userRoutes?clerkId=" + uid);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        setEmail(responseData.data.email);
        setPosition(responseData.data.position);
        setPhone(responseData.data.phoneNumber);
        setFName(responseData.data.firstName);
        setLName(responseData.data.lastName);
        setUserOrAdmin(responseData.data.role);
        if (responseData.data.role == "approved") {
          setUserOrAdmin("user");
        }
        setOrg(responseData.data.organization);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [uid]);

  if (userOrAdmin === "admin") {
    tagColor = "#497cb0";
    tagColor2 = "#d4e9ff";
  } else {
    tagColor = "#b76c00";
    tagColor2 = "orange";
  }

  return (
    <Layout>
      <Box sx={{ padding: { xs: "20px", md: "50px" } }}>
        {/* <Navbar /> */}
        <Box
          sx={{
            ...styles.boxStyle,
            border: "2px solid grey",
            padding: { xs: "20px", sm: "50px", md: "100px" },
          }}
        >
          <Grid container direction="column">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm="auto">
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {orgName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: tagColor2,
                    borderRadius: "1rem",
                    padding: "8px 17px",
                    textAlign: "center",
                  }}
                >
                  <Typography sx={{ color: tagColor }}>
                    {userOrAdmin}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm="auto" sx={{ ml: "auto" }}>
                <Button
                  onClick={handleEdit}
                  variant="outlined"
                  sx={styles.buttonSX}
                  style={styles.buttonStyle}
                >
                  Edit
                  <FaEdit size={15} style={{ marginLeft: "8px" }} />
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography sx={{ mt: 3 }}>
                  <b>First Name</b>
                </Typography>
                <Typography>{fname}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mt: 3 }}>
                  <b>Last Name</b>
                </Typography>
                <Typography>{lname}</Typography>
              </Grid>
            </Grid>
            <Typography sx={{ mt: 3 }}>
              <b>Position in Organization</b>
            </Typography>
            <Typography>{position}</Typography>
            <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
              Organization Information
            </Typography>
            <Typography sx={{ mt: 3 }}>
              <b>Email Address</b>
            </Typography>
            <Typography>{email}</Typography>
            <Typography sx={{ mt: 3 }}>
              <b>Phone number</b>
            </Typography>
            <Typography>{phone}</Typography>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

function useProfileStyles() {
  const styles: { [key: string]: React.CSSProperties } = {
    boxStyle: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      borderRadius: 3,
      width: "85%",
      // padding: { xs: "20px", sm: "50px", md: "100px" },
    },
    labelStyle: {
      backgroundColor: "#d4e9ff",
      borderRadius: "1rem",
      paddingLeft: "17px",
      paddingRight: "17px",
      marginTop: "38px",
    },
    buttonStyle: { marginTop: "30px", marginLeft: "auto", color: "#bfbfbf" },

    buttonSX: {
      borderColor: "#bfbfbf",
      textTransform: "none",
    },
  };
  return { styles };
}
