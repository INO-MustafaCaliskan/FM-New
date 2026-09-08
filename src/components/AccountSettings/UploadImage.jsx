import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faSave, faCamera, faUpload } from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import useUploadFile from "@/utils/hooks/useUploadFile";
import { toast } from "react-toastify";
import InoButton from "../Buttons/InoButton";

export const UploadImage = ({
  defaultImageUrl,
  uploadType,
  uploadCallback,
  variant = "default", // "default" | "avatar"
  label = "Profile Photo",
}) => {
  const { uploadFileHelper } = useUploadFile();
  const [imageFile, setimageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setimageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowSaveButton(true);
    }
  };

  const handleSavePhoto = async (fileArg) => {
    const fileToUpload = fileArg || imageFile;

    setUploading(true);
    const result = await uploadFileHelper(fileToUpload, uploadType);

    if (result.success) {
      toast.success("Image uploaded successfully!");
      setShowSaveButton(false);
      setimageFile(null);
      uploadCallback(result.data.fullPath);
    } else {
      toast.error("Error uploading image");
    }

    setUploading(false);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const imageSrc =
    previewUrl ||
    defaultImageUrl ||
    (uploadType === "companyImage"
      ? "/images/no-photo.png"
      : "/images/empty-image.png");

  const fileInput = (
    <input
      ref={inputRef}
      id="mysetting-image-input"
      onChange={handleImageChange}
      data-type="image"
      className="d-none"
      accept="image/png, image/gif, image/jpeg, image/jpg"
      type="file"
      name="chat-image"
    />
  );

  if (variant === "avatar") {
    return (
      <div className="upload-image-avatar-variant">
        <p className="upload-image-avatar-label">{label}</p>

        <div className="upload-image-avatar-wrapper">
          <Image
            className="upload-image-avatar-img"
            alt="profile-photo-settings"
            id="img_profile_photo_accsettings"
            src={imageSrc}
            width={140}
            height={140}
          />

          <button
            type="button"
            className="upload-image-avatar-camera"
            onClick={handleButtonClick}
            aria-label="Change profile photo"
          >
            {uploading ? (
              <CircularProgress size={14} style={{ color: "#fff" }} />
            ) : (
              <FontAwesomeIcon icon={faCamera} />
            )}
          </button>
        </div>

        <p className="upload-image-avatar-hint">
          JPG, PNG or GIF. Max size 2MB.
        </p>

        <button
          type="button"
          className="upload-image-avatar-change-btn"
          onClick={handleButtonClick}
        >
          <FontAwesomeIcon icon={faUpload} /> {imageFile ? "Change Photo" : "Select Photo"}
        </button>

        {showSaveButton && (
          <button
            type="button"
            className="upload-image-avatar-change-btn"
            onClick={() => handleSavePhoto()}
            disabled={uploading}
          >
            {uploading ? (
              <CircularProgress size={14} style={{ color: "#fff" }} />
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} /> Save Photo
              </>
            )}
          </button>
        )}

        {fileInput}
      </div>
    );
  }

  // default (eski) görünüm — diğer sayfalarda olduğu gibi
  return (
    <>
      <Image
        className="label-img border"
        alt="profile-photo-settings"
        id="img_profile_photo_accsettings"
        src={imageSrc}
        width={100}
        height={100}
      />
      <div className="upload-area">
        <div className="d-flex gap-2">
          <InoButton type="button" onClick={handleButtonClick}>
            <FontAwesomeIcon icon={faFileImage} /> Select Image
          </InoButton>
          {showSaveButton &&
            (uploading ? (
              <InoButton disabled={true} type="button" green>
                {" "}
                <CircularProgress size={12} /> Saving{" "}
              </InoButton>
            ) : (
              <InoButton type="button" green onClick={() => handleSavePhoto()}>
                <FontAwesomeIcon icon={faSave} /> Save Photo
              </InoButton>
            ))}
        </div>
        <p className="file-name-block personal">
          {imageFile?.name || "No File Chosen..."}
        </p>
        {fileInput}
      </div>
    </>
  );
};