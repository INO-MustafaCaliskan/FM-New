"use client";

import { useQuotation , createCargoDetail } from "@/context/QuotationContext";
import DangerousGoodsCard from "@/components/Quotation/CargoCards/DangerousGoodsCard";
import InsuranceCard from "@/components/Quotation/CargoCards/InsuranceCard";
import CustomClearanceCard from "@/components/Quotation/CargoCards/CustomClearanceCard";

export default function LessTruckLoadCargoForm() {
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
    let totalVolume = 0;

    rfqData.cargoDetails.forEach((cargo) => {
      totalQuantity += parseInt(cargo.quantity || 0);
      totalWeight += parseFloat(cargo.weight || 0);

      const length = parseFloat(cargo.length || 0) ; // cm to m
      const width = parseFloat(cargo.width || 0) ; // cm to m
      const height = parseFloat(cargo.height || 0) ; // cm to m

      if (length && width && height) {
        totalVolume += length * width * height;
      }
    });

    return {
      totalQuantity: Math.round(totalQuantity),
      totalWeight: totalWeight,
      totalVolume: totalVolume,
    };
  };

  const totals = calculateTotals();

  return (
    <>
        <div className="mb-4">
        <h6>Box/Pallet</h6>
      </div>


      {rfqData.cargoDetails.map((cargo,index) => (
        <div key={cargo.id} className="rfq-cargo-row">
          <div className="row align-items-end">
            <div className="col-lg-2  form-group mb-0">
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
                <span className="input-group-text">cm</span>
              </div>
            </div>

            <div className="col-lg-2 form-group mb-0">
              <label className="form-label" >Width</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={cargo.width}
                  onChange={(e) =>
                    updateCargo(cargo.id, "width", e.target.value)
                  }
                />
                <span className="input-group-text">cm</span>
              </div>
            </div>

            <div className="col-lg-2 form-group mb-0">
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
                <span className="input-group-text">cm</span>
              </div>
            </div>

            <div className="col-lg-2 form-group mb-0">
              <label className="form-label">Quantity</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={cargo.quantity}
                  onChange={(e) =>
                    updateCargo(cargo.id, "quantity", e.target.value)
                  }
                />
                <span className="input-group-text">pcs</span>
              </div>
            </div>

            <div className="col-lg-2 form-group mb-0">
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

            {index > 0 &&(
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
          <label className="form-label">Total Quantity</label>
          <input
            type="text"
            className="form-control"
            value={totals.totalQuantity}
            disabled
          />
        </div>
        <div className="col-lg-3">
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
        <div className="col-lg-3">
          <label className="form-label">Total Volume</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={totals.totalVolume}
              disabled
            />
            <span className="input-group-text">cm³</span>
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
            <CustomClearanceCard showStackable={true} />
          </div>
        </div>
      </div>
    </>
  );
}
