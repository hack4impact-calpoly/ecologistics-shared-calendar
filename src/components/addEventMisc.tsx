import React, { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function AddEventMisc() {
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
      if (file) setImagePreviewUrl(URL.createObjectURL(file));
    },
  });

  return (
    <div style={styles.container}>
      <h3>Create New Event</h3>

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

      <button type="button" style={styles.button}>
        Submit
      </button>

    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #989898",
  },
  uploadContainer: {
    textAlign: "center",
    padding: "40px",
    border: "1px dashed #000",
    borderRadius: "5px",
  },
  uploadButton: {
    cursor: "pointer",
    display: "block",
    marginBottom: "8px",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    width: "120px",
    alignSelf: "center",
  },
};
