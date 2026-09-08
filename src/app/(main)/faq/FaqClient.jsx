"use client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import React, { useState, useEffect } from "react";
import client from "@/utils/client";
import "./faq.css";
import InoLoading from "@/components/InoLoading/InoLoading";
import { toast } from "react-toastify";

const FaqClient = () => {
    const [faq, setResponseData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await client.get(
                    "/PublicContent/GetPublicContent/Faq"
                );

                if (response.data.success) {
                    const faqResponse = response.data.data;

                    if (faqResponse && Array.isArray(faqResponse.List)) {
                        setResponseData(faqResponse.List);
                    } else {
                        console.error("Expected an array but received:", faqResponse);
                    }
                } else {
                    toast.error("API response was not successful");
                }
            } catch (error) {
                console.log("Error fetching FAQ data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mb-4">
            <InoBreadcrumb linkName="Frequently Asked Questions" />

            <section className="card faq-section p-4">
                <h1 className="fw-bold mb-4">
                    Frequently Asked Questions
                </h1>

                {isLoading ? (
                    <InoLoading />
                ) : (
                    <div className="faq-list">
                        {faq.map((item, index) => (
                            <div className="faq-item mb-4" key={index}>
                                <h5 className="fw-bold mb-2">
                                    {item.Question}
                                </h5>

                                <div className="faq-answer">
                                    {item.Answer}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default FaqClient;