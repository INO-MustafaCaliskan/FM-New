"use client";

import { useQuotation } from "@/context/QuotationContext";
import CargoFormDispatcher from "./forms/CargoFormDispatcher";

export default function Step6CargoDetails() {
  const { rfqData } = useQuotation();

  return (
    <>
      <h2 className="rfq-step-title">
        Cargo Details
      </h2>

      

      <div className="card mt-1 ">
        <CargoFormDispatcher />
      </div>
    </>
  );
}