import { Skeleton } from "@mui/material";
import React from "react";
import { UserDropdown } from "./UserDropdown";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserMenu = () => {
  const pathName = usePathname();
  const { user } = useUser();
  const canShowGetQuote =
    user &&
    [
      "3PLs & Logistics Services",
      "Freight Forwarder",
      "Customs Broker",
      "Maritime Transport",
      "Transportation",
    ].includes(user.categoryName);
  return (
    <>
      <div className="nav-first-item navbar-collapse-mobile">
        <Link
          href="/global-networkers"
          className={pathName?.startsWith("/global-networkers") ? "active-nav-link" : ""}
        >
          Global Networkers
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/my-network"
          className={pathName?.startsWith("/my-network") ? "active-nav-link" : ""}
        >
          My Networks
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/my-meetings"
          className={pathName?.startsWith("/my-meetings") ? "active-nav-link" : ""}
        >
          My Meetings
        </Link>
      </div>

      {canShowGetQuote && (
        <div className="navbar-collapse-mobile">
          <Link
            href="/get-quote"
            className={pathName?.startsWith("/get-quote") ? "active-nav-link" : ""}
          >
            Get Quote
          </Link>
        </div>
      )}
      <div className=" navbar-collapse-mobile">
        <Link
          href="/feed"
          className={pathName?.startsWith("/feed") ? "active-nav-link" : ""}
        >
          News Feed
        </Link>
      </div>
      <div className=" navbar-collapse-mobile">
        <Link
          href="/chat"
          className={pathName?.startsWith("/chat") ? "active-nav-link" : ""}
        >
          Chat
        </Link>
      </div>
      {!user ? (
        <Skeleton variant="rounded" height={20} width={100} />
      ) : (
        <UserDropdown />
      )}
    </>
  );
};

export default UserMenu;
