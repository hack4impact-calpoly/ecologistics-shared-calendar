import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import AddEventLocationPanel from "./addEventLocationPanel";
import AddEventMisc from "./addEventMisc";

export interface AddEventFormType {
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
  latitude: number | null;
  longitude: number | null;
  locationDescription: string;
  virtualMeetingId?: string;
  virtualPassword?: string;
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
  mode: "in-person",
  isVirtual: false,
  url: null,
  photo: null,
  city: "",
  street: "",
  state: "",
  postalCode: "",
  latitude: null,
  longitude: null,
  locationDescription: "",
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
  virtualMeetingId?: string;
  virtualPassword?: string;
}

const stringToDate = (date: string, time: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes);
};

type Panel = "start" | "location" | "misc";

interface AddEventPanelProps {
  onClose: () => void;
  onCreate: () => void;
  addEvent: () => void;
}

export default function AddEventPanel({
  onClose,
  onCreate,
  addEvent,
}: AddEventPanelProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<AddEventFormType>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<FormErrors>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titleCharsTyped, setTitleCharsTyped] = useState(0);
  const [desCharsTyped, setDesCharsTyped] = useState(0);
  const [panelType, setPanelType] = useState<Panel>("start");

  const hasText = (value: string | null | undefined) =>
    Boolean(value && value.trim());

  // Validate only the fields shown on the first panel
  const getStartPanelErrors = (): Partial<FormErrors> => {
    const errors = {} as Partial<FormErrors>;

    if (!hasText(formData.title)) {
      errors.title = "Title is required.";
    }

    if (!hasText(formData.startDate)) {
      errors.dates = "Start date is required.";
    } else if (!hasText(formData.startTime)) {
      errors.dates = "Start time is required.";
    } else if (!hasText(formData.endDate)) {
      errors.dates = "End date is required.";
    } else if (!hasText(formData.endTime)) {
      errors.dates = "End time is required.";
    }

    return errors;
  };

  // Keep location rules separate so each panel can block progression
  const getLocationPanelErrors = (): Partial<FormErrors> => {
    const errors = {} as Partial<FormErrors>;
    const hasStructuredAddress =
      hasText(formData.street) &&
      hasText(formData.city) &&
      hasText(formData.state) &&
      hasText(formData.postalCode);
    const hasPinnedLocation =
      hasText(formData.locationDescription) ||
      (formData.latitude !== null &&
        formData.longitude !== null &&
        (formData.latitude !== 0 || formData.longitude !== 0));

    if (
      formData.mode === "in-person" &&
      !hasStructuredAddress &&
      !hasPinnedLocation
    ) {
      errors.location = "Location is required.";
    } else if (formData.mode === "virtual" && !hasText(formData.url)) {
      errors.location = "Meeting link is required.";
    }

    return errors;
  };

  const getErrorsForEmptyFields = (
    panels: Panel[] = panelType === "misc" ? [] : [panelType],
  ): Partial<FormErrors> => {
    const errors = {} as Partial<FormErrors>;

    if (panels.includes("start")) {
      Object.assign(errors, getStartPanelErrors());
    }

    if (panels.includes("location")) {
      Object.assign(errors, getLocationPanelErrors());
    }

    return errors;
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

    // await addLocationErrors(errors);

    return errors;
  };

  // Continue buttons validate their own panel before changing steps.
  const handleStartContinue = () => {
    const errors = getErrorsForEmptyFields(["start"]);

    if (Object.keys(errors).length === 0) {
      addDateErrors(errors);
    }

    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setPanelType("location");
  };

  const handleLocationContinue = () => {
    const errors = getErrorsForEmptyFields(["location"]);

    if (Object.keys(errors).length !== 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setPanelType("misc");
  };

  const handleBack = (panel: Panel) => {
    setFormErrors({});
    setPanelType(panel);
  };

  const onEventAdd = async (e: React.FormEvent) => {
    e?.preventDefault();
    onCreate();
    // setFormData(EMPTY_FORM);
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
            fileData,
          );
          uploadResult = uploadResponse.data;
        }

        let address = formData.url || "";

        if (formData.mode == "in-person") {
          const hasStructuredAddress =
            hasText(formData.street) &&
            hasText(formData.city) &&
            hasText(formData.state) &&
            hasText(formData.postalCode);

          address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.postalCode}`;
          if (!hasStructuredAddress) {
            address =
              formData.locationDescription.trim() ||
              `${formData.latitude}, ${formData.longitude}`;
          }
        }

        const event: Event = {
          title: formData.title,
          // organization: (user.publicMetadata.organization as string) ?? "",
          startDate: stringToDate(formData.startDate, formData.startTime),
          endDate: stringToDate(formData.endDate, formData.endTime),
          description: formData.description,
          isVirtual: formData.isVirtual,
          location: address,
          status:
            user?.publicMetadata?.role === "admin" ? "Approved" : "Pending",
          imageLink: uploadResult?.URL,
          virtualMeetingId: formData.virtualMeetingId,
          virtualPassword: formData.virtualPassword,
        };

        const eventResponse = await axios.post("api/users/eventRoutes", event);
        if (eventResponse.status === 201) {
          addEvent();
          onCreate();
          setFormData(EMPTY_FORM);
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
    <>
      {panelType === "start" && (
        <form style={styles.container} onSubmit={onEventAdd}>
          <MdArrowBack onClick={onClose} style={styles.back} size={25} />
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
          <div style={styles.errorBox}>
            {formErrors.title && <p style={styles.error}>{formErrors.title}</p>}
          </div>

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

          <div style={styles.errorBox}>
            {formErrors.dates && <p style={styles.error}>{formErrors.dates}</p>}
          </div>

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
          <button
            style={styles.button}
            type="button"
            disabled={isLoading}
            onClick={handleStartContinue}
          >
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </form>
      )}
      {panelType === "location" && (
        <AddEventLocationPanel
          error={formErrors.location}
          onBack={() => handleBack("start")}
          onClose={onClose}
          onContinue={handleLocationContinue}
          eventFormData={formData}
          setEventFormData={setFormData}
        />
      )}
      {panelType === "misc" && (
        <AddEventMisc
          onBack={() => handleBack("location")}
          onClose={onClose}
          onSubmit={onEventAdd}
          onPhotoChange={(photo) => setFormData((prev) => ({ ...prev, photo }))}
        />
      )}
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: "0.625rem",
    border: "1px solid black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "1.25rem",
    margin: "0.625rem",
    width: "80%",
    height: "50%",
    position: "relative",
    gap: "0.3125rem",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "0.625rem",
    borderRadius: "0.9375rem",
    background: "rgba(217, 217, 217, 0.3)",
    border: "1px solid #989898",
    color: "black",
  },
  textarea: {
    width: "calc(100% - 20px)",
    minHeight: "100px",
    padding: "0.625rem",
    borderRadius: "0.9375rem",
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
    padding: "0.625rem 0.9375rem",
    border: "none",
    borderRadius: "1.25rem",
    background: "#335543",
    color: "white",
    cursor: "pointer",
    display: "block",
    width: "15%",
    alignSelf: "center",
  },
  uploadContainer: {
    marginTop: "0.625rem",
    textAlign: "center",
    padding: "2.5rem",
    border: "1px dashed #000",
    borderRadius: "0.3125rem",
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
    gap: "0.3125rem",
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
  title: {
    marginTop: "1.25rem",
  },
  close: {
    position: "absolute",
    top: "0.5rem",
    right: "0",
    margin: "0.3125rem",
    cursor: "pointer",
  },
  back: {
    position: "absolute",
    top: "0.5rem",
    left: "0",
    margin: "0.3125rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    margin: 0,
    fontSize: "1rem",
  },
  errorBox: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    minHeight: "1.25rem",
  },
  characterCount: {
    color: "grey",
  },
};
