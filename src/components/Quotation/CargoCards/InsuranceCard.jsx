"use client";

import { useQuotation } from "@/context/QuotationContext";
import { CURRENCIES } from "@/utils/quotationConstants";
import { InoSelect } from "@/components/UI/InoSelect";
export default function InsuranceCard() {
  const { rfqData, setRfqData } = useQuotation();

  const updateField = (field, value) => {
    setRfqData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currencyOptions = CURRENCIES.map((item) => ({
    value: item.code,
    label: `${item.code} - ${item.title}`,
  }));

  return (
    <div className="cargo-info-card">
      <div className="card-header">
        <h5>Insurance</h5>
      </div>
      <div className="card-body">
        <div className="form-group cargo-cards-row  mb-3">
          <label className="form-label">Do you need cargo insurance?</label>
          <div className="radio-group d-flex gap-3 mt-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="needInsurance"
                id="insurance-yes"
                value="yes"
                checked={rfqData.needInsurance === "yes"}
                onChange={(e) => updateField("needInsurance", e.target.value)}
              />
              <label className="form-check-label" htmlFor="insurance-yes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="needInsurance"
                id="insurance-no"
                value="no"
                checked={rfqData.needInsurance === "no"}
                onChange={(e) => updateField("needInsurance", e.target.value)}
              />
              <label className="form-check-label" htmlFor="insurance-no">
                No
              </label>
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Value of Goods</label>
          <InoSelect
            id="insuranceCurrency"
            name="insuranceCurrency"
            placeholder="Currency"
            options={currencyOptions}
            value={
              currencyOptions.find(
                (option) => option.value === rfqData.insuranceCurrency,
              ) || null
            }
            onChange={(option) =>
              updateField("insuranceCurrency", option?.value || "")
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            value={rfqData.insuranceAmount}
            onChange={(e) => updateField("insuranceAmount", e.target.value)}
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
}
