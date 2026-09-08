"use client";

import { SHIPPING_MODES } from "@/utils/quotationConstants";

import { useQuotation } from "@/context/QuotationContext";

export default function Step1ShippingMode() {
  const { rfqData, updateField } = useQuotation();

  const handleSelectMode = (modeId) => {
    updateField("shippingMode", modeId);
  };

  return (
    <>
      <h2 className="rfq-step-title">Choose Shipping Mode</h2>

      <p className="rfq-subtitle">
        Select the transportation method for your shipment.
      </p>

      <div className="row">
        {SHIPPING_MODES.map((mode) => {
          const Icon = mode.icon;

          return (
            <div key={mode.id} className="col-md-6 mb-3">
              <div
                className={`rfq-selection-card ${
                  rfqData.shippingMode === mode.id ? "selected" : ""
                }`}
                onClick={() => handleSelectMode(mode.id)}
              >
                <h5 className="mb-2 d-flex align-items-center gap-2">
                  <Icon className="shipping-mode-icon" />
                  {mode.title}
                </h5>

                <hr className="rfq-card-separator" />

                <p className="text-muted mb-0">{mode.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
