import { FaRegCheckCircle } from "react-icons/fa";

export default function FeatureList({ items }) {
    return (
        <div className="generic_feature_list d-flex flex-column justify-content-start pb-5 ">
            <ul className="d-flex flex-column flex-shrink-1 align0-items-start col-11 mx-auto gap-3">
                {items.map((item, index) => {
                    if (item.type === "title") {
                        return (
                            <li key={index} className="text-start d-flex gap-2" >
                                <span className="fw-bold " >{item.text}</span>
                            </li>
                        );
                    }
                    if (item.type === "text") {
                        return (
                            <li key={index} className="text-start d-flex gap-2" >
                                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                            </li>
                        );
                    }
                    return (
                        <li key={index} className="text-start d-flex gap-2" >
                            <FaRegCheckCircle className="pricing-card-icon" />
                            <span >{item.text}</span>

                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
