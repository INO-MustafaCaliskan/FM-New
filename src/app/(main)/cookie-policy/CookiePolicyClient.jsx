
"use client";

import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import ContentPage from "@/components/ContentPage/ContentPage";
import { isAbsoluteUrl } from "next/dist/shared/lib/utils";




const CookiePolicyClient = () => {


  return (
    <div className="container d-flex flex-column">
      <InoBreadcrumb linkName="Cookie Policy" />

      <ContentPage payload="CookiePolicy" url="/PublicContent/GetPublicContent/" />
    </div>
  );
};

export default CookiePolicyClient;






