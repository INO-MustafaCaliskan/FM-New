"use client";

import Switch from "react-switch";

import { useQuotation, createCargoDetail } from "@/context/QuotationContext";
import { InoSelect } from "@/components/UI/InoSelect";
import { CONTAINER_TYPES } from "@/utils/quotationConstants";

import DangerousGoodsCard from "@/components/Quotation/CargoCards/DangerousGoodsCard";
import InsuranceCard from "@/components/Quotation/CargoCards/InsuranceCard";
import CustomClearanceCard from "@/components/Quotation/CargoCards/CustomClearanceCard";

export default function FCLCargoForm() {
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
  const toggleOversizedCargo = (id, checked) => {
    setRfqData((prev) => ({
      ...prev,
      cargoDetails: prev.cargoDetails.map((cargo) => {
        if (cargo.id !== id) return cargo;

        if (checked) {
          // Oversized seçildi
          return {
            ...cargo,
            oversizedCargo: true,

            // Artık kullanılmayacak alanlar
            quantity: 0,
            weight: 0,
          };
        }

        // Oversized kapatıldı
        return {
          ...cargo,
          oversizedCargo: false,

          // Artık kullanılmayacak alanlar
          length: 0,
          width: 0,
          height: 0,
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
      {rfqData.cargoDetails.map((cargo, index) => (
        <div key={cargo.id} className="rfq-cargo-row">
          <div className="row align-items-end">
            <div className="col-lg-3 form-group mb-0">
              <InoSelect
                label="Container Type"
                id={`containerType-${cargo.id}`}
                name="containerType"
                options={CONTAINER_TYPES.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
                value={
                  CONTAINER_TYPES.map((item) => ({
                    value: item.id,
                    label: item.title,
                  })).find((option) => option.value === cargo.containerType) ||
                  null
                }
                onChange={(option) =>
                  updateCargo(cargo.id, "containerType", option?.value || "")
                }
              />
            </div>

            {!cargo.oversizedCargo ? (
              <>
                <div className="col-lg-3 form-group mb-0">
                  <label className="form-label">Quantity Of Containers</label>

                  <input
                    type="number"
                    className="talk-form-control form-control"
                    value={cargo.quantity}
                    onChange={(e) =>
                      updateCargo(cargo.id, "quantity", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 form-group mb-0">
                  <label className="form-label">
                    Cargo Weight (per container)
                  </label>

                  <div className="input-group">
                    <input
                      type="number"
                      className="talk-form-control form-control"
                      value={cargo.weight}
                      onChange={(e) =>
                        updateCargo(cargo.id, "weight", e.target.value)
                      }
                    />

                    <span className="input-group-text">kg</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-lg-2 form-group mb-0">
                  <label className="form-label">Length</label>

                  <div className="input-group">
                    <input
                      type="number"
                      className="talk-form-control form-control"
                      value={cargo.length}
                      onChange={(e) =>
                        updateCargo(cargo.id, "length", e.target.value)
                      }
                    />

                    <span className="input-group-text">m</span>
                  </div>
                </div>

                <div className="col-lg-2 form-group mb-0">
                  <label className="form-label">Width</label>

                  <div className="input-group">
                    <input
                      type="number"
                      className="talk-form-control form-control"
                      value={cargo.width}
                      onChange={(e) =>
                        updateCargo(cargo.id, "width", e.target.value)
                      }
                    />

                    <span className="input-group-text">m</span>
                  </div>
                </div>

                <div className="col-lg-2 form-group mb-0">
                  <label className="form-label">Height</label>

                  <div className="input-group">
                    <input
                      type="number"
                      className="talk-form-control form-control"
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

            <div className="col-lg-2 ">
              <label className="form-label">Is Over Sized Cargo</label>

              <div className="mt-2">
                <Switch
                  checked={cargo.oversizedCargo}
                  onChange={(checked) =>
                    toggleOversizedCargo(cargo.id, checked)
                  }
                  height={21}
                  width={44}
                  handleDiameter={18}
                  checkedIcon={false}
                  uncheckedIcon={false}
                  activeBoxShadow={null}
                  boxShadow={null}
                  offColor="#d6d6d6"
                  onColor="#fd8d0d"
                />
              </div>
            </div>

            {index > 0 && (
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

      <div className="cargo-cards-container mt-1">
        <div className="row">
          <div className="col-lg-4">
            <DangerousGoodsCard />
          </div>
          <div className="col-lg-4">
            <InsuranceCard />
          </div>
          <div className="col-lg-4">
            <CustomClearanceCard showPerishable={true} showTemperature={true} />
          </div>
        </div>
      </div>
    </>
  );
}
