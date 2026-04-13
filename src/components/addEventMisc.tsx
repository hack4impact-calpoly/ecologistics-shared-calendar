import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type AddEventMiscProps = {
  onBack: () => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPhotoChange: (photo: File | null) => void;
};

export default function AddEventMisc({
  onBack,
  onClose,
  onSubmit,
  onPhotoChange,
}: AddEventMiscProps) {
  const [details, setDetails] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] ?? null;
      setPhoto(file);
      onPhotoChange(file);
      if (file) setImagePreviewUrl(URL.createObjectURL(file));
    },
  });

  return (
    <form onSubmit={onSubmit} style={styles.container}>
      <MdArrowBack onClick={onBack} style={styles.back} size={25} />
      <MdClose onClick={onClose} style={styles.close} size={25} />
      <h3 style={styles.title}>Create New Event</h3>

      <h4>Additional Details</h4>
      <textarea
        style={styles.textarea}
        placeholder="eg. Lorem Ipsum"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <h4>Insert Image</h4>
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
            <label style={styles.uploadButton}>
              {isDragActive ? "Drop the files here." : "Drag and drop or select image."}
            </label>
            <MdOutlineFileUpload size={30} />
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </div>
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
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "0.625rem",
    borderRadius: "0.625rem",
    border: "1px solid #989898",
  },
  uploadContainer: {
    textAlign: "center",
    padding: "2.5rem",
    border: "1px dashed #000",
    borderRadius: "0.3125rem",
  },
  uploadButton: {
    cursor: "pointer",
    display: "block",
    marginBottom: "8px",
  },
  title: {
    marginTop: "1.25rem",
  },
  button: {
    padding: "0.625rem 0.9375rem",
    borderRadius: "1.25rem",
    border: "none",
    background: "#335543",
    color: "white",
    cursor: "pointer",
    width: "7.5rem",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
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
};
