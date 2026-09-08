"use client";

import { useQuotation } from "@/context/QuotationContext";

import {
  SHIPPING_TYPES,
  SHIPPING_TYPE_MAPPING,
} from "@/utils/quotationConstants";

export default function Step5ShippingType() {
  const { rfqData, setRfqData } = useQuotation();

  const shippingTypes = SHIPPING_TYPE_MAPPING[rfqData.shippingMode] || [];

  return (
    <>
      <h2 className="rfq-step-title">Choose Shipping Type</h2>

      <p className="rfq-subtitle">Select shipment type.</p>

     <div className="row">

  {shippingTypes.map((typeId) => {

    const type =
      SHIPPING_TYPES[typeId];

    return (

      <div
        key={type.id}
        className="col-md-3 mb-3 m-0 p-2"
      >

        <div
          className={`rfq-selection-card ${
            rfqData.shippingType === type.id
              ? "selected"
              : ""
          }`}
          onClick={() =>
            setRfqData((prev) => ({
              ...prev,
              shippingType: type.id,
            }))
          }
        >

          <h5>{type.name}</h5>

          <hr className="rfq-card-separator" />

          <p className="text-muted">
            Transport by {type.name}
          </p>

        </div>

      </div>

    );

  })}

</div>
    </>
  );
}
