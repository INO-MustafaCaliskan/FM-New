import { FiInbox, FiLock } from "react-icons/fi";
import "./empty-state.css"

export default function EmptyState({
  title,
  description,
  type = "default",
}) {
  return (
    <div className={`empty-state ${type}`}>
      <div className="empty-state-icon">
        {type === "membership" ? <FiLock /> : <FiInbox />}
      </div>

      <h6>{title}</h6>
      <p>{description}</p>
    </div>
  );
}