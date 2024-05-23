import Layout from "../components/layout";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useSignUp, useSession } from "@clerk/nextjs";
import axios from "axios";
import styles from "./style/signup.module.css"; // Make sure the path is correct
import { toast } from "react-toastify";
import sendWelcomeEmail from "./api/sendGrid/orgRoutes";
export default function SignUp() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { session } = useSession();

  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");

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
      onPressVerify(code);
    }
  }, [code]); //eslint-disable-line
  if (!isLoaded) {
    // Handle loading state
    return null;
  }

  // handle input to verification
  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const input = e.target;
    const previousInput = inputRefs[index - 1]?.current;
    const nextInput = inputRefs[index + 1]?.current;

    // Update code state with single digit
    const newCode = [code];
    // Convert lowercase letters to uppercase
    if (/^[a-z]+$/.test(input.value)) {
      const uc = input.value.toUpperCase();
      newCode[index] = uc;
      inputRefs[index].current!.value = uc;
    } else {
      newCode[index] = input.value;
    }
    setCode(newCode.join(""));

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
    index: number
  ) {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1]?.current;
    const nextInput = inputRefs[index + 1]?.current;

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1)
      );
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: fName,
        lastName: lName,
      });

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

      // send the confirmation email.
      await fetch("/api/sendGrid/orgRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: email,
          firstName: fName,
          orgName: organization,
          templateId: "d-d1407cdb0ce14e33957c5b15a7189c0f",
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
      // get admin email first
      const admin_response = await fetch("/api/admins/userRoutes/?role=admin");
      if (!admin_response.ok) {
        throw new Error("Network response was not ok");
      }
      const admin = await admin_response.json();
      const admin_email = admin.data.email;
      await fetch("/api/sendGrid/orgRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: admin_email,
          firstName: fName,
          orgName: organization,
          templateId: "d-6b5fb63a4d5f41d5aa552e74be1bf3c1",
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

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: any) {
            if (err.errors[0].code === "form_identifier_exists") {
                toast.error(
                    "This email is already in use, please use a different email.",
                    {
                        position: "top-center", // Center the toast at the top
                        className: "custom-toast", // Apply custom CSS class
                        style: {
                            backgroundColor: "white", // Green background color
                            color: "#red", // White text color
                        },
                    }
                );
            }
        }
    };

  const onPressVerify = async (e: any) => {
    /*
        Verifies confirmation code
        */
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }

      //if successfully created clerk user, create in local db
      if (completeSignUp.status === "complete") {
        await setActive({
          session: completeSignUp.createdSessionId,
        });
        //create user in DB
        await axios.post("/api/userRoutes", {
          email: email,
          organization: organization,
          phoneNumber: phone,
          firstName: fName,
          lastName: lName,
          position: position,
        });

        await router.push("/confirmation-page");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
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
                  onChange={(e) => setOrganization(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
              {passwordValidation && (
                <p className={styles.passwordValidation}>
                  {passwordValidation}
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
              type="submit"
              className={`${styles.button} ${styles.buttonSent}`}
              onClick={goToLogin}
            >
              {"Login"}
            </button>
          </form>
        )}
        {pendingVerification && (
          /*<div>
                        <form>
                            <input
                                value={code}
                                placeholder="Code..."
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button onClick={onPressVerify}>
                                Verify Email
                            </button>
                        </form>
                        <p>
                            Enter 6 digit code sent to email address: {email}.
                        </p>
                    </div>*/

          <div className={`${styles.mainContainer}`}>
            <h3>Verify your email address</h3>
            <p>
              We emailed you a 6-digit code to {email}. Enter the code below to
              confirm your email address
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
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
