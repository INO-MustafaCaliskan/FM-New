"use client";

import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ContentPage from "@/components/ContentPage/ContentPage";




const TermsAndConditionsClient = () => {


    return (
        <div className="container d-flex flex-column">
            <InoBreadcrumb linkName="Terms and Conditions" />

            <ContentPage payload="TermsAndConditions" url="/PublicContent/GetPublicContent/" />
        </div>
    );
};

export default TermsAndConditionsClient;



