"use client";

import Switch from "react-switch";
import { useQuotation , createCargoDetail} from "@/context/QuotationContext";
import { WAGON_TYPES } from "@/utils/quotationConstants";
import DangerousGoodsCard from "@/components/Quotation/CargoCards/DangerousGoodsCard";
import InsuranceCard from "@/components/Quotation/CargoCards/InsuranceCard";
import CustomClearanceCard from "@/components/Quotation/CargoCards/CustomClearanceCard";
import { InoSelect } from "@/components/UI/InoSelect";
export default function SpecificWagonTypeForm() {
  const { rfqData, setRfqData } = useQuotation();

const updateCargo = (id, field, value) => {
  setRfqData((prev) => ({
    ...prev,
    cargoDetails: prev.cargoDetails.map((cargo) => {
      if (cargo.id !== id) return cargo;

      if (field === "oversizedCargo") {
        return value
          ? {
              ...cargo,
              oversizedCargo: true,

              // Normal alanları temizle
              quantity: 0,
              weight: 0,
            }
          : {
              ...cargo,
              oversizedCargo: false,

              // Oversized alanlarını temizle
              length: 0,
              width: 0,
              height: 0,
            };
      }

      return {
        ...cargo,
        [field]: value,
      };
    }),
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
      {rfqData.cargoDetails.map((cargo,index) => (
        <div key={cargo.id} className="rfq-cargo-row mt-3">
          <div className="row align-items-end">
            <div className="col-lg-3">
              <label className="form-label">Wagon Type</label>
              <InoSelect
                id={`wagonType-${cargo.id}`}
                name="wagonType"
                options={WAGON_TYPES.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
                value={
                  WAGON_TYPES.map((item) => ({
                    value: item.id,
                    label: item.title,
                  })).find(
                    (option) =>
                      String(option.value) === String(cargo.wagonType),
                  ) || null
                }
                onChange={(option) =>
                  updateCargo(cargo.id, "wagonType", option?.value || "")
                }
              />
            </div>

            {!cargo.oversizedCargo ? (
              <>
                <div className="col-lg-3">
                  <label className="form-label">Quantity of Wagons</label>
                  <input
                    type="number"
                    className="form-control"
                    value={cargo.quantity}
                    onChange={(e) =>
                      updateCargo(cargo.id, "quantity", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3">
                  <label className="form-label">Weight</label>
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
              </>
            ) : (
              <>
                <div className="col-lg-2">
                  <label className="form-label">Length</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={cargo.length}
                      onChange={(e) =>
                        updateCargo(cargo.id, "length", e.target.value)
                      }
                    />
                    <span className="input-group-text">m</span>
                  </div>
                </div>

                <div className="col-lg-2">
                  <label className="form-label">Width</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={cargo.width}
                      onChange={(e) =>
                        updateCargo(cargo.id, "width", e.target.value)
                      }
                    />
                    <span className="input-group-text">m</span>
                  </div>
                </div>

                <div className="col-lg-2">
                  <label className="form-label">Height</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={cargo.height}
                      onChange={(e) =>
                        updateCargo(cargo.id, "height", e.target.value)
                      }
                    />
                    <span className="input-group-text">m</span>
                  </div>
                </div>
              </>
            )}

            <div className="col-lg-2">
              <label className="form-label">Is Over Sized Cargo</label>
              <div className="mt-2">
                <Switch
                  checked={cargo.oversizedCargo}
                  onChange={(checked) =>
                    updateCargo(cargo.id, "oversizedCargo", checked)
                  }
                  height={18}
                  width={44}
                  handleDiameter={17}
                  checkedIcon={false}
                  uncheckedIcon={false}
                  activeBoxShadow={null}
                  boxShadow={null}
                  offColor="#d6d6d6"
                  onColor="#fd8d0d"
                />
              </div>
            </div>

            {index > 0 &&  (
              <div className="col-lg-1 mb-1">
                <button
                  type="button"
                  className="btn btn-danger"
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
