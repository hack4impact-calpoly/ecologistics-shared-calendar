import React, { ReactEventHandler, useState } from "react";
import { MdOutlineFileUpload, MdClose } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { stat } from "fs";

interface AddEventForm {
  //organization: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  isVirtual: boolean;
  mode: string;
  url: string | null;
  photo: File | null;
  city: string;
  street: string;
  state: string;
  postalCode: string;
}

interface FormErrors {
  title: string;
  dates: string;
  times: string;
  description: string;
  location: string;
  photo: string;
}

const EMPTY_FORM = {
  title: "",
  // organization: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  description: "",
  mode: "",
  isVirtual: false,
  url: null,
  photo: null,
  city: "",
  street: "",
  state: "",
  postalCode: "",
};

interface Event {
  title: string;
  // organization: string;
  startDate: Date;
  endDate: Date;
  description: string;
  location: string;
  status: string;
  isVirtual: boolean;
  imageLink?: string;
}

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
  const { user } = useUser();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddEventForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<FormErrors>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titleCharsTyped, setTitleCharsTyped] = useState(0);
  const [desCharsTyped, setDesCharsTyped] = useState(0);
  const [mode, setMode] = useState("");

  const getErrorsForEmptyFields = (): Partial<FormErrors> => {
    const errors = {} as Partial<FormErrors>;

    const fieldsToCheck = [
      { field: "title", error: "Title is required." },
      { field: "dates", error: "Start date is required." },
      { field: "dates", error: "Start time is required." },
      { field: "dates", error: "End date is required." },
      { field: "dates", error: "End time is required." },
      //{ field: "description", error: "Description is required." },
      { field: "location", error: "Link or address is required." },
      //{ field: "photo",isFile: true },
    ];

    const fieldKeyToErrorKey = (field: string) => {
      if (field.includes("Date") || field.includes("Time")) return "dates";
      return field;
    };

    fieldsToCheck.forEach(({ field, error /*isFile*/ }) => {
      // const key = field as keyof typeof formData;
      // if (
      //   (isFile && formData[key] === null) ||
      //   (!isFile && formData[key] === "")
      // ) {
      //   errors[fieldKeyToErrorKey(key) as keyof FormErrors] = error;
      // }
    });

    return errors;
  };

  const addLocationErrors = async (errors: Partial<FormErrors>) => {
    if (mode == "virtual") return;

    const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.postalCode}`;

    const response = await fetch(
      new Request(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
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
    onCreate();
    setFormData(EMPTY_FORM);
    setImagePreviewUrl(null);
    setIsLoading(true);
    setDesCharsTyped(0);
    setTitleCharsTyped(0);
    try {
      const errors = await getFormErrors();
      if (Object.keys(errors).length !== 0) {
        setFormErrors(errors);
        return;
      }

      if (formData) {
        console.log(formData.state);
        const fileData = new FormData();
        var uploadResult = null;
        if (formData.photo) {
          fileData.append("file", formData.photo);
          const uploadResponse = await axios.post(
            "api/s3-upload/route",
            fileData
          );
          uploadResult = uploadResponse.data;
        }

        let address = formData.url || "";

        if (mode == "in-person") {
          address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.postalCode}`;
        }

        const event: Event = {
          title: formData.title,
          // organization: (user.publicMetadata.organization as string) ?? "",
          startDate: stringToDate(formData.startDate, formData.startTime),
          endDate: stringToDate(formData.endDate, formData.endTime),
          description: formData.description,
          isVirtual: formData.isVirtual,
          location: address,
          status: "Pending",
          imageLink: uploadResult?.URL,
        };

        const eventResponse = await axios.post("api/users/eventRoutes", event);
        if (eventResponse.status === 201) {
          addEvent(event);
          onCreate();
          setFormData(EMPTY_FORM);
          setImagePreviewUrl(null);
          console.log("CREATED EVENT");
        } else {
          setFormErrors((prev) => ({
            ...prev,
            photo: "Failed to create event",
          }));
        }

        console.log("CREATED EVENT: ", eventResponse);
      } else {
        //setFormErrors((prev) => ({ ...prev, photo: "Photo is required" }));
      }
    } catch (error) {
      console.error("Error:", error);
      setFormErrors((prev) => ({
        ...prev,
        photo: "Error uploading image or creating event",
      }));
    } finally {
      // send the confirmation email.
      await fetch("/api/sendGrid/orgRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: user?.emailAddresses?.[0]?.emailAddress,
          firstName: user?.firstName,
          orgName: user?.publicMetadata.organization,
          eventTitle: formData.title,
          templateId: "d-52ab27ece2254b4fa7b6794d2574d04e", //replaced
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
      //send admin confirmation email
      // get admin email first
      const admin_response = await fetch("/api/admins/userRoutes/?role=admin");
      if (!admin_response.ok) {
        throw new Error("Network response was not ok");
      }
      const admin = await admin_response.json();
      const admin_email = admin.data.email;
      console.log(admin_email);
      await fetch("/api/sendGrid/orgRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: admin_email,
          firstName: user?.firstName || "default",
          orgName: user?.publicMetadata.organization,
          eventTitle: formData.title,
          templateId: "d-f6a46ab1b6264991b690439fccb4e281", //replaced
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
      setIsLoading(false); // End loading
    }
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

  const handleClick = (event: React.ChangeEvent<{ value: string }>) => {
    setMode(event.target.value);
    setFormData({ ...formData, mode: event.target.value });
    console.log(formData.mode);
    if (event.target.value == "in-person") {
      setFormData({ ...formData, isVirtual: false });
    } else {
      setFormData({ ...formData, isVirtual: true });
    }
  };

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  return (
    <form style={styles.container} onSubmit={onEventAdd}>
      <MdClose onClick={onClose} style={styles.close} size={25} />
      <h3 style={styles.title}>Add Event</h3>
      <h4 style={styles.inputTitle}>
        Title<span style={{ color: "red" }}> *</span>
      </h4>

      <input
        type="text"
        style={styles.input}
        onChange={(e) => {
          const currLength = e.target.value.length;
          if (currLength <= 45) {
            setTitleCharsTyped(currLength);
            setFormData({ ...formData, title: e.target.value });
          }
        }}
        value={formData.title}
        disabled={isLoading}
        required
      />
      <p style={styles.characterCount}>
        Characters Typed: {titleCharsTyped}/45
      </p>

      <div style={styles.horizontal}>
        <div style={styles.inputContainer}>
          <h4 style={styles.inputTitle}>
            Start Date<span style={{ color: "red" }}> *</span>
          </h4>
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
            disabled={isLoading}
            value={formData.startDate}
            required
          />

          <h4 style={styles.inputTitle}>
            Start Time<span style={{ color: "red" }}> *</span>
          </h4>
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
            disabled={isLoading}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <h4 style={styles.inputTitle}>
            End Date<span style={{ color: "red" }}> *</span>
          </h4>
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
            disabled={isLoading}
            required
          />

          <h4 style={styles.inputTitle}>
            End Time<span style={{ color: "red" }}> *</span>
          </h4>
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
            disabled={isLoading}
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
          const currLength = e.target.value.length;
          if (currLength <= 1500) {
            setDesCharsTyped(currLength);
            setFormData({ ...formData, description: e.target.value });
          }
        }}
        value={formData.description}
      ></textarea>
      <p style={styles.characterCount}>
        Characters Typed: {desCharsTyped}/1500
      </p>
      {formErrors.description && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{formErrors.description}</p>
        </div>
      )}

      <h4 style={styles.inputTitle}>
        Location<span style={{ color: "red" }}> *</span>
      </h4>

      <div style={styles.radioContainer}>
        <label>
          <input
            type="radio"
            name="location"
            value="virtual"
            style={styles.radioButton}
            onChange={handleClick}
            required
            disabled={isLoading}
          />
          Virtual
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="location"
            value="in-person"
            style={styles.radioButton}
            onChange={handleClick}
            required
            disabled={isLoading}
          />
          In Person
        </label>
      </div>

      {mode == "in-person" ? (
        <>
          <h4 style={styles.inputTitle}>
            Street<span style={{ color: "red" }}> *</span>
          </h4>
          <input
            type="text"
            style={styles.input}
            onChange={(e) =>
              setFormData({ ...formData, street: e.target.value })
            }
            value={formData.street}
            required
            disabled={isLoading}
          />
          <h4 style={styles.inputTitle}>
            City<span style={{ color: "red" }}> *</span>
          </h4>
          <input
            type="text"
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            value={formData.city}
            required
            disabled={isLoading}
          />
          <h4 style={styles.inputTitle}>
            State<span style={{ color: "red" }}> *</span>
          </h4>
          <Select
            labelId="state-select-label"
            id="state-select"
            value={formData.state}
            label="Select a state"
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
          >
            <MenuItem value="">
              <em>Select...</em>
            </MenuItem>
            {states.map((stateAbbr, index) => (
              <MenuItem key={index} value={stateAbbr}>
                {stateAbbr}
              </MenuItem>
            ))}
          </Select>
          {/* <input
            type="text"
            style={styles.input}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            value={formData.state}
            required
            disabled={isLoading}
          /> */}
          <h4 style={styles.inputTitle}>
            Postal Code<span style={{ color: "red" }}> *</span>
          </h4>
          <input
            type="text"
            style={styles.input}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
            value={formData.postalCode}
            required
            disabled={isLoading}
          />
        </>
      ) : mode == "virtual" ? (
        <>
          <h4 style={styles.inputTitle}>
            Link<span style={{ color: "red" }}> *</span>
          </h4>
          <input
            type="text"
            style={styles.input}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            value={formData.url ? formData.url : ""}
            required
            disabled={isLoading}
          />
        </>
      ) : null}

      {formErrors.location && (
        <div style={styles.errorBox}>
          <p style={styles.error}>{formErrors.location}</p>
        </div>
      )}

      <div {...getRootProps()} style={styles.uploadContainer}>
        <input {...getInputProps()} />
        {imagePreviewUrl ? (
          <div>
            <Image
              src={imagePreviewUrl}
              alt="Preview"
              width={0}
              height={0}
              style={{ width: "20%", height: "20%" }}
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

      <button style={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Add Event"}
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
    marginTop: "10px",
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
  characterCount: {
    color: "grey",
  },
};
