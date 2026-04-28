import Layout from "../components/layout";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useSignUp, useSession, useSignIn } from "@clerk/nextjs";
import axios from "axios";
import styles from "./style/signup.module.css"; // Make sure the path is correct
import { toast } from "react-toastify";
import { clerkClient } from "@clerk/nextjs/server";

export default function SignUp() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { session } = useSession();

  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [organizationLen, setOrganizationLen] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);

  interface InputRef {
    current: HTMLInputElement | null;
  }

  // Refs to control each digit input element
  const inputRefs: InputRef[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  // Call our callback when code = 6 chars
  useEffect(() => {
    if (code.length === 6) {
      onPressVerify();
    }
  }, [code]); //eslint-disable-line
  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  // Returns flag if any password requirements are not met, otherwise returns empty array
  const getPasswordErrors = (pwd: string): string[] => {
    const meetsLength = pwd.length >= 8;
    const meetsNumber = /\d/.test(pwd);
    const meetsSpecial = /[!@#$%^&*(),.?\":{}|<>]/.test(pwd);

    if (!meetsLength || !meetsNumber || !meetsSpecial) {
      return ["invalid"]; // Flag to trigger the error UI
    }
    return [];
  };

  // handle input to verification
  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const input = e.target;
    const previousInput = inputRefs[index - 1]?.current;
    const nextInput = inputRefs[index + 1]?.current;

    // Treat code as a 6-character string buffer
    const codeArr = code.split("");
    while (codeArr.length < 6) {
      codeArr.push("");
    }

    let val = input.value;

    if (/^[a-z]$/.test(val)) {
      val = val.toUpperCase();
      inputRefs[index].current!.value = val;
    }
    codeArr[index] = val;

    setCode(codeArr.join(""));

    input.select();

    if (input.value === "") {
      // If the value is deleted, select previous input, if exists
      if (previousInput) {
        previousInput.focus();
      }
    } else if (nextInput) {
      // Select next input on entry, if exists
      nextInput.select();
    }
  }

  // Select the contents on focus
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  // Handle backspace key
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1]?.current;
    const nextInput = inputRefs[index + 1]?.current;

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();

      setCode((prevCode) => {
        const arr = prevCode.split("");

        // Ensure there are always 6 slots
        while (arr.length < 6) {
          arr.push("");
        }
        // Clear the current index instead of shrinking the string
        arr[index] = "";
        return arr.join("");
      });

      if (previousInput) {
        previousInput.focus();
      }
    }
  }

  // Capture pasted characters
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === 6) {
      setCode(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        if (inputRef.current) {
          inputRef.current.value = pastedCode.charAt(index);
        }
      });
    }
  };

  const goToLogin = () => {
    router.push("/login"); // Use Next.js router for navigation
  };

  const resetVerificationInputs = () => {
    setCode("");
    inputRefs.forEach((r) => {
      if (r.current) r.current.value = "";
    });
    inputRefs[0]?.current?.focus();
  };

  const handleResendVerification = async () => {
    if (!isLoaded || verifying) {
      return;
    }

    setVerifying(true);
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setErrorMessage("");
      setShowResendVerification(false);
      resetVerificationInputs();
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Password validation
    const errors = getPasswordErrors(password);
    if (errors.length > 0) {
      setPasswordValidation(errors);
      return;
    } else {
      setPasswordValidation([]); // Clear any previous validation messages
    }

    try {
      //delete previous session if user was alread logged in
      if (session) {
        await session.end();
      }

      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: fName,
        lastName: lName,
      });

      // send the verification email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors && err.errors[0]?.code === "form_identifier_exists") {
        toast.error(
          "This email is already in use, please use a different email.",
          {
            position: "top-center", // Center the toast at the top
            className: "custom-toast", // Apply custom CSS class
            style: {
              backgroundColor: "white", // Green background color
              color: "#red", // White text color
            },
          },
        );
      }
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    if (verifying) {
      return;
    }

    setErrorMessage("");
    setShowResendVerification(false);

    setVerifying(true);

    let completeSignUp;
    try {
      completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const status = err?.status;
      const errorCode = err?.errors?.[0]?.code;

      if (status === 429 || errorCode === "too_many_requests") {
        setErrorMessage("Too many requests. Please wait and try again.");
        setShowResendVerification(false);
      } else if (errorCode === "verification_failed") {
        setErrorMessage(
          "Too many failed attempts. Request a new verification code.",
        );
        setShowResendVerification(true);
        resetVerificationInputs();
      } else if (errorCode === "form_code_incorrect") {
        setErrorMessage("Incorrect code. Please try again.");
        setShowResendVerification(false);
        resetVerificationInputs();
      } else if (
        errorCode === "verification_expired" ||
        errorCode === "verification_missing" ||
        errorCode === "verification_not_sent"
      ) {
        setErrorMessage("Request a new verification code.");
        setShowResendVerification(true);
        resetVerificationInputs();
      } else {
        setErrorMessage("Incorrect code. Please try again.");
        setShowResendVerification(false);
        resetVerificationInputs();
      }

      setVerifying(false);
      return;
    }

    try {
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
        return;
      }

      await setActive({
        session: completeSignUp.createdSessionId,
      });

      await axios.post("/api/userRoutes", {
        email: email,
        organization: organization,
        phoneNumber: phone,
        firstName: fName,
        lastName: lName,
        position: position,
      });

        // send the confirmation email to organization
        await fetch("/api/resend/orgRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailAddress: email,
            firstName: fName,
            orgName: organization,
            templateId: 'org-registration-pending-client'
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data); // Handle success response
          })
          .catch((error) => {
            console.error("Error:", error); // Handle error
          });

        // send email notif to admin
        const admin_response = await fetch(
          "/api/admins/userRoutes/?role=admin", // get admin email first
        );
        if (!admin_response.ok) {
          throw new Error("Network response was not ok");
        }
        const admin = await admin_response.json();
        const admin_email = admin.data.email;
        await fetch("/api/resend/orgRoutes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailAddress: admin_email,
            firstName: fName,
            orgName: organization,
            templateId: 'org-registration-pending-admin'
          }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      router.push("/confirmation-page");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Layout>
      <style jsx>{`
        input::placeholder {
          color: grey;
        }
      `}</style>
      <div className={styles.container}>
        {!pendingVerification && (
          <form className={styles.formBox} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Apply For an Account</h2>
            <p className={styles.subtitle}>Organizations & Charities Only</p>

            <div className={styles.inputBox}>
              <label htmlFor="email" className={styles.label}>
                Name of Organization
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="organization"
                  id="organization"
                  placeholder="Enter Organization Name"
                  className={styles.input}
                  value={organization}
                  onChange={(e) => {
                    const currLength = e.target.value.length;
                    if (currLength <= 150) {
                      setOrganizationLen(currLength);
                      setOrganization(e.target.value);
                    }
                  }}
                  required
                />
              </div>
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="fName" className={styles.label}>
                First Name of Organization Representative
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="fName"
                  id="fName"
                  placeholder="Enter First Name "
                  className={styles.input}
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="lName" className={styles.label}>
                Last Name of Organization Representative
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="name"
                  id="lName"
                  placeholder="Enter Last Name "
                  className={styles.input}
                  value={lName}
                  onChange={(e) => setLName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="position" className={styles.label}>
                Position of Organization Representative
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="position"
                  id="position"
                  placeholder="Enter Position "
                  className={styles.input}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="phone" className={styles.label}>
                Organization Phone Number
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="phone"
                  id="phone"
                  placeholder="Enter Phone Number "
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Your Email Address "
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputBox}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type between "text" and "password"
                  id="password"
                  placeholder="Enter Your Password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordValidation(getPasswordErrors(e.target.value));
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle the state on button click
                  className={styles.togglePasswordButton}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordValidation.length > 0 && (
                <p className={styles.passwordValidation}>
                  Password must be 8+ characters and include:
                  <br />• At least one number
                  <br />• At least one special character
                </p>
              )}
            </div>

            <div style={{ paddingTop: "1vw" }}></div>

            <button
              type="submit"
              className={`${styles.button} ${styles.buttonSent}`}
            >
              {"Sign Up"}
            </button>

            <div className={styles.bottomText}>
              Already Have an Account? Login Here!
            </div>

            <button
              type="button"
              className={`${styles.button} ${styles.buttonSent}`}
              onClick={goToLogin}
            >
              {"Login"}
            </button>
          </form>
        )}

        {pendingVerification && (
          <div className={`${styles.mainContainer}`}>
            <h3>Verify your email address</h3>
            <p>
              We emailed you a 6-digit code to {email}. Enter the code below to
              confirm your email address.
            </p>
            <div className={`${styles.verificationContainer}`}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  className={`${styles.verificationButton}`}
                  key={index}
                  type="text"
                  maxLength={1}
                  onChange={(e) => handleInput(e, index)}
                  ref={inputRefs[index]}
                  autoFocus={index === 0}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  disabled={verifying}
                />
              ))}
            </div>

            {/* Reserved message slot to keep page from moving when error appears */}
            <div className={styles.messageSlot} aria-live="polite">
              <p
                className={`${styles.errorMessage} ${errorMessage ? styles.visible : ""}`}
                role="status"
              >
                {errorMessage}
              </p>
            </div>

            <div className={styles.resendSlot} aria-live="polite">
              {showResendVerification && (
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSent} ${styles.resendButton}`}
                  onClick={handleResendVerification}
                  disabled={verifying}
                >
                  Request New Code
                </button>
              )}
            </div>

            {/* Keeps dedicated div for loading circle so the screen does not jump */}
            <div className={styles.loadingSlot} aria-live="polite">
              {/* Conditionally renders loading circle only while verification is running */}
              <div
                className={`${styles.loadingCircle} ${
                  verifying ? styles.loadingVisible : ""
                }`}
                aria-label="Verifying"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
