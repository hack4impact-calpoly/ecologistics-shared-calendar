import Layout from "../components/layout";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/router";
import { clerkClient } from "@clerk/nextjs";
import EmailTemplate from "../components/email-template";
import { Resend } from "resend";
import type { NextApiRequest, NextApiResponse } from "next";
import { A } from "@fullcalendar/resource/internal-common";

const VerificationForm = ({ onClose, email, uid, orgName }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [error, setError] = useState(false);

  // Generate verification code once when the component mounts
  useEffect(() => {
    setVerificationCode(generateVerificationCode());
  }, []);

  const updateEmailAddress = async (emailAddressId, params) => {
    try {
      const response = await clerkClient.emailAddresses.updateEmailAddress(emailAddressId, params);
      console.log(response); // Optional: Log the response
      // Handle success (e.g., show a success message, navigate to another page)
    } catch (error) {
      console.error("Error updating email address:", error);
      // Handle error (e.g., show an error message)
    }
  };
  

  const generateVerificationCode = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    console.log(code)
    return code;
  };

  const handleChange = (index, value) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    setIsCodeCorrect(newCodes.join("") === verificationCode);
    // Move focus to the next input if a digit is entered
    setError(false);
    if (value && index < codes.length - 1) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCodeCorrect) {
      console.log("Verification successful!");
      axios
          .put("/api/userRoutes?clerkId=" + uid, {
            email: email,
            organization: orgName,
          })
          .then((data) => {
            console.log(data);
            //router.push("/profile")
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      onClose(); // Close the pop-up
    } else {
      console.log("Incorrect verification code!");
      setError(true);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.closeButton} onClick={onClose}>
          X
        </div>
        <h1 style={styles.heading}>Verify your email address</h1>
        <p style={styles.message}>
          We emailed you a 6-digit code to {email}. Enter the code below to
          confirm your email address.
        </p>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            {codes.map((code, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={code}
                onChange={(e) => handleChange(index, e.target.value)}
                id={`code-${index}`}
                style={{
                  width: "35px",
                  height: "50px",
                  fontSize: "20px",
                  marginRight: "5px",
                  marginBottom: "10px",
                  textAlign: "center",
                  borderRadius: "10px",
                  border: error && "1px solid red",
                }}
              />
            ))}
          </div>
          {error && <p style={{ color: "red", textAlign: "center" }}>Wrong verification code!</p>}
          <button type="submit" style={styles.verifyButtonContainer}>
            Verify and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default function EditProfilePage() {
  const [sent, setSent] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isShowingVerPopUp, setIsShowingVerPopUp] = useState(false);
  const openVerPopup = () => setIsShowingVerPopUp(true);
  const closeVerPopup = () => setIsShowingVerPopUp(false);

  const { user } = useUser();
  const [orgName, setOrg] = useState("");
  const [uid, setUID] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/userRoutes?clerkId=" + uid);
      if (!response.ok) {
        throw new Error("Network response fail");
      }
      const responseData = await response.json();
      const currentEmail = responseData.data.email;

      // Check if the current email is different from the updated email
      if (email !== currentEmail) {
        console.log("current: " + currentEmail)
        console.log("new: " + email)
        openVerPopup(); // Show the popup
      } else {
        console.log("current: " + currentEmail)
        console.log("same: " + email)
        axios
          .put("/api/userRoutes?clerkId=" + uid, {
            email: email,
            organization: orgName,
          })
          .then((data) => {
            console.log(data);
            router.push("/profile")
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching user data:", error); // Handle fetch error
    }
  };

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
      } catch (error) {}
    };
    if (user) {
      setUID(user.id);
      fetchData();
    }
  }, [user, uid]);

  return (
    <Layout>
      <style jsx>{`
        input::placeholder {
          color: grey;
        }
      `}</style>
      <div style={{ padding: "50px" }}>
        {isShowingVerPopUp && (
          <VerificationForm onClose={closeVerPopup} email={email} uid={uid} orgName={orgName}/>
        )}
        <Box
          display="flex"
          justifyContent="left"
          borderRadius={3}
          width="80%"
          paddingLeft="200px"
          paddingTop="50px"
          paddingBottom="20%"
          sx={{ border: "2px solid grey" }}
        >
          <Grid
            container
            direction="column"
            justifyContent="left"
            alignItems="left"
          >
            <h3>Account Information </h3>

            <form onSubmit={handleSubmit}>
              <Grid item>
                <p>Change Organization Name</p>
                <input type="text" id="orgName" placeholder="XXXXXXX" />
              </Grid>
              <br></br>
              <h3>Personal Information</h3>
              <Grid container spacing={2}>
                <Grid item xs={1.5}>
                  <p>
                    <b>First Name</b>
                  </p>
                  <input type="text" id="fname" placeholder="XXXXXX" />
                </Grid>
                <Grid item xs={2}>
                  <p>
                    <b>Last Name</b>
                  </p>
                  <input type="text" id="lname" placeholder="XXXXXXX" />
                </Grid>
              </Grid>
              <p>
                <b>Position in Organization</b>
              </p>
              <br></br>
              <input
                type="text"
                style={{ width: "300px" }}
                placeholder="XXXXXXXXXXX"
              />

              <h3>Organization Information</h3>
              <p>
                <b>Email Address</b>
              </p>
              <input
                type="text"
                id="email"
                style={{ width: "300px" }}
                placeholder="XXXXXXX@XXX.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p>
                <b>Phone number</b>
              </p>
              <input
                type="text"
                id="phone"
                style={{ width: "300px" }}
                placeholder="+1-XXX-XXX-XXXX"
              />
              <br></br>
              <br></br>
              <button
                type="submit"
                style={{
                  width: "50px",
                  backgroundColor: "#ef7f2d",
                  color: "black",
                  borderRadius: "1rem",
                }}
              >
                Save
              </button>
            </form>
          </Grid>
        </Box>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backgroundPage: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "4px",
    textAlign: "center",
    width: "25%",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  message: {
    fontFamily: "DM Sans, sans-serif",
    margin: "15px",
    fontSize: "15px",
    textAlign: "center",
  },
  verifyButtonContainer: {
    backgroundColor: "#F07F2D",
    width: "33%",
    border: "none",
    padding: "10px 20px",
    textAlign: "center",
    textDecoration: "none",
    fontSize: "16px",
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-evenly",
    margin: "0 auto",
    fontWeight: "bold",
  },
  verifyAndCont: {
    color: "black",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: "bold",
  },
  popup: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255,255,255,1)",
    zIndex: "1000",
    width: "620px",
    height: "350px",
  },
  heading: {
    fontFamily: "DM Sans, sans-serif",
    textAlign: "center",
    borderRadius: "10px",
    fontSize: "30px",
  },
  closeButton:{
    textAlign: "right",
    marginRight: "10px",
    cursor: "pointer",

  }
};
