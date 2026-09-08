"use client";

import { useQuotation , createCargoDetail } from "@/context/QuotationContext";
import { ULD_CONTAINER_TYPES } from "@/utils/quotationConstants";
import DangerousGoodsCard from "@/components/Quotation/CargoCards/DangerousGoodsCard";
import InsuranceCard from "@/components/Quotation/CargoCards/InsuranceCard";
import CustomClearanceCard from "@/components/Quotation/CargoCards/CustomClearanceCard";
import { InoSelect } from "@/components/UI/InoSelect";
export default function ULDContainerForm() {
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

  const calculateTotals = () => {
    let totalQuantity = 0;
    let totalWeight = 0;

    rfqData.cargoDetails.forEach((cargo) => {
      totalQuantity += parseInt(cargo.quantity || 0);
      totalWeight += parseFloat(cargo.weight || 0);
    });

    return {
      totalQuantity: Math.round(totalQuantity),
      totalWeight: totalWeight,
    };
  };

  const totals = calculateTotals();

  return (
    <>
      {rfqData.cargoDetails.map((cargo,index) => (
        <div key={cargo.id} className="rfq-cargo-row mt-3">
          <div className="row align-items-end">
            <div className="col-lg-4 form-group mb-0">
              <label className="form-label">Container Type</label>
              <InoSelect
                id={`uldContainerType-${cargo.id}`}
                name="uldContainerType"
                options={ULD_CONTAINER_TYPES.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
                value={
                  ULD_CONTAINER_TYPES.map((item) => ({
                    value: item.id,
                    label: item.title,
                  })).find((option) => option.value === cargo.uldContainerType) ||
                  null
                }
                onChange={(option) =>
                  updateCargo(cargo.id, "uldContainerType", option?.value || "")
                }
              />
            </div>

            <div className="col-lg-3 form-group mb-0">
              <label className="form-label">Quantity of Containers</label>
              <input
                type="number"
                className="form-control"
                value={cargo.quantity}
                onChange={(e) =>
                  updateCargo(cargo.id, "quantity", e.target.value)
                }
              />
            </div>

            <div className="col-lg-3 form-group mb-0">
              <label className="form-label"> Gross Weight</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={cargo.weight}
                  onChange={(e) =>
                    updateCargo(cargo.id, "weight", e.target.value)
                  }
                />
                <span className="input-group-text">kg</span>
              </div>
            </div>

            {index > 0 && (
              <div className="col-lg-2 mb-1">
                <button
                  type="button"
                  className="btn btn-danger "
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

      <div className="row rfq-cargo-row  mb-1 mt-4 gap-2">
        <div className="col-lg-3 form-group mb-0">
          <label className="form-label">Total ULD Container Quantity</label>
          <input
            type="text"
            className="form-control"
            value={totals.totalQuantity}
            disabled
          />
        </div>
        <div className="col-lg-3 form-group mb-0">
          <label className="form-label">Total Weight</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={totals.totalWeight}
              disabled
            />
            <span className="input-group-text">kg</span>
          </div>
        </div>
      </div>

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
            <CustomClearanceCard
              showStackable={true}
              showPerishable={true}
              showTemperature={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
