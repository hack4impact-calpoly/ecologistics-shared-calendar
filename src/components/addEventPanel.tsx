import Layout from "./layout";
import React, { useEffect, useState } from "react";
import { MdOutlineFileUpload, MdClose } from "react-icons/md";
import { useDropzone } from "react-dropzone";

interface AddEventPanelProps {
  onClose: () => void;
}

export default function AddEventPanel({ onClose }: AddEventPanelProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    isVirtual: false,
    photo: null,
    link: "",
  });

  // WARNING: For debugging. Delete before final commit!
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setImagePreviewUrl(URL.createObjectURL(file));
    },
  });

  const handleLocationChange = (e) => {};

  return (
    <div style={styles.container}>
      <MdClose onClick={onClose} style={styles.close} size={25} />
      <h3 style={styles.title}>Add Event</h3>
      <input
        type="text"
        style={styles.input}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <div style={styles.horizontal}>
        <div style={styles.inputContainer}>
          <h4 style={styles.inputTitle}>Start Date</h4>
          <input
            type="date"
            style={{
              ...styles.input,
              marginRight: "10px",
              display: "inline-block",
            }}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <h4 style={styles.inputTitle}>Start Time</h4>
          <input
            type="time"
            style={{
              ...styles.input,
              display: "inline-block",
            }}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
          />
        </div>
        <div style={styles.inputContainer}>
          <h4 style={styles.inputTitle}>End Date</h4>
          <input
            type="date"
            style={{
              ...styles.input,
              marginRight: "10px",
              display: "inline-block",
            }}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
          <h4 style={styles.inputTitle}>End Time</h4>
          <input
            type="time"
            style={{
              ...styles.input,
              display: "inline-block",
            }}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
          />
        </div>
      </div>
      <h4 style={styles.inputTitle}>Description</h4>
      <textarea
        style={styles.textarea}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
        }}
      ></textarea>
      <h4 style={styles.inputTitle}>Location</h4>
      <div style={styles.radioContainer}>
        <label>
          <input
            type="radio"
            name="location"
            value="virtual"
            style={styles.radioButton}
            onChange={(e) =>
              e.target.checked && setFormData({ ...formData, isVirtual: true })
            }
          />
          Virtual
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="location"
            value="in-person"
            style={styles.radioButton}
            onChange={(e) =>
              e.target.checked && setFormData({ ...formData, isVirtual: false })
            }
          />
          In Person
        </label>
      </div>
      <input
        type="text"
        placeholder="Link"
        style={styles.input}
        onChange={(e) => {
          setFormData({ ...formData, link: e.target.value });
        }}
      />
      <div {...getRootProps()} style={styles.uploadContainer}>
        <input {...getInputProps()} />
        {imagePreviewUrl ? (
          <div>
            <img
              src={imagePreviewUrl}
              alt="Preview"
              style={{
                maxWidth: "20%",
                maxHeight: "20%",
              }}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="file-upload" style={styles.uploadButton}>
              {isDragActive
                ? "Drop the files here."
                : "Drag and drop or select image."}
            </label>
            <MdOutlineFileUpload size={30} />
          </div>
        )}
      </div>
      <button style={styles.button}>Add Event</button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1px solid black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    margin: "10px",
    width: "80%",
    height: "50%",
    position: "relative",
    gap: "5px",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "10px",
    borderRadius: "15px",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
  },
  textarea: {
    width: "calc(100% - 20px)",
    minHeight: "100px",
    padding: "10px",
    borderRadius: "15px",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
    overflow: "auto",
  },
  radioContainer: {
    display: "flex",
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
    width: "15%",
    alignSelf: "center",
  },
  uploadContainer: {
    textAlign: "center",
    padding: "40px",
    border: "1px dashed #000",
    borderRadius: "5px",
  },
  uploadButton: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  horizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: "5px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "48%",
  },
  inputTitle: {
    fontWeight: "bold",
  },
  close: {
    position: "absolute",
    top: "0",
    left: "0",
    margin: "5px",
    cursor: "pointer",
  },
};
