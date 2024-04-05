import Layout from "./layout";
import React, { useEffect, useState } from "react";
import { MdOutlineFileUpload, MdClose } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { Event } from "../pages/calendar";
import { set } from "mongoose";

interface AddEventPanelProps {
  onClose: () => void;
  onCreate: () => void;
  addEvent: (event: Event) => void;
}

interface AddEventForm {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  isVirtual: boolean;
  photo: File | null;
  link: string;
}

const emptyForm = {
  title: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  description: "",
  isVirtual: false,
  photo: null,
  link: "",
};

interface FormErrors {
  title: string;
  dates: string;
  times: string;
  description: string;
  link: string;
  photo: string;
}

const stringToDate = (date: string, time: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};

export default function AddEventPanel({
  onClose,
  onCreate,
  addEvent,
}: AddEventPanelProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddEventForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<FormErrors>>({});

  const getFormErrors = (): Partial<FormErrors> => {
    setFormErrors({});

    const errors = {} as Partial<FormErrors>;

    let start = stringToDate(formData.startDate, formData.startTime);
    let end = stringToDate(formData.endDate, formData.endTime);

    if (start > end) {
      errors.dates = "End date must be after start date.";
    }

    return errors;
  };

  const onEventAdd = (e: React.FormEvent) => {
    e.preventDefault();

    // ID should be assigned based on return from database at some point!
    const event: Event = {
      start: stringToDate(formData.startDate, formData.startTime),
      end: stringToDate(formData.endDate, formData.endTime),
      title: formData.title,
      id: Math.random().toString(),
    };

    const errors = getFormErrors();
    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
      return;
    }

    addEvent(event);
    onCreate();
    setFormData(emptyForm);
    setImagePreviewUrl(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] as File | null; // Will not be null, but TS doesn't know that.
      setFormData((prev: AddEventForm) => ({ ...prev, photo: file }));
      setImagePreviewUrl(URL.createObjectURL(file as Blob));
    },
  });

  return (
    <form style={styles.container} onSubmit={onEventAdd}>
      <MdClose onClick={onClose} style={styles.close} size={25} />
      <h3 style={styles.title}>Add Event</h3>

      {/*Display Form Errors */}
      {Object.keys(formErrors).length > 0 && (
        <div style={styles.errorBox}>
          {Object.entries(formErrors).map(([key, value]: [string, string]) => (
            <p style={styles.error} key={key}>
              {value}
            </p>
          ))}
        </div>
      )}

      <h4 style={styles.inputTitle}>Title</h4>
      <input
        type="text"
        style={styles.input}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        value={formData.title}
        required
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
            value={formData.startDate}
            required
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
            value={formData.startTime}
            required
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
            value={formData.endDate}
            required
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
            value={formData.endTime}
            required
          />
        </div>
      </div>
      <h4 style={styles.inputTitle}>Description</h4>
      <textarea
        style={styles.textarea}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
        }}
        value={formData.description}
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
            required
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
            required
          />
          In Person
        </label>
      </div>
      <input
        type="text"
        placeholder={formData.isVirtual ? "Link" : "Address"}
        style={styles.input}
        onChange={(e) => {
          setFormData({ ...formData, link: e.target.value });
        }}
        value={formData.link}
        required
      />
      <div {...getRootProps()} style={styles.uploadContainer}>
        <input {...getInputProps()} required />
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

      <button style={styles.button} type="submit">
        Add Event
      </button>
    </form>
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
    marginBottom: "10px",
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
    background: "#335543",
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
  error: {
    color: "red",
    marginTop: "5px",
  },
  errorBox: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    border: "1px solid red",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    color: "red",
  },
};
