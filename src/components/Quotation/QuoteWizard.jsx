"use client";

import "@/styles/quotation.css";
import { toast } from "react-toastify";
import { QuotationProvider, useQuotation } from "@/context/QuotationContext";

import StepSidebar from "./StepSidebar";

import Step1ShippingMode from "./Step1ShippingMode";
import Step2DeliveryTerm from "./Step2DeliveryTerm";
import Step3ShippingFrom from "./Step3ShippingFrom";
import Step4ShippingTo from "./Step4ShippingTo";
import Step5ShippingType from "./Step5ShippingType";
import Step6CargoDetails from "./Step6CargoDetails";
import Step7ReadyToLoad from "./Step7ReadyToLoad";

function WizardContent({ onSuccess }) {
  const {
    currentStep,
    setCurrentStep,

    visitedSteps,
    setVisitedSteps,

    rfqData,
  } = useQuotation();
  const validators = {
    1: () => {
      if (!rfqData.shippingMode) {
        toast.error("Please select a shipping mode");
        return false;
      }
      return true;
    },

    2: () => {
      if (!rfqData.deliveryTerm) {
        toast.error("Please select a delivery term");
        return false;
      }
      return true;
    },

    3: () => {
      if (!rfqData.shippingFromCountryId) {
        toast.error("Please select a shipping from country");
        return false;
      }

      if (!rfqData.portOfLoading?.trim()) {
        toast.error("Please enter a port or city of loading");
        return false;
      }

      const showPickUpAddress =
        rfqData.deliveryTerm === 1 || rfqData.deliveryTerm === 3;

      if (showPickUpAddress && !rfqData.pickUpAddress?.trim()) {
        toast.error("Please enter a pick-up address");
        return false;
      }

      return true;
    },

    4: () => {
      if (!rfqData.shippingToCountryId) {
        toast.error("Please select a shipping to country");
        return false;
      }

      if (!rfqData.portOfDestination?.trim()) {
        toast.error("Please enter a port or city of destination");
        return false;
      }

      const showDeliveryAddress =
        rfqData.deliveryTerm === 1 || rfqData.deliveryTerm === 4;

      if (showDeliveryAddress && !rfqData.deliveryAddress?.trim()) {
        toast.error("Please enter a delivery address");
        return false;
      }

      return true;
    },

    5: () => {
      if (!rfqData.shippingType) {
        toast.error("Please select shipping type");
        return false;
      }
      return true;
    },
    6: () => {
      const cargo = rfqData.cargoDetails?.[0];

      if (!cargo) {
        toast.error("Please add cargo details");
        return false;
      }

      switch (rfqData.shippingType) {
        case 1: // FCL
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.containerType) {
              toast.error(`Please select container type for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.oversizedCargo) {
              if (!cargo.quantity || Number(cargo.quantity) <= 0) {
                toast.error(`Please enter quantity for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.weight || Number(cargo.weight) <= 0) {
                toast.error(`Please enter weight for cargo ${i + 1}`);
                return false;
              }
            } else {
              if (!cargo.length || Number(cargo.length) <= 0) {
                toast.error(`Please enter length for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.width || Number(cargo.width) <= 0) {
                toast.error(`Please enter width for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.height || Number(cargo.height) <= 0) {
                toast.error(`Please enter height for cargo ${i + 1}`);
                return false;
              }
            }
          }
          break;

        case 2: // LCL
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.length || Number(cargo.length) <= 0) {
              toast.error(`Please enter length for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.width || Number(cargo.width) <= 0) {
              toast.error(`Please enter width for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.height || Number(cargo.height) <= 0) {
              toast.error(`Please enter height for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.quantity || Number(cargo.quantity) <= 0) {
              toast.error(`Please enter quantity for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.weight || Number(cargo.weight) <= 0) {
              toast.error(`Please enter weight for cargo ${i + 1}`);
              return false;
            }
          }

          break;
        case 3: // Breakbulk
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.weight || Number(cargo.weight) <= 0) {
              toast.error(`Please enter gross weight for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.loadingRate || Number(cargo.loadingRate) <= 0) {
              toast.error(`Please enter loading rate for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.dischargingRate || Number(cargo.dischargingRate) <= 0) {
              toast.error(`Please enter discharging rate for cargo ${i + 1}`);
              return false;
            }
          }

          break;
        case 4: // Standard Cargo
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.length || Number(cargo.length) <= 0) {
              toast.error(`Please enter length for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.width || Number(cargo.width) <= 0) {
              toast.error(`Please enter width for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.height || Number(cargo.height) <= 0) {
              toast.error(`Please enter height for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.quantity || Number(cargo.quantity) <= 0) {
              toast.error(`Please enter quantity for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.weight || Number(cargo.weight) <= 0) {
              toast.error(`Please enter weight for cargo ${i + 1}`);
              return false;
            }
          }

          break;
        case 5: // ULD Container
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.uldContainerType) {
              toast.error(`Please select container type for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.quantity || Number(cargo.quantity) <= 0) {
              toast.error(`Please enter quantity for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.weight || Number(cargo.weight) <= 0) {
              toast.error(`Please enter weight for cargo ${i + 1}`);
              return false;
            }
          }

          break;
        // Specific Wagon
        case 6: // Specific Wagon Type
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.wagonType) {
              toast.error(`Please select wagon type for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.oversizedCargo) {
              if (!cargo.quantity || Number(cargo.quantity) <= 0) {
                toast.error(`Please enter quantity for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.weight || Number(cargo.weight) <= 0) {
                toast.error(`Please enter weight for cargo ${i + 1}`);
                return false;
              }
            } else {
              if (!cargo.length || Number(cargo.length) <= 0) {
                toast.error(`Please enter length for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.width || Number(cargo.width) <= 0) {
                toast.error(`Please enter width for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.height || Number(cargo.height) <= 0) {
                toast.error(`Please enter height for cargo ${i + 1}`);
                return false;
              }
            }
          }

          break;

        // Full Truck Load
        case 7: // Full Truck Load
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.truckType) {
              toast.error(`Please select truck type for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.oversizedCargo) {
              if (!cargo.quantity || Number(cargo.quantity) <= 0) {
                toast.error(`Please enter quantity for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.weight || Number(cargo.weight) <= 0) {
                toast.error(`Please enter weight for cargo ${i + 1}`);
                return false;
              }
            } else {
              if (!cargo.length || Number(cargo.length) <= 0) {
                toast.error(`Please enter length for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.width || Number(cargo.width) <= 0) {
                toast.error(`Please enter width for cargo ${i + 1}`);
                return false;
              }

              if (!cargo.height || Number(cargo.height) <= 0) {
                toast.error(`Please enter height for cargo ${i + 1}`);
                return false;
              }
            }
          }

          break;
        case 8: // Less Truck Load
          for (let i = 0; i < rfqData.cargoDetails.length; i++) {
            const cargo = rfqData.cargoDetails[i];

            if (!cargo.length || Number(cargo.length) <= 0) {
              toast.error(`Please enter length for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.width || Number(cargo.width) <= 0) {
              toast.error(`Please enter width for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.height || Number(cargo.height) <= 0) {
              toast.error(`Please enter height for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.quantity || Number(cargo.quantity) <= 0) {
              toast.error(`Please enter quantity for cargo ${i + 1}`);
              return false;
            }

            if (!cargo.weight || Number(cargo.weight) <= 0) {
              toast.error(`Please enter weight for cargo ${i + 1}`);
              return false;
            }
          }

          break;
      }

      // if (!cargo.quantity) {
      //   toast.error("Please enter quantity");
      //   return false;
      // }

      // if (!cargo.weight) {
      //   toast.error("Please enter weight");
      //   return false;
      // }

      return true;
    },
    7: () => {
      if (!rfqData.goodsReadyDate) {
        toast.error("Please select goods ready date");
        return false;
      }
      return true;
    },
  };
  const validateStep = () => {
    const validator = validators[currentStep];

    if (!validator) return true;

    return validator();
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    const next = currentStep + 1;

    setCurrentStep(next);

    setVisitedSteps((prev) => {
      if (prev.includes(next)) {
        return prev;
      }

      return [...prev, next];
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="row">
      <div className="col-lg-3 d-none d-lg-block">
        <StepSidebar />
      </div>

      <div className="col-12 col-lg-9">
        {currentStep === 1 && <Step1ShippingMode />}

        {currentStep === 2 && <Step2DeliveryTerm />}

        {currentStep === 3 && <Step3ShippingFrom />}

        {currentStep === 4 && <Step4ShippingTo />}

        {currentStep === 5 && <Step5ShippingType />}

        {currentStep === 6 && <Step6CargoDetails />}

        {currentStep === 7 && <Step7ReadyToLoad onSuccess={onSuccess} />}

        {currentStep > 7 && <h3>Step {currentStep} Coming Soon</h3>}

        <hr className="my-4 text-muted" />

        <div className="d-flex justify-content-start ">
          <div>
            {currentStep > 1 && currentStep < 7 && (
              <button className="rfq-back-btn me-2" onClick={prevStep}>
                Back
              </button>
            )}
            {currentStep === 7 && (
              <button className="rfq-back-btn me-2" onClick={prevStep}>
                Back
              </button>
            )}
          </div>

          <div>
            {currentStep < 7 && (
              <button className="rfq-next-btn" onClick={nextStep}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuoteWizard({ initialData, onSuccess }) {
  return (
    <QuotationProvider initialData={initialData}>
      <WizardContent onSuccess={onSuccess} />
    </QuotationProvider>
  );
}
