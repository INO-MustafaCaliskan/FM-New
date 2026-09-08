"use client";

import { useEffect } from "react";

import { CountrySelect } from "@/components/UI/CountrySelect";

import { useQuotation } from "@/context/QuotationContext";

export default function Step4ShippingTo() {
  const { rfqData, setRfqData } = useQuotation();

  const showDeliveryAddress =
    rfqData.deliveryTerm === 1 ||
    rfqData.deliveryTerm === 4;

  useEffect(() => {
    if (
      rfqData.deliveryTerm === 2 ||
      rfqData.deliveryTerm === 3
    ) {
      setRfqData((prev) => ({
        ...prev,
        deliveryAddress: "",
      }));
    }
  }, [rfqData.deliveryTerm, setRfqData]);

  return (
    <>
      <h2 className="rfq-step-title">
        Where Are You Shipping To?
      </h2>

      <div className="row mt-4">
        <div className="col-md-6">
          <CountrySelect
            label="To Country"
            placeholder="Pick a Country..."
            value={rfqData.shippingToCountryId}
            onChange={(selected) => {
              setRfqData((prev) => ({
                ...prev,
                shippingToCountryId:
                  selected?.value || null,
              }));
            }}
          />
        </div>

        <div className="col-md-6 form-group mt-3 mt-md-0">
          <label className="form-label">
            Port (or City) of Destination
          </label>

          <input
            type="text"
            className="talk-form-control form-control"
            placeholder="Enter city or port of destination"
            value={rfqData.portOfDestination}
            onChange={(e) =>
              setRfqData((prev) => ({
                ...prev,
                portOfDestination: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {showDeliveryAddress && (
        <div className="form-group mt-3">
          <label className="form-label">
            Delivery Address
          </label>

          <textarea
            rows={4}
            className="talk-form-control form-control"
            placeholder="Delivery address (including city and zip code)"
            value={rfqData.deliveryAddress}
            onChange={(e) =>
              setRfqData((prev) => ({
                ...prev,
                deliveryAddress: e.target.value,
              }))
            }
          />
        </div>
      )}
    </>
  );
}