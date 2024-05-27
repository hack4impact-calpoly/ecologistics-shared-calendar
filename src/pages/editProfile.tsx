import Layout from "../components/layout";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useRouter } from "next/router";
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

    const handleProfileSubmit = async (e) => {
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

    const handleVerifyEmail = async (verificationCode) => {
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

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (confirmEmail !== email) {
            toast.error("Emails must match.", {
                position: "top-center", // Center the toast at the top
                className: "custom-toast", // Apply custom CSS class
                style: {
                    backgroundColor: "white", // Green background color
                    color: "#red", // White text color
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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setShowConfirmEmail(true);
    };

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
                        <h3>Account Information</h3>

                        <form onSubmit={handleEmailSubmit}>
                            <Grid item>
                                <h4>Email Address</h4>
                                <input
                                    type="text"
                                    id="email"
                                    style={{ width: "300px" }}
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                {showConfirmEmail && (
                                    <>
                                        <p>Confirm Email Address</p>
                                        <input
                                            type="text"
                                            id="confirmEmail"
                                            style={{ width: "300px" }}
                                            value={confirmEmail}
                                            onChange={(e) =>
                                                setConfirmEmail(e.target.value)
                                            }
                                        />
                                        <br></br>
                                        <button
                                            style={{
                                                marginTop: "10px",
                                                backgroundColor: "#ef7f2d",
                                                color: "black",
                                                borderRadius: "1rem",
                                            }}
                                            type="submit"
                                        >
                                            Update Email
                                        </button>
                                    </>
                                )}
                            </Grid>
                        </form>

                        <br></br>

                        <form onSubmit={handleProfileSubmit}>
                            <Grid item>
                                <h4>Change Organization Name</h4>
                                <input
                                    type="text"
                                    id="orgName"
                                    value={orgName}
                                    onChange={(e) => setOrg(e.target.value)}
                                />
                            </Grid>
                            <br></br>
                            <h4>Personal Information</h4>
                            <Grid container spacing={2}>
                                <Grid item xs={1.5}>
                                    <p>First Name</p>
                                    <input
                                        type="text"
                                        id="fname"
                                        value={fname}
                                        onChange={(e) =>
                                            setFName(e.target.value)
                                        }
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <p>Last Name</p>
                                    <input
                                        type="text"
                                        id="lname"
                                        value={lname}
                                        onChange={(e) =>
                                            setLName(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <p>Position in Organization</p>
                            <input
                                type="text"
                                style={{ width: "300px" }}
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                            <p>Phone number</p>
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
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Verify your email address</DialogTitle>
                <DialogContent>
                    <VerifyEmail email={email} onVerify={handleVerifyEmail} />
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
