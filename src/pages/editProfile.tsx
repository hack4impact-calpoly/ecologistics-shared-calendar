import Layout from "../components/layout";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";

export default function EditProfilePage() {
    const { user } = useUser();
    const [orgName, setOrg] = useState("");
    const [uid, setUID] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [showConfirmEmail, setShowConfirmEmail] = useState(false);
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [role, setRole] = useState("");
    const [open, setOpen] = useState(false);
    const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .put("/api/userRoutes?clerkId=" + uid, {
        organization: orgName,
        email: email,
        phoneNumber: phone,
        lastName: lname,
        firstName: fname,
        position: position,
        role: role,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    router.push("/profile");
  };

  if (uid === "" && user) {
    setUID(user.id);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/userRoutes?clerkId=" + uid);
        if (!response.ok) {
          throw new Error("Network response fail");
        }
        const responseData = await response.json();
        console.log(responseData);
        setOrg(responseData.data.organization);
        setEmail(responseData.data.email);
        setPosition(responseData.data.position);
        setPhone(responseData.data.phoneNumber);
        setFName(responseData.data.firstName);
        setLName(responseData.data.lastName);
        setRole(responseData.data.role);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [uid]);

  return (
    <Layout>
      <Box sx={{ padding: { xs: 2, md: 5 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            width: "80%",
            padding: { xs: 2, md: 5 },
            border: "2px solid grey",
            mx: "auto",
          }}
        >
          <Grid container direction="column" spacing={3} alignItems="center">
            <Typography
              variant="h3"
              textAlign="center"
              marginTop="20px"
              sx={{ mb: 3 }}
            >
              Account Information
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant="h5" textAlign="center" sx={{ mb: 1 }}>
                  Change Organization Name
                </Typography>
                <input
                  type="text"
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrg(e.target.value)}
                  style={{
                    width: "80%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid grey",
                    margin: "0 auto",
                    display: "block",
                  }}
                />
              </Grid>

              <Typography variant="h5" textAlign="center" sx={{ mt: 3 }}>
                Personal Information
              </Typography>

              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
                justifyContent="center"
              >
                <Grid item xs={12} sm={6} md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="body1">
                    <b>First Name</b>
                  </Typography>
                  <input
                    type="text"
                    id="fname"
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}
                    style={{
                      width: "80%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid grey",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ textAlign: "center" }}>
                  <Typography variant="body1">
                    <b>Last Name</b>
                  </Typography>
                  <input
                    type="text"
                    id="lname"
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}
                    style={{
                      width: "80%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid grey",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
                <b>Position in Organization</b>
              </Typography>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                style={{
                  width: "80%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  marginTop: "10px",
                  margin: "0 auto",
                  display: "block",
                }}
              />

              <Typography variant="h5" textAlign="center" sx={{ mt: 3 }}>
                Organization Information
              </Typography>

              <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
                <b>Email Address</b>
              </Typography>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "80%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  marginTop: "10px",
                  margin: "0 auto",
                  display: "block",
                }}
              />

              <Typography variant="body1" sx={{ mt: 3, textAlign: "center" }}>
                <b>Phone number</b>
              </Typography>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "80%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid grey",
                  marginTop: "10px",
                  margin: "0 auto",
                  display: "block",
                  marginBottom: "20px",
                }}
              />

              <button
                style={{
                  width: "30%",
                  backgroundColor: "#ef7f2d",
                  color: "black",
                  borderRadius: "1rem",
                  padding: "10px",
                  marginTop: "20px",
                  border: "none",
                  margin: "0 auto",
                  display: "block",
                }}
                type="submit"
              >
                Save
              </button>
            </form>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
