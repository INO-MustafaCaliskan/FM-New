"use client";

import {
  DELIVERY_TERMS
} from "@/utils/quotationConstants";

import {
  useQuotation
} from "@/context/QuotationContext";

export default function Step2DeliveryTerm() {

  const {
    rfqData,
    setRfqData
  } = useQuotation();

  const handleSelectTerm = (termId) => {

    setRfqData(prev => ({
      ...prev,
      deliveryTerm: termId
    }));

  };

  return (
    <>
      <h2 className="rfq-step-title">
        Delivery Term
      </h2>

      <p className="rfq-subtitle">
        Select how your cargo will be delivered.
      </p>

      <div className="row">

        {DELIVERY_TERMS.map(item => (

          <div
            key={item.id}
            className="col-md-6 mb-3"
          >

            <div
              className={`rfq-selection-card ${
                rfqData.deliveryTerm === item.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleSelectTerm(item.id)
              }
            >

              <h5 className="mb-2">
                {item.title}
              </h5>

              <hr className="rfq-card-separator" />

              <p className="text-muted mb-0">
                {item.description}
              </p>

            </div>

          </div>

        ))}

      </div>
    </>
  );
}