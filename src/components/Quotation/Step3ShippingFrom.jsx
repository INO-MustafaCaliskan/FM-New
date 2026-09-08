"use client";

import { useEffect } from "react";

import { CountrySelect } from "@/components/UI/CountrySelect";

import { useQuotation } from "@/context/QuotationContext";

export default function Step3ShippingFrom() {
  const { rfqData, setRfqData } = useQuotation();

  const showPickUpAddress =
    rfqData.deliveryTerm === 1 ||
    rfqData.deliveryTerm === 3;

  useEffect(() => {
    if (
      rfqData.deliveryTerm === 2 ||
      rfqData.deliveryTerm === 4
    ) {
      setRfqData((prev) => ({
        ...prev,
        pickUpAddress: "",
      }));
    }
  }, [rfqData.deliveryTerm, setRfqData]);

  return (
    <>
      <p className="rfq-step-title">
        Where Are You Shipping From?
      </p>

      <div className="row mt-4">
        <div className="col-md-6">
          <CountrySelect
            label="From Country"
            placeholder="Pick a Country..."
            value={rfqData.shippingFromCountryId}
            onChange={(selected) => {
              setRfqData((prev) => ({
                ...prev,
                shippingFromCountryId:
                  selected?.value || null,
              }));
            }}
          />
        </div>

        <div className="col-md-6 form-group mt-3 mt-md-0">
          <label className="form-label">
            Port (or City) of Loading
          </label>

          <input
            type="text"
            className="talk-form-control form-control"
            placeholder="Enter city or port of origin"
            value={rfqData.portOfLoading}
            onChange={(e) =>
              setRfqData((prev) => ({
                ...prev,
                portOfLoading: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {showPickUpAddress && (
        <div className="form-group mt-3">
          <label className="form-label">
            Pick Up Address
          </label>

          <textarea
            rows={4}
            className="talk-form-control form-control"
            placeholder="Full pick up address (including city and zip code)"
            value={rfqData.pickUpAddress}
            onChange={(e) =>
              setRfqData((prev) => ({
                ...prev,
                pickUpAddress: e.target.value,
              }))
            }
          />
        </div>
      )}
    </>
  );
}