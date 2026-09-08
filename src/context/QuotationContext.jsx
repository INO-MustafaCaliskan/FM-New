"use client";

import { createContext, useContext, useState } from "react";

const QuotationContext = createContext();

export const createCargoDetail = () => ({
  id: crypto.randomUUID(),

  containerType: null,
  uldContainerType: null,
  packageType: null,
  truckType: null,
  wagonType: null,

  quantity: null,
  weight: null,

  length: null,
  width: null,
  height: null,

  oversizedCargo: false,

  loadingRate: null,
  dischargingRate: null,
});

const createInitialRfqData = () => ({
  // Step 1
  shippingMode: null,

  // Step 2
  deliveryTerm: null,

  // Step 3
  shippingFromCountryId: null,
  portOfLoading: "",
  pickUpAddress: "",

  // Step 4
  shippingToCountryId: null,
  portOfDestination: "",
  deliveryAddress: "",

  // Step 5
  shippingType: null,

  // Step 6
  cargoDetails: [createCargoDetail()],

  productDescription: "",

  isCargoHazardous: "notSure",
  imoClass: null,
  unNumber: "",

  needInsurance: "no",
  insuranceCurrency: null,
  insuranceAmount: null,

  needCustomClearance: "no",

  cargoStackable: "notSure",

  isCargoPerishable: "notSure",

  goodsReadyDate: null,
  additionalInformation: "",
});

export function QuotationProvider({ children, initialData }) {
  const [currentStep, setCurrentStep] = useState(1);

  const [visitedSteps, setVisitedSteps] = useState(initialData ? [1, 2, 3, 4, 5, 6, 7] : [1]);

  const [rfqData, setRfqData] = useState(() => initialData || createInitialRfqData());

const updateField = (field, value) => {
  // Shipping Mode değişince tüm RFQ reset
  if (field === "shippingMode") {
    setVisitedSteps([1]);
    setCurrentStep(1);

    setRfqData((prev) => ({
      ...createInitialRfqData(),
      id: prev.id,
      shippingMode: value,
    }));

    return;
  }

  setRfqData((prev) => {
    // Shipping Type değişince cargo reset
    if (
      field === "shippingType" &&
      prev.shippingType &&
      prev.shippingType !== value
    ) {
      return {
        ...prev,
        shippingType: value,

        cargoDetails: [createCargoDetail()],

        productDescription: "",

        isCargoHazardous: "notSure",
        imoClass: "",
        unNumber: "",

        cargoStackable: "notSure",
        isCargoPerishable: "notSure",

        goodsReadyDate: "",
        additionalInformation: "",
        id: prev.id,
      };
    }

    return {
      ...prev,
      [field]: value,
    };
  });
};
  const resetQuotation = () => {
    setCurrentStep(1);
    setVisitedSteps([1]);
    setRfqData(createInitialRfqData());
  };

  return (
    <QuotationContext.Provider
      value={{
        currentStep,
        setCurrentStep,

        visitedSteps,
        setVisitedSteps,

        rfqData,

        updateField,

        setRfqData,
        resetQuotation,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export const useQuotation = () => useContext(QuotationContext);
