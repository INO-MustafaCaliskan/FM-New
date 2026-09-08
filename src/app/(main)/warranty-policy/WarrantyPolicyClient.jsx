"use client";

import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ContentPage from "@/components/ContentPage/ContentPage";
import { Container } from "react-bootstrap";




const WarrantyPolicyClient = () => {


    return (
        <Container >
            <InoBreadcrumb linkName="Warranty Policy" />
            <ContentPage payload="WarrantyPolicy" url="/PublicContent/GetPublicContent/" />
        </Container>
    );
};

export default WarrantyPolicyClient;



