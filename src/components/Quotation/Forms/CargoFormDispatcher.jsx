"use client";

import { useQuotation } from "@/context/QuotationContext";
import FCLCargoForm from "./FCLCargoForm";
import LCLCargoForm from "./LCLCargoForm";
import BreakbulkCargoForm from "./BreakbulkCargoForm";
import StandardCargoForm from "./StandardCargoForm";
import ULDContainerForm from "./ULDContainerForm";
import SpecificWagonTypeForm from "./SpecificWagonTypeForm";
import FullTruckLoadCargoForm from "./FullTruckLoadCargoForm";
import LessTruckLoadCargoForm from "./LessTruckLoadCargoForm";

export default function CargoFormDispatcher() {
  const { rfqData } = useQuotation();

  // SHIPPING_TYPES mapping:
  // 1: Full Container Load (FCL)
  // 2: Less Container Load (LCL)
  // 3: Breakbulk Cargo
  // 4: Standard Cargo (Air Freight)
  // 5: ULD Container (Air Freight)
  // 6: Specific Wagon Type (Rail)
  // 7: Full Truck Load (Land)
  // 8: Less Truck Load (Land)

  const renderForm = () => {
    switch (rfqData.shippingType) {
      case 1:
        return <FCLCargoForm />;
      case 2:
        return <LCLCargoForm />;
      case 3:
        return <BreakbulkCargoForm />;
      case 4:
        return <StandardCargoForm />;
      case 5:
        return <ULDContainerForm />;
      case 6:
        return <SpecificWagonTypeForm />;
      case 7:
        return <FullTruckLoadCargoForm />;
      case 8:
        return <LessTruckLoadCargoForm />;
      default:
        return <FCLCargoForm />;
    }
  };

  return renderForm();
}
