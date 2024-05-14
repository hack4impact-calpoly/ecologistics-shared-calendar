import React from "react";

interface PopupProps{
    onClose: ()=> void;
}

const VerificationPopup: React.FC<PopupProps> = ({ onClose }) =>
{
    
    return (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h1>Verify your email address</h1>
            <p style={styles.message}>We emailed you a 6-digit code to XXXXXXX@gmail.com. Enter the code below to confirm your email address.</p>
            <button style={styles.verifyButton} onClick={onClose}>
              Verify and continue
            </button>
          </div>
        </div>
      );
    };
const styles: {[key: string]: React.CSSProperties} = {
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
        marginBottom: "20px",
        fontWeight: "bold",
        fontSize: "2rem",
      },
    verifyButton: {
        backgroundColor: "black",
        color: "white",
        border: "none",
        padding: "10px 20px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        borderRadius: "20px",
        cursor: "pointer",
    },

}

export default VerificationPopup;

// import React, { useState, useRef, useEffect } from "react";

// interface PopupProps {
//   onClose: () => void;
// }

// const VerificationPopup: React.FC<PopupProps> = ({ onClose }) => {
//   const [code, setCode] = useState<string>("");
//   const [focusedBox, setFocusedBox] = useState<number>(0);
//   const boxesRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (focusedBox >= 0 && focusedBox < boxesRefs.current.length) {
//       boxesRefs.current[focusedBox]?.focus();
//     }
//   }, [focusedBox]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setCode(value);
//     if (value.length < boxesRefs.current.length) {
//       setFocusedBox(value.length);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace" && code.length === 0 && focusedBox > 0) {
//       setFocusedBox((prev) => prev - 1);
//     } else if (/^\d$/.test(e.key) && focusedBox < boxesRefs.current.length - 1) {
//       setFocusedBox((prev) => prev + 1);
//     }
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.popup}>
//         <h1>Verify your email address</h1>
//         <p style={styles.message}>
//           We emailed you a 6-digit code to XXXXXXX@gmail.com. Enter the code below to confirm your email address.
//         </p>
//         <div style={styles.inputContainer}>
//           {[...Array(6)].map((_, index) => (
//             <input
//               key={index}
//               ref={(el) => {
//                 if (el) {
//                   boxesRefs.current[index] = el;
//                 }
//               }}
//               type="text"
//               maxLength={1}
//               value={code[index] || ""}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               style={{
//                 ...styles.inputBox,
//                 border: focusedBox === index ? "2px solid blue" : "2px solid black",
//               }}
//             />
//           ))}
//         </div>
//         <button style={styles.verifyButton} onClick={onClose}>
//           Verify and continue
//         </button>
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   popup: {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "4px",
//     textAlign: "center",
//     width: "25%",
//     boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//   },
//   message: {
//     marginBottom: "20px",
//     fontWeight: "bold",
//     fontSize: "2rem",
//   },
//   inputContainer: {
//     display: "flex",
//     justifyContent: "center",
//     marginBottom: "20px",
//   },
//   inputBox: {
//     width: "40px",
//     height: "40px",
//     fontSize: "1.5rem",
//     textAlign: "center",
//     margin: "0 5px",
//     outline: "none",
//   },
//   verifyButton: {
//     backgroundColor: "black",
//     color: "white",
//     border: "none",
//     padding: "10px 20px",
//     textAlign: "center",
//     textDecoration: "none",
//     display: "inline-block",
//     fontSize: "16px",
//     borderRadius: "20px",
//     cursor: "pointer",
//   },
// };

// export default VerificationPopup;
