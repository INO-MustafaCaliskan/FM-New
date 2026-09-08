import { FaRegCheckCircle } from "react-icons/fa";
import { RiUser3Line } from "react-icons/ri";
export const PricingCard = ({
  cardItem,
  showButton = true,
  onClickButton,
  buttonText,
  isActive = false,
}) => {
  const isMostPopular = cardItem.name === "3 Months";

  return (
    <div
      className="col-xl-3 generic_content_parent position-relative"
      onClick={onClickButton}
    >
      {isMostPopular && (
        <div className="most-popular-badge">
          Most Popular
        </div>
      )}

      <div
        className={`generic_content rounded ${isActive ? "active" : ""
          } d-flex flex-column justify-content-between`}
      >
        <div>
          <div className="generic_head_price">
            <div className="generic_head_content">
              <div className="head_bg"></div>

              <div className="head">
                <span>{cardItem.name}</span>
              </div>
            </div>

            <div className="generic_price_tag">
              <div>
                <span className="price">
                  <span className="sign">$</span>
                  <span className="currency">{cardItem.price}</span>
                </span>
              </div>
              <div className="per_person_badge p-2 mt-1 border border-1 rounded-pill d-inline-block" >
                <div className="d-flex align-items-center gap-1">
                  <span className="d-flex align-items-center text-secondary">
                    <RiUser3Line />
                  </span>
                  <span className="text-secondary">
                    Per Person
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="generic_feature_list d-flex flex-column justify-content-start pb-5">
            <ul className="d-flex flex-column gap-3 flex-shrink-1 align0-items-start col-11 mx-auto ">
              <li className=" d-flex gap-2">
                <span className="fw-bold">What’s included</span>
              </li>

              {cardItem.pricingCardFeatures.map((spec) => (
                <li
                  key={spec.id}
                  className="text-start d-flex gap-2"
                >
                  <FaRegCheckCircle className="pricing-card-icon" />

                  <span>{spec.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="generic_price_btn">
          {showButton && (
            <button className="select-plan-btn plan-btn">
              {buttonText}
            </button>
          )}
        </div>
      </div >
    </div >
  );
};