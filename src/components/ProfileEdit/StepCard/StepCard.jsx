"use client";

import "./step-card.css";
import { FaArrowRightLong } from "react-icons/fa6";

export default function StepCard({
  step,
  title,
  description,
  children,
  onSave,
  loading = false,
}) {
  return (
    <section className="profile-edit-card">
      <div className="profile-edit-card-header">
        <div className="profile-edit-card-header-left">
          <div className="profile-edit-card-step">{step}</div>

          <div>
            <h2 className="profile-edit-card-title">{title}</h2>

            {description && (
              <p className="profile-edit-card-description">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="profile-edit-card-body">{children}</div>

      <div className="profile-edit-card-footer">
        <button
          className="profile-edit-save-button"
          onClick={onSave}
          disabled={loading}
          type="button"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <span>Save </span>
              <FaArrowRightLong className="profile-edit-save-button-icon" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
