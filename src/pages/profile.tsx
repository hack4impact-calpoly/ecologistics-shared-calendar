import Layout from "../components/layout";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button, useIsFocusVisible } from "@mui/material";
import { Paper, Typography } from "@mui/material";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
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
  let tagColor="#497cb0";
  let tagColor2="#d4e9ff";
  if(uid=="" && user){
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
        console.log(responseData);
        setEmail(responseData.data.email);
        setPosition(responseData.data.position)
        setPhone(responseData.data.phoneNumber)
        setFName(responseData.data.firstName)
        setLName(responseData.data.lastName)
        if(responseData.data.role==="approved"){
          setUserOrAdmin("user");
        }
        
        setOrg(responseData.data.organization)
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [uid]);

  if(userOrAdmin==="admin"){
    tagColor="#497cb0"
    tagColor2="#d4e9ff"
  } else{
    tagColor="#b76c00"
    tagColor2="orange"
  }

  return (
    <Layout>
      <div style={{ padding: "50px" }}>
        <Navbar />
        <Box style={styles.boxStyle} sx={{ border: "2px solid grey" }}>
          <Grid
            container
            direction="column"
            justifyContent="left"
            alignItems="left"
          >
            <Grid container spacing={4}>
              <Grid item>
                <h2>{orgName}</h2>
              </Grid>
              <Grid item xs={1.1}>
                <Paper elevation={0} style={{
                    backgroundColor: tagColor2,
                    borderRadius: "1rem",
                    paddingLeft: "17px",
                    paddingRight: "17px",
                    marginTop: "38px",
                    textAlign: "center"
              }}>
                  <p style={{ color: tagColor }}>{userOrAdmin}</p>
                </Paper>
              </Grid>
              <Grid item xs={2}>
                <Button
                  onClick={handleEdit}
                  variant="outlined"
                  sx={styles.buttonSX}
                  style={styles.buttonStyle}
                >
                  Edit
                  <FaEdit size={15} style={{ marginLeft: "8px" }}></FaEdit>
                </Button>
              </Grid>
            </Grid>

            <h3>Personal Information</h3>
            <Grid container spacing={2}>
              <Grid item xs={1.5}>
                <p>
                  <b>First Name</b>
                </p>
                <p>{fname}</p>
              </Grid>
              <Grid item xs={2}>
                <p>
                  <b>Last Name</b>
                </p>
                <p>{lname}</p>
              </Grid>
            </Grid>
            <p>
              <b>Position in Organization</b>
            </p>
            <p>{position}</p>
            <h3>Organization Information</h3>
            <p>
              <b>Email Address</b>
            </p>
            <p>{email}</p>
            <p>
              <b>Phone number</b>
            </p>
            <p>{phone}</p>
          </Grid>
        </Box>
      </div>
    </Layout>
  );
}

function useProfileStyles() {
  const styles: { [key: string]: React.CSSProperties } = {
    boxStyle: {
      display: "flex",
      justifyContent: "left",
      borderRadius: 3,
      width: "80%",
      paddingLeft: "200px",
      paddingTop: "50px",
      paddingBottom: "20%",
    },
    labelStyle: {
      backgroundColor: "#d4e9ff",
      borderRadius: "1rem",
      paddingLeft: "17px",
      paddingRight: "17px",
      marginTop: "38px",
    },
    buttonStyle: { marginTop: "30px", marginLeft: "500px", color: "#bfbfbf" },

    buttonSX: {
      borderColor: "#bfbfbf",
      textTransform: "none",
    },
  };
  return { styles };
}
