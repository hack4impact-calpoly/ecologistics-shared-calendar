import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface VerifyProps {
  email: string;
}

const VerifyEmail: React.FC<VerifyProps> = ({ email}) => {
  const [code, setCode] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = () => {
    alert("Verification Code: " + code.join(""));
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
        We emailed you a 6-digit code to {email}.
        Enter the code below to confirm your email address.
      </Typography>
      <Grid container spacing={1} justifyContent="center" margin="20px 0">
        {code.map((data, index) => (
          <Grid item key={index}>
            <input
              type="text"
              name="code"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
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
