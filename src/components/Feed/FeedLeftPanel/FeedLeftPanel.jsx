import ProfileCard from "./components/ProfileCard"
import LastActiveUsers from "./components/LastActiveUsers/LastActiveUsers";
import PanelLink from "./components/PanelLink";
import { useUser } from "@/context/UserContext";

const FeedLeftPanel = () => {
  return (
    <div className="d-flex flex-column gap-2">
      <ProfileCard />
      <LastActiveUsers />
    </div>
  )
}

export default FeedLeftPanel