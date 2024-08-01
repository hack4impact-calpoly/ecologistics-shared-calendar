import Layout from "../components/layout";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import VerifyEmail from "../components/verifyEmail";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

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

  const handleProfileSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.patch("/api/userRoutes", {
        organization: orgName,
        phoneNumber: phone,
        lastName: lname,
        firstName: fname,
        position: position,
        role: role,
      });
      router.push("/profile");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyEmail = async (verificationCode: string) => {
    try {
      setShowConfirmEmail(false);
      setOpen(false);
      console.log("CODE: ", verificationCode);
      await axios.patch("/api/update-email", {
        email: email,
        code: verificationCode,
      });
      alert("Email updated successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEmailSubmit = async (e: any) => {
    e.preventDefault();

    if (confirmEmail !== email) {
      toast.error("Emails must match.", {
        position: "top-center",
        className: "custom-toast",
        style: {
          backgroundColor: "white",
          color: "red",
        },
      });
    } else {
      try {
        setOpen(true);
        setShowConfirmEmail(false);
        axios.post("api/update-email", {
          email: email,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    if (uid === "" && user) {
      setUID(user.id);
    }
  }, [uid, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) return;
      try {
        const response = await fetch("/api/userRoutes?clerkId=" + uid);
        if (!response.ok) {
          throw new Error("Network response failed");
        }
        const responseData = await response.json();
        setOrg(responseData.data.organization);
        setEmail(responseData.data.email);
        setPosition(responseData.data.position);
        setPhone(responseData.data.phoneNumber);
        setFName(responseData.data.firstName);
        setLName(responseData.data.lastName);
        setRole(responseData.data.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [uid]);

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    setShowConfirmEmail(true);
  };

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

            <form onSubmit={handleEmailSubmit} style={{ width: "100%" }}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant="h5" textAlign="center" sx={{ mb: 1 }}>
                  Email Address
                </Typography>
                <p
                  style={{
                    width: "80%",
                    padding: "10px",
                    // borderRadius: "5px",
                    // border: "1px solid grey",
                    margin: "0 auto",
                    display: "block",
                  }}
                >
                  {email}
                </p>

                {showConfirmEmail && (
                  <>
                    <Typography variant="h6" textAlign="center" sx={{ mb: 1 }}>
                      Confirm Email Address
                    </Typography>
                    <input
                      type="text"
                      id="confirmEmail"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      style={{
                        width: "80%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid grey",
                        margin: "0 auto",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    />
                    <button
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#ef7f2d",
                        color: "black",
                        borderRadius: "1rem",
                        padding: "10px 20px",
                        border: "none",
                        display: "block",
                        margin: "0 auto",
                      }}
                      type="submit"
                    >
                      Update Email
                    </button>
                  </>
                )}
              </Grid>
            </form>

            <form onSubmit={handleProfileSubmit} style={{ width: "100%" }}>
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
                  margin: "0 auto",
                  display: "block",
                  marginTop: "10px",
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
                  margin: "0 auto",
                  display: "block",
                  marginTop: "10px",
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Verify your email address</DialogTitle>
        <DialogContent>
          <VerifyEmail email={email} onVerify={handleVerifyEmail} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
