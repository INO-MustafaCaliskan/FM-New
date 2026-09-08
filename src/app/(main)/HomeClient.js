"use client";
import { useEffect, useState } from "react";
import Benefits from "@/components/HomePageItems/Benefits/Benefits";
import MobileApp from "@/components/HomePageItems/MobileApp/MobileApp";
import Showcase from "@/components/HomePageItems/Showcase/Showcase";
import StarterBanner from "@/components/HomePageItems/StarterBanner/StarterBanner";
import Using from "@/components/HomePageItems/Using/Using";
import What from "@/components/HomePageItems/What/What";
import Testimonials from "@/components/HomePageItems/Testimonials/Testimonials.jsx";
import InoLoading from "@/components/InoLoading/InoLoading.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import client from "@/utils/client";
import Cookies from "js-cookie";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import OurSolutionPartners from "@/components/OurSolutionPartners/OurSolutionPartners";
import HomeStructuredData from "@/components/Seo/HomeStructuredData";
import LiveNowBanner from "@/components/LiveNowBanner/LiveNowBanner";
import LiveActivity from "@/components/LiveActivity/LiveActivity";
import FreightQuote from "@/components/FreightQuote/FreightQuote";
import TopFreightTalkUsers from "@/components/TopFreightTalkUsers/TopFreightTalkUsers";

export default function Home() {
  const [isModalVisible, setModalVisible] = useState(true);
  const [content, setContent] = useState({});
  const [isPreload, setPreload] = useState(true);
  const { user, loading } = useUser();

  const payload = [
    "Showcase",
    "What",
    "StarterBanner",
    "MobileBanner",
    "Benefit",
    "PricingPage",
    "Testimonial",
    "UsingMember",
    "TermsAndConditions",
  ];

  useEffect(() => {
    const cookieAccepted = Cookies.get("cookie-policy-accepted") === "true";
    if (cookieAccepted) {
      setModalVisible(false);
    }
    const fetchData = async () => {
      try {
        const response = await client.post(
          "/PublicContent/GetPublicContents",
          payload,
        );
        const contentData = {};

        if (response && Array.isArray(response.data.data)) {
          response.data.data.forEach((item) => {
            contentData[item.key] = item.value;
          });
          setContent(contentData);
          setPreload(false);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleCookieAccept = () => {
    setModalVisible(false);
    Cookies.set("cookie-policy-accepted", true, {
      expires: 7,
    });
  };

  return (
    <>
      {isModalVisible && (
        <div className="cookie_confirm">
          <button className="cookie_confirm-btn" onClick={handleCookieAccept}>
            <FontAwesomeIcon className="cookie-icon" icon={faX} />
          </button>
          <div className="text_wrap">
            <p>
              We use cookies in accordance with legal regulations to provide you
              with a better experience. For detailed information, you can review
              our{" "}
              <Link href="/cookie-policy">
                <u>cookie policy</u>
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      )}
      {isPreload ? (
        <InoLoading />
      ) : (
        <>
          <HomeStructuredData />
          <Showcase data={content.Showcase} />
          <LiveNowBanner avatars={content.UsingMember?.List} />
          <FreightQuote />
          <TopFreightTalkUsers />
          <What data={content.What} />
          <LiveActivity />
          <Using data={content.UsingMember} />
          {!user && <StarterBanner data={content.StarterBanner} />}
          <Benefits data={content.Benefit} />
          <MobileApp data={content.MobileBanner} />
          <Testimonials data={content.Testimonial} />
          <OurSolutionPartners />
        </>
      )}
    </>
  );
}
