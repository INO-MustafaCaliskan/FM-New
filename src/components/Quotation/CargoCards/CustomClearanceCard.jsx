"use client";

import { useQuotation } from "@/context/QuotationContext";
import { TEMPERATURE_TYPES } from "@/utils/quotationConstants";
import { InoSelect } from "@/components/UI/InoSelect";
export default function CustomClearanceCard({
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
  const temperatureTypeOptions = TEMPERATURE_TYPES.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <div className="cargo-info-card">
      <div className="card-header">
        <h5>Custom Clearance</h5>
      </div>
      <div className="card-body">
        <div className="form-group cargo-cards-row mb-3">
          <label className="form-label">Need Custom Clearance</label>
          <div className="radio-group d-flex gap-3 mt-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="needCustomClearance"
                id="customs-yes"
                value="yes"
                checked={rfqData.needCustomClearance === "yes"}
                onChange={(e) =>
                  updateField("needCustomClearance", e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="customs-yes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="needCustomClearance"
                id="customs-no"
                value="no"
                checked={rfqData.needCustomClearance === "no"}
                onChange={(e) =>
                  updateField("needCustomClearance", e.target.value)
                }
              />
              <label className="form-check-label" htmlFor="customs-no">
                No
              </label>
            </div>
          </div>
        </div>

        {showStackable && (
          <div className="form-group cargo-cards-row mb-3">
            <label className="form-label">Is your cargo stackable?</label>
            <div className="radio-group d-flex gap-3 mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="cargoStackable"
                  id="stackable-yes"
                  value="yes"
                  checked={rfqData.cargoStackable === "yes"}
                  onChange={(e) =>
                    updateField("cargoStackable", e.target.value)
                  }
                />
                <label className="form-check-label" htmlFor="stackable-yes">
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="cargoStackable"
                  id="stackable-no"
                  value="no"
                  checked={rfqData.cargoStackable === "no"}
                  onChange={(e) =>
                    updateField("cargoStackable", e.target.value)
                  }
                />
                <label className="form-check-label" htmlFor="stackable-no">
                  No
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="cargoStackable"
                  id="stackable-notSure"
                  value="notSure"
                  checked={rfqData.cargoStackable === "notSure"}
                  onChange={(e) =>
                    updateField("cargoStackable", e.target.value)
                  }
                />
                <label className="form-check-label" htmlFor="stackable-notSure">
                  Not sure
                </label>
              </div>
            </div>
          </div>
        )}

        {showPerishable && (
          <>
            <div className="form-group cargo-cards-row mb-3">
              <label className="form-label">Is your cargo perishable?</label>
              <div className="radio-group d-flex gap-3 mt-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="isCargoPerishable"
                    id="perishable-yes"
                    value="yes"
                    checked={rfqData.isCargoPerishable === "yes"}
                    onChange={(e) =>
                      updateField("isCargoPerishable", e.target.value)
                    }
                  />
                  <label className="form-check-label" htmlFor="perishable-yes">
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="isCargoPerishable"
                    id="perishable-no"
                    value="no"
                    checked={rfqData.isCargoPerishable === "no"}
                    onChange={(e) =>
                      updateField("isCargoPerishable", e.target.value)
                    }
                  />
                  <label className="form-check-label" htmlFor="perishable-no">
                    No
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="isCargoPerishable"
                    id="perishable-notSure"
                    value="notSure"
                    checked={rfqData.isCargoPerishable === "notSure"}
                    onChange={(e) =>
                      updateField("isCargoPerishable", e.target.value)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="perishable-notSure"
                  >
                    Not sure
                  </label>
                </div>
              </div>
            </div>

            {showTemperature && (
              <>
                <div className="form-group mb-3">
                  <label className="form-label">Temperature Type</label>
                  <InoSelect
                    id="temperatureType"
                    name="temperatureType"
                    placeholder="Temperature Type"
                    options={temperatureTypeOptions}
                    value={
                      temperatureTypeOptions.find(
                        (option) =>
                          String(option.value) ===
                          String(rfqData.temperatureType),
                      ) || null
                    }
                    onChange={(option) =>
                      updateField("temperatureType", option?.value || "")
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Temperature Regime</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Temperature Regime"
                    value={rfqData.temperatureRegime}
                    onChange={(e) =>
                      updateField("temperatureRegime", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
