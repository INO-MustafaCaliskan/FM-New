"use client"
import { useRouter } from "next/navigation";
import "./style.css";

import PartnersBanner from "../PartnersBanner/PartnersBanner";

const OurSolutionPartners = () => {
    const router = useRouter();
  return (
    <section className=" ">
      <div className="container">
        <div>
          <h2 className="title  title-primary">Our Solution Partners</h2>
          <p className="text-justify" style={{ lineHeight: 2 }}>
            Our solution partners, who help grow your business on a global
            scale, offer a wide range of services from digital learning
            platforms to online meeting solutions. With personalized learning
            programs and effective communication tools, we help you strengthen
            your competencies and connections.
          </p>

        </div>
           <div className=" mb-3">
          <button
            className="btn ino-button ino-button-outline "
            onClick={() => router.push("/solution-partners")}
          >
            View All Partners
          </button>
        </div>
        <div className="mt-5 pb-5">
          <PartnersBanner />
        </div>
      </div>

    </section>
  );
};

export default OurSolutionPartners;
