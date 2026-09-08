"use client";

import { useQuotation } from "@/context/QuotationContext";
import { IMO_CLASSES } from "@/utils/quotationConstants";
import { InoSelect } from "@/components/UI/InoSelect";
export default function DangerousGoodsCard({
  showStackable = false,
  showPerishable = false,
  showTemperature = false,
}) {
  const { rfqData, setRfqData } = useQuotation();

  const updateField = (field, value) => {
    setRfqData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const imoClassOptions = IMO_CLASSES.map((item) => ({
  value: item.id,
  label: item.title,
}));
  return (
    <div className="cargo-info-card">
      <div className="card-header">
        <h5>Dangerous Goods</h5>
      </div>
      <div className="card-body">
        <div className="form-group  cargo-cards-row mb-3">
          <label className="form-label">Is Cargo Hazardous?</label>
          <div className="radio-group d-flex gap-3 mt-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isCargoHazardous"
                id="hazardous-yes"
                value="yes"
                checked={rfqData.isCargoHazardous === "yes"}
                onChange={(e) =>
                  updateField("isCargoHazardous", e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="hazardous-yes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isCargoHazardous"
                id="hazardous-no"
                value="no"
                checked={rfqData.isCargoHazardous === "no"}
                onChange={(e) =>
                  updateField("isCargoHazardous", e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="hazardous-no">
                No
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="isCargoHazardous"
                id="hazardous-notSure"
                value="notSure"
                checked={rfqData.isCargoHazardous === "notSure"}
                onChange={(e) =>
                  updateField("isCargoHazardous", e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="hazardous-notSure">
                Not sure
              </label>
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="form-label">IMO Class</label>
          <InoSelect
            id="imoClass"
            placeholder="Please Select IMO Class."
            name="imoClass"
            options={imoClassOptions}
            value={
              imoClassOptions.find(
                (option) => String(option.value) === String(rfqData.imoClass),
              ) || null
            }
            onChange={(option) => updateField("imoClass", option?.value || "")}
          />
        </div>

        <div className="form-group">
          <label className="form-label">UN Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="UN Number"
            value={rfqData.unNumber}
            onChange={(e) => updateField("unNumber", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
