"use client";
import "@/components/Pricing/pricing.css";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import InoLoading from "@/components/InoLoading/InoLoading.jsx";
import React, { useState, useEffect } from "react";
import client from "@/utils/client";
import PlanDetail from "@/components/Pricing/PlanDetail";
import PricingCards from "@/components/Pricing/PricingCards";
import { useUser } from "@/context/UserContext";
import { NonUserHeader } from "@/components/Pricing/NonUserHeader";
import { PricingHeader } from "@/components/Pricing/PricingHeader";

const PricingClient = () => {
    const [pricingCardsData, setPricingCardsData] = useState(null);
    const [pricingInfo, setPricingInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { user, loading } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            const response = await client.get(
                "/SubscriptionPackage/GetSubscriptionPackagesWithFeatures"
            );
            const responseData = response.data.data;

            const pricingResponse = await client.get(
                "/PublicContent/GetPublicContent/PricingPage"
            );
            const pricingInfo = pricingResponse.data.data;

            setPricingCardsData(responseData);
            setPricingInfo(pricingInfo);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleSelectPlan = (plan) => {
        if (user)
            setSelectedPlan(plan);
        else
            window.location.href = "/sign-up";
    };

    if (isLoading || loading)
        return <InoLoading />

    return (
        <>
            <div className="container d-flex flex-column">
                <InoBreadcrumb linkName="Pricing" />
                {
                    !user && <NonUserHeader pricingInfo={pricingInfo} />
                }
                <div className="card p-3 p-md-0 p-xl-5">
                    <div className="card-body ">
                        <PricingHeader title={pricingInfo.PricingCardTitle} description={pricingInfo.PricingCardDescription} />
                        {selectedPlan ? (
                            <PlanDetail plan={selectedPlan} onBack={() => setSelectedPlan(null)} />
                        ) : (
                            <PricingCards
                                isAuth={!!user}
                                pricingCards={pricingCardsData}
                                onSelectPlan={handleSelectPlan}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PricingClient;


