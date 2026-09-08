"use client";

import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ContentPage from "@/components/ContentPage/ContentPage";




const PricingPolicyClient = () => {


    return (
        <div className="container d-flex flex-column">
            <InoBreadcrumb linkName="Privacy Policy" />

            <ContentPage payload="PrivacyPolicy" url="/PublicContent/GetPublicContent/" />

        </div>
    );
};

export default PricingPolicyClient;
