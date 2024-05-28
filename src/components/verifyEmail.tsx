import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";

interface VerifyProps {
    email: string;
    onVerify: (code: string) => void;
}

const VerifyEmail: React.FC<VerifyProps> = ({ email, onVerify }) => {
    const [code, setCode] = useState<string[]>(new Array(6).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;

        if (!/^\d$/.test(value)) return; // Only allow single digits

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Focus next input box
        if (index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (event.key === "Backspace") {
            event.preventDefault();
            const newCode = [...code];
            if (newCode[index]) {
                newCode[index] = ""; // Clear the current box
                setCode(newCode);
            } else if (index > 0) {
                newCode[index - 1] = ""; // Clear the previous box
                setCode(newCode);
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const paste = event.clipboardData.getData("text");
        if (!/^\d{6}$/.test(paste)) return;

        const newCode = paste.split("");
        setCode(newCode);

        newCode.forEach((value, index) => {
            if (inputsRef.current[index]) {
                inputsRef.current[index]!.value = value;
            }
        });

        if (inputsRef.current[5]) {
            inputsRef.current[5]!.focus();
        }
    };

    const handleSubmit = async () => {
        try {
            const verificationCode = code.join("");
            onVerify(verificationCode);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding="20px"
            borderRadius="10px"
            border="1px solid #ccc"
            maxWidth="400px"
            margin="auto"
        >
            <Typography variant="h5" gutterBottom>
                Verify your email address
            </Typography>
            <Typography variant="body1" gutterBottom>
                We emailed you a 6-digit code to {email}. Enter the code below
                to confirm your email address.
            </Typography>
            <Grid container spacing={1} justifyContent="center" margin="20px 0">
                {code.map((data, index) => (
                    <Grid item key={index}>
                        <input
                            type="text"
                            name="code"
                            maxLength={1}
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
                            onPaste={handlePaste}
                            ref={(el) => {
                                inputsRef.current[index] = el;
                            }}
                            style={{
                                width: "40px",
                                height: "40px",
                                textAlign: "center",
                                margin: "0 5px",
                                fontSize: "20px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ backgroundColor: "#ef7f2d", color: "black" }}
            >
                Verify and continue
            </Button>
        </Box>
    );
};

export default VerifyEmail;
