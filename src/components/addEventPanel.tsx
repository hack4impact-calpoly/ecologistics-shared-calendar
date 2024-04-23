import Layout from "./layout";
import React, { useEffect, useState } from "react";
import { MdOutlineFileUpload, MdClose } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { Event } from "../pages/calendar";
import { set } from "mongoose";
import { get } from "http";
import { request } from "https";

interface AddEventForm {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  isVirtual: boolean;
  photo: File | null;
  location: string;
}

interface FormErrors {
  title: string;
  dates: string;
  times: string;
  description: string;
  location: string;
  photo: string;
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
  location: "",
};

const stringToDate = (date: string, time: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};

interface AddEventPanelProps {
  onClose: () => void;
  onCreate: () => void;
  addEvent: (event: Event) => void;
}

export default function AddEventPanel({
  onClose,
  onCreate,
  addEvent,
}: AddEventPanelProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddEventForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<FormErrors>>({});

  const getErrorsForEmptyFields = (): Partial<FormErrors> => {
    const errors = {} as Partial<FormErrors>;

    const fieldsToCheck = [
      { field: "title", error: "Title is required." },
      { field: "dates", error: "Start date is required." },
      { field: "dates", error: "Start time is required." },
      { field: "dates", error: "End date is required." },
      { field: "dates", error: "End time is required." },
      { field: "description", error: "Description is required." },
      { field: "location", error: "Link or address is required." },
      { field: "photo", error: "Photo is required.", isFile: true },
    ];

    const fieldKeyToErrorKey = (field: string) => {
      if (field.includes("Date") || field.includes("Time")) return "dates";
      return field;
    };

    fieldsToCheck.forEach(({ field, error, isFile }) => {
      const key = field as keyof typeof formData;
      if (
        (isFile && formData[key] === null) ||
        (!isFile && formData[key] === "")
      ) {
        errors[fieldKeyToErrorKey(key) as keyof FormErrors] = error;
      }
    });

    return errors;
  };

  const addLocationErrors = async (errors: Partial<FormErrors>) => {
    if (formData.isVirtual) return;

    const response = await fetch(
      new Request(
        `https://nominatim.openstreetmap.org/search?format=json&q=${formData.location}`
      )
    );

    const data = await response.json();

    if (data.length === 0) {
      errors.location = "Location not found. Please enter a valid address.";
    }
  };

  const addDateErrors = (errors: Partial<FormErrors>) => {
    let start = stringToDate(formData.startDate, formData.startTime);
    let end = stringToDate(formData.endDate, formData.endTime);

    if (start > end) {
      errors.dates = "End date must be after start date.";
    } else if (start.getTime() === end.getTime()) {
      errors.dates = "Start and end dates cannot be the same.";
    }
  };

  const getFormErrors = async (): Promise<Partial<FormErrors>> => {
    setFormErrors({});

    const errors = getErrorsForEmptyFields();

    if (Object.keys(errors).length !== 0) {
      return errors;
    }

    addDateErrors(errors);

    await addLocationErrors(errors);

    return errors;
  };

  const onEventAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    // ID should be assigned based on return from database at some point!
    const event: Event = {
      startRecur: stringToDate(formData.startDate, formData.startTime),
      endRecur: stringToDate(formData.endDate, formData.endTime),
      title: formData.title,
      id: Math.random().toString(),
    };
    const errors = await getFormErrors();
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

      {formErrors.dates && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{formErrors.dates}</p>
        </div>
      )}

      <h4 style={styles.inputTitle}>Description</h4>
      <textarea
        style={styles.textarea}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
        }}
        value={formData.description}
        required
      ></textarea>

      {formErrors.description && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{formErrors.description}</p>
        </div>
      )}

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
          setFormData({ ...formData, location: e.target.value });
        }}
        value={formData.location}
        required
      />

      {formErrors.location && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{formErrors.location}</p>
        </div>
      )}

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

      {formErrors.photo && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{formErrors.photo}</p>
        </div>
      )}

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
    alignContent: "center",
    justifyContent: "center",
  },
};
