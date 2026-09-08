"use client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import "./aboutus.css";
import TeamCard from "@/components/HomeAboutUs/TeamCard";
import ContentPage from "@/components/ContentPage/ContentPage";
import client from "@/utils/client";
import {Suspense, useEffect, useState} from "react";
import AboutStructuredData from "@/components/Seo/AboutStructuredData";

const AboutUsClient = () => {
    const [teamData, setTeamData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await client.get(
                    "/PublicContent/GetPublicContent/AboutUs"
                );
                if (response) {
                    setTeamData(response.data.data.List);

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    return (
        <>
            <AboutStructuredData/>
            <div className="container">
                <InoBreadcrumb linkName="About Us"/>
                <section className="card ino-about-us p-4">
                    <ContentPage payload="AboutUs" url="/PublicContent/GetPublicContent/"/>
                    <div className="team-section">
                        <div className="team-list  col-12">
                            {teamData.map((teamMember) => (
                                <TeamCard
                                    key={teamMember.Id}
                                    className="col-3"
                                    title={teamMember.Title}
                                    name={teamMember.FullName}
                                    imageUrl={teamMember.ImageUrl}
                                    linkedinUrl={teamMember.LinkedinUrl}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutUsClient;
