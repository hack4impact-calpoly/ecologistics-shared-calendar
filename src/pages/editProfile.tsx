import Layout from "../components/layout";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";

export default function EditProfilePage() {
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
    axios
      .put("/api/userRoutes?clerkId=" + uid, {
        email: email,
        organization: orgName,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    router.push("/profile");
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
      <div style={{ padding: "50px" }}>
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
                <input
                  type="text"
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrg(e.target.value)}
                />
              </Grid>
              <br></br>
              <h3>Personal Information</h3>
              <Grid container spacing={2}>
                <Grid item xs={1.5}>
                  <p>
                    <b>First Name</b>
                  </p>
                  <input
                    type="text"
                    id="fname"
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <p>
                    <b>Last Name</b>
                  </p>
                  <input
                    type="text"
                    id="lname"
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <p>
                <b>Position in Organization</b>
              </p>
              <br></br>
              <input
                type="text"
                style={{ width: "300px" }}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />

              <h3>Organization Information</h3>
              <p>
                <b>Email Address</b>
              </p>
              <input
                type="text"
                id="email"
                style={{ width: "300px" }}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <br></br>
              <br></br>
              <button
                style={{
                  width: "50px",
                  backgroundColor: "#ef7f2d",
                  color: "black",
                  borderRadius: "1rem",
                }}
                type="submit"
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
