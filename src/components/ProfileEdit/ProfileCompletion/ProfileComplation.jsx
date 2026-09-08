"use client";

import "./profile-completion.css";
import { useRouter } from "next/navigation";


export default function ProfileCompletion({
  percentage = 82,
  title = "Profile Completion",
  slug
}) {
  const router = useRouter();
  const handlePreview = () => {
    if (!slug) return;

    router.push(`/user-profile/${slug}`);
  };
  return (
    <div className="profile-completion-card">
      <h3 className="profile-completion-title">
        {title}
      </h3>

      <div className="profile-progress-circle">
        <svg width="120" height="120">
          <circle
            className="progress-bg"
            cx="60"
            cy="60"
            r="48"
          />

          <circle
            className="progress-bar"
            cx="60"
            cy="60"
            r="48"
            style={{
              strokeDashoffset:
                302 - (302 * percentage) / 100,
            }}
          />
        </svg>

        <span>{percentage}%</span>
      </div>

      <p className="profile-completion-text">
        Great job! Complete the remaining sections to increase your visibility.
      </p>

     
      <button
        className="preview-profile-btn"
        onClick={handlePreview}
      >
        Preview My Profile
      </button>
    </div>
  );
}