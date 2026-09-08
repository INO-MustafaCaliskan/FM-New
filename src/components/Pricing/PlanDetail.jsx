import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/components/Pricing/pricing.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PricingHeader } from "./PricingHeader";
import { CreditCardForm } from "./CreditCardForm";
import { PricingCard } from "./PricingCard";

export default function PlanDetail({ plan, onBack }) {
  return (
    <>
      <div className="row">
        <PricingCard
          buttonText={<><FontAwesomeIcon icon={faArrowLeft} /> All Packages</>}
          cardItem={plan}
          onClickButton={onBack}
          isActive
        />
        <div className="col-md-8 price-page-card-area">
          <div className="row justify-content-end g-3 card-list-area">
            <CreditCardForm packageId={plan.id} />
          </div>
        </div>
      </div>
    </>
  );
}
