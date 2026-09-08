"use client";

import { useQuotation, createCargoDetail} from "@/context/QuotationContext";
import DangerousGoodsCard from "@/components/Quotation/CargoCards/DangerousGoodsCard";
import InsuranceCard from "@/components/Quotation/CargoCards/InsuranceCard";
import CustomClearanceCard from "@/components/Quotation/CargoCards/CustomClearanceCard";

export default function BreakbulkCargoForm() {
  const { rfqData, setRfqData } = useQuotation();

  const updateCargo = (id, field, value) => {
    setRfqData((prev) => ({
      ...prev,
      cargoDetails: prev.cargoDetails.map((cargo) =>
        cargo.id === id
          ? {
              ...cargo,
              [field]: value,
            }
          : cargo,
      ),
    }));
  };

  const updateField = (field, value) => {
    setRfqData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addCargo = () => {
    setRfqData((prev) => ({
      ...prev,
      cargoDetails: [
        ...prev.cargoDetails,
        {
          ...createCargoDetail(),
        },
      ],
    }));
  };

  const removeCargo = (id) => {
    setRfqData((prev) => ({
      ...prev,
      cargoDetails: prev.cargoDetails.filter((cargo) => cargo.id !== id),
    }));
  };

  return (
    <>
      <div className="mb-3">
        <h6>Breakbulk</h6>
      </div>

      {rfqData.cargoDetails.map((cargo,index) => (
        <div key={cargo.id} className="rfq-cargo-row">
          <div className="row align-items-end">
            <div className="col-lg-3 form-group mb-0">
              <label className="form-label">Gross Weight</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={cargo.weight}
                  onChange={(e) =>
                    updateCargo(cargo.id, "weight", e.target.value)
                  }
                />
                <span className="input-group-text">mt</span>
              </div>
            </div>

            <div className="col-lg-3 form-group mb-0">
              <label className="form-label">Loading Rate</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={cargo.loadingRate}
                  onChange={(e) =>
                    updateCargo(cargo.id, "loadingRate", e.target.value)
                  }
                />
                <span className="input-group-text">mt/day</span>
              </div>
            </div>

            <div className="col-lg-3 form-group mb-0">
              <label className="form-label">Discharging Rate</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={cargo.dischargingRate}
                  onChange={(e) =>
                    updateCargo(cargo.id, "dischargingRate", e.target.value)
                  }
                />
                <span className="input-group-text">mt/day</span>
              </div>
            </div>

            {index > 0 && (
              <div className="col-lg-3 mb-1">
                <button
                  type="button"
                  className="btn btn-danger  "
                  onClick={() => removeCargo(cargo.id)}
                >
                  X
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="rfq-next-btn"
        style={{ width: "90px" }}
        onClick={addCargo}
      >
        Add +
      </button>

      <div className="form-group mt-4">
        <label className="form-label">Product Description</label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Description + (HS/HTS Code of the product if available)"
          value={rfqData.productDescription}
          onChange={(e) => updateField("productDescription", e.target.value)}
        />
      </div>

      <div className="cargo-cards-container mt-4">
        <div className="row">
          <div className="col-lg-4">
            <DangerousGoodsCard />
          </div>
          <div className="col-lg-4">
            <InsuranceCard />
          </div>
          <div className="col-lg-4">
            <CustomClearanceCard />
          </div>
        </div>
      </div>
    </>
  );
}
