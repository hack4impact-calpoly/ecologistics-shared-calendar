import Layout from "../components/layout";
import React, { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { useDropzone } from "react-dropzone";

export default function AddEventPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setPhoto(file); 
      setImagePreviewUrl(URL.createObjectURL(file)); 
    },
  });

  return (
    <>
      {/*This is a hacky solution to ensure the form works on mobile for now. CSS should be moved eventually.*/}
      <style>
        {`
          .responsive {
            width: 100%; /* Fullscreen on small displays */
            height: auto;
            padding: 20px;
            box-sizing: border-box;
          }

          @media (min-width: 992px) {
            .responsive {
              width: 25%; 
            }
          }
        `}
      </style>

      <Layout>
        <div className={"responsive"} style={styles.container}>
          <h2 style={styles.title}>Add Event</h2>
          <input type="text" style={styles.input} />
          <div style={styles.horizontal}>
            <div style={styles.inputContainer}>
              <h3>Start Date</h3>
              <input
                type="date"
                style={{
                  ...styles.input,
                  marginRight: "10px",
                  display: "inline-block",
                }}
              />
              <h3>Start Time</h3>
              <input
                type="time"
                style={{
                  ...styles.input,
                  display: "inline-block",
                }}
              />
            </div>
            <div style={styles.inputContainer}>
              <h3>End Date</h3>
              <input
                type="date"
                style={{
                  ...styles.input,
                  marginRight: "10px",
                  display: "inline-block",
                }}
              />
              <h3>End Time</h3>
              <input
                type="time"
                style={{
                  ...styles.input,
                  display: "inline-block",
                }}
              />
            </div>
          </div>
          <h3>Description</h3>
          <textarea style={styles.textarea}></textarea>
          <h3>Location</h3>
          <div style={styles.radioContainer}>
            <label>
              <input
                type="radio"
                name="location"
                value="virtual"
                style={styles.radioButton}
              />
              Virtual
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                name="location"
                value="in-person"
                style={styles.radioButton}
              />
              In Person
            </label>
          </div>
          <input type="text" placeholder="Link" style={styles.input} />
          <div {...getRootProps()} style={styles.uploadContainer}>
            <input {...getInputProps()} />
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100px",
                  marginBottom: "20px",
                }}
              />
            )}
            <label htmlFor="file-upload" style={styles.uploadButton}>
              <MdOutlineFileUpload size={30} />
              {isDragActive
                ? "Drop the files here."
                : "Drag and drop or select image."}
            </label>
          </div>
          <button style={styles.button}>Add Event</button>
        </div>
      </Layout>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    alignContent: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "15px",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
  },
  textarea: {
    width: "calc(100% - 20px)",
    height: "100px",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "15px",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
  },
  radioContainer: {
    display: "flex",
    marginBottom: "20px",
  },
  radioButton: {
    marginRight: "10px",
    color: "black",
    accentColor: "black",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "20px",
    background: "black",
    color: "white",
    cursor: "pointer",
    display: "block",
    width: "25%",
    marginTop: "10px",
    margin: "0 auto",
  },
  uploadContainer: {
    textAlign: "center",
    padding: "40px",
    border: "1px dashed #000",
    borderRadius: "5px",
    marginBottom: "20px",
    marginTop: "20px",
  },
  uploadButton: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    width: "48%",
  },
};
