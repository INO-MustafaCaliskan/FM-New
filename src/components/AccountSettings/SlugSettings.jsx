"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiEdit2, FiLink, FiSave, FiX, FiInfo, FiCheck } from "react-icons/fi";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import client from "@/utils/client";
import { useUser } from "@/context/UserContext";
import "./slug-settings.css";

export const SlugSettings = () => {
  const { user, refreshUser } = useUser();
  const [slug, setSlug] = useState("");
  const [slugEdit, setSlugEdit] = useState("");
  const [slugEditing, setSlugEditing] = useState(false);
  const [slugLoading, setSlugLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const slugInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const initialSlug = user.slug || "";
      setSlug(initialSlug);
      setSlugEdit(initialSlug);
      setPageLoading(false);
    }
  }, [user]);

  const handleSlugEdit = () => {
    setSlugEditing(true);
    setTimeout(() => slugInputRef.current?.focus(), 50);
  };

  const handleSlugCancel = () => {
    setSlugEdit(slug);
    setSlugEditing(false);
  };

  const handleSlugSave = async () => {
    const isFormatValid = /^[a-z0-9-]+$/.test(slugEdit);
    const isEdgeValid = !slugEdit.startsWith("-") && !slugEdit.endsWith("-");
    const isConsecutiveValid = !slugEdit.includes("--");
    const isLengthValid = slugEdit.length <= 100;
    const hasInput = slugEdit.trim().length > 0;

    if (!hasInput || !isFormatValid || !isEdgeValid || !isConsecutiveValid || !isLengthValid) return;
    try {
      setSlugLoading(true);
      const response = await client.post("/User/UpdateSlug", {
        slug: slugEdit.trim(),
      });
      if (response.data?.success) {
        setSlug(slugEdit.trim());
        setSlugEditing(false);
        toast.success("Profile URL updated successfully.");
        if (refreshUser) refreshUser();
      } else {
        toast.error(response.data?.message || "Failed to update profile URL.");
      }
    } catch {
      toast.error("Failed to update profile URL.");
    } finally {
      setSlugLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="ss-loading">
        <div className="ss-spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="ss-wrapper">

      {/* ── Section Title ── */}
      <div className="ss-section-title">
        <div className="ss-section-icon">
          <FiLink size={16} />
        </div>
        <div>
          <h5 className="ss-title">Profile URL</h5>
          <p className="ss-subtitle">Customize the public web address of your profile.</p>
        </div>
      </div>

      {/* ── URL Input Area ── */}
      <div className="ss-field-group">
        <p className="ss-label">Your Profile URL</p>

        <div className={`ss-input-wrapper ${slugEditing ? "ss-input-wrapper--active" : ""}`}>
          <span className="ss-input-prefix">freighttalk.com/user-profile/</span>

          <input
            ref={slugInputRef}
            className="ss-input talk-form-control"
            value={slugEdit}
            disabled={!slugEditing}
            onChange={(e) => setSlugEdit(e.target.value.toLowerCase())}
            placeholder="your-profile-url"
          />

          <span className="ss-input-suffix">/</span>

          {!slugEditing ? (
            <button
              type="button"
              className="ss-icon-btn ss-icon-btn--edit"
              onClick={handleSlugEdit}
              title="Edit"
            >
              <FiEdit2 size={14} />
            </button>
          ) : (
            <div className="ss-btn-group">
              <button
                type="button"
                className="ss-icon-btn ss-icon-btn--save"
                onClick={handleSlugSave}
                disabled={
                  slugLoading ||
                  !slugEdit.trim() ||
                  slugEdit.length > 100 ||
                  !/^[a-z0-9-]+$/.test(slugEdit) ||
                  slugEdit.startsWith("-") ||
                  slugEdit.endsWith("-") ||
                  slugEdit.includes("--")
                }
                title="Save"
              >
                {slugLoading ? <div className="ss-btn-spinner" /> : <FiSave size={14} />}
              </button>
              <button
                type="button"
                className="ss-icon-btn ss-icon-btn--cancel"
                onClick={handleSlugCancel}
                disabled={slugLoading}
                title="Cancel"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>

        {slugEditing ? (
          <div className="ss-criteria-list">
            <div className={`ss-criterion ${slugEdit.length > 0 ? (/^[a-z0-9-]+$/.test(slugEdit) ? "ss-criterion--valid" : "ss-criterion--invalid") : ""}`}>
              {slugEdit.length > 0 && !/^[a-z0-9-]+$/.test(slugEdit) ? (
                <FiX className="ss-criterion-icon" size={14} />
              ) : (
                <FiCheck className="ss-criterion-icon" size={14} />
              )}
              <span>Only lowercase letters, numbers, and hyphens</span>
            </div>
            
            <div className={`ss-criterion ${slugEdit.length > 0 ? (!slugEdit.startsWith("-") && !slugEdit.endsWith("-") ? "ss-criterion--valid" : "ss-criterion--invalid") : ""}`}>
              {slugEdit.length > 0 && (slugEdit.startsWith("-") || slugEdit.endsWith("-")) ? (
                <FiX className="ss-criterion-icon" size={14} />
              ) : (
                <FiCheck className="ss-criterion-icon" size={14} />
              )}
              <span>Cannot start or end with a hyphen</span>
            </div>

            <div className={`ss-criterion ${slugEdit.length > 0 ? (!slugEdit.includes("--") ? "ss-criterion--valid" : "ss-criterion--invalid") : ""}`}>
              {slugEdit.length > 0 && slugEdit.includes("--") ? (
                <FiX className="ss-criterion-icon" size={14} />
              ) : (
                <FiCheck className="ss-criterion-icon" size={14} />
              )}
              <span>Cannot contain consecutive hyphens</span>
            </div>

            <div className={`ss-criterion ${slugEdit.length > 0 ? (slugEdit.length <= 100 ? "ss-criterion--valid" : "ss-criterion--invalid") : ""}`}>
              {slugEdit.length > 100 ? (
                <FiX className="ss-criterion-icon" size={14} />
              ) : (
                <FiCheck className="ss-criterion-icon" size={14} />
              )}
              <span>Maximum 100 characters</span>
            </div>
          </div>
        ) : (
          <p className="ss-hint">
            Click the edit icon to customize your profile URL.
          </p>
        )}
      </div>

      {/* ── Divider ── */}
      <hr className="ss-divider" />

      {/* ── Info Cards ── */}
      <div className="ss-info-section">
        <p className="ss-info-heading">
          <FiInfo size={13} />
          About Profile URLs
        </p>
        <div className="ss-info-grid">
          <div className="ss-info-card">
            <span className="ss-info-dot" />
            <div>
              <p className="ss-info-q">What is a Profile URL?</p>
              <p className="ss-info-text">
                A unique web address for your public profile — easy to share and improves search visibility.
              </p>
            </div>
          </div>
          <div className="ss-info-card">
            <span className="ss-info-dot" />
            <div>
              <p className="ss-info-q">Auto-generated</p>
              <p className="ss-info-text">
                Created from your first and last name automatically.
              </p>
              <code className="ss-info-code">…/john-doe/</code>
            </div>
          </div>
          <div className="ss-info-card">
            <span className="ss-info-dot" />
            <div>
              <p className="ss-info-q">URL conflicts</p>
              <p className="ss-info-text">
                If already taken, a number is appended automatically.
              </p>
              <code className="ss-info-code">…/john-doe-1/</code>
            </div>
          </div>
          <div className="ss-info-card">
            <span className="ss-info-dot" />
            <div>
              <p className="ss-info-q">Tips</p>
              <p className="ss-info-text">
                Keep it short, memorable, and professional.
              </p>
              <code className="ss-info-code">…/john-doe-logistics/</code>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
