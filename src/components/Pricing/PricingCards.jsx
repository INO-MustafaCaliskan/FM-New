import { PricingCard } from "./PricingCard";
import FeatureList from "./FeatureList";
import { RiUser3Line } from "react-icons/ri";
const PricingCards = ({ pricingCards, onSelectPlan, isAuth }) => {

  const clickCorporate = () => {
    window.location.href = "/contact-us";
  }




  return (
    <section id="pricing-plans-section">
      <div className="row">
        {pricingCards.map((item) => (
          <PricingCard
            key={item.id}

            buttonText="Select"
            cardItem={item}
            onClickButton={() => onSelectPlan(item)}
          />
        ))}
        <div
          className="col-xl-3 generic_content_parent"
          onClick={clickCorporate}
        >
          <div className="generic_content rounded d-flex flex-column justify-content-between">
            <div>
              <div className="generic_head_price">
                <div className="generic_head_content">
                  <div className="head_bg"></div>

                  <div className="head">
                    <span>Corporate Plan</span>

                    <div className="corporate-subtitle">
                      (Contact Us)
                    </div>
                  </div>
                </div>

                <div className="generic_price_tag">
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center gap-2">
                      <span className="corporate-user-icon d-flex align-items-center justify-content-center">
                        <RiUser3Line />
                      </span>

                      <div className="per_person_badge d-flex flex-column gap-1 p-2 ">
                        <span
                          className="custom-pricing-text"
                          style={{ fontSize: "20px" }}
                        >
                          Custom Pricing
                        </span>

                        <span className="per-person-text">
                          Per Person
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 px-3">
                    <span className="fw-bold">
                      For teams, enterprises, agencies, and multi-user needs.
                    </span>
                  </div>
                </div>
              </div>

              <FeatureList
                items={[
                  { type: "title", text: "Ideal for:" },
                  { text: "Large logistics companies" },
                  { text: "Freight forwarding networks" },
                  { text: "Corporates with multiple departments" },
                  { text: "Businesses needing 5+ accounts" },
                  { text: "Global sales & operations teams" },

                  { type: "title", text: "Features:" },
                  { text: "All features from 6-month plan" },
                  { text: "Multi-user license" },
                  { text: "Centralized invoicing" },
                  { text: "Dedicated account manager" },
                  { text: "Priority support" },
                  { text: "Custom onboarding" },
                  { text: "Exclusive corporate tools" },
                  { text: "Secure team management panel" },

                  {
                    type: "title",
                    text: "Contact Us for a Custom Quote",
                  },
                ]}
              />
            </div>

            <div className="generic_price_btn">
              <button className="select-plan-btn plan-btn">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
