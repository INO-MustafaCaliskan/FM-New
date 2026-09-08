"use client";
import { useQuotation } from "@/context/QuotationContext";
import client from "@/utils/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function Step7ReadyToLoad({ onSuccess }) {
  const { rfqData, setRfqData } = useQuotation();
const router = useRouter();
  const handleDateChange = (e) => {
    setRfqData((prev) => ({
      ...prev,
      goodsReadyDate: e.target.value,
    }));
  };

  const handleAdditionalInfoChange = (e) => {
    setRfqData((prev) => ({
      ...prev,
      additionalInformation: e.target.value,
    }));
  };

  const handleSubmit = async () => {
  try {
    const isUpdate = !!rfqData.id;
    const endpoint = isUpdate ? "/Quotation/UpdateByMember" : "/Quotation/AddByMember";
    const response = await client.post(
      endpoint,
      rfqData
    );
    toast.success(isUpdate ? "RFQ updated successfully" : "RFQ submitted successfully");
    
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/get-quote?tab=sent");
    }

  } catch (error) {
    console.error("RFQ submit error:", error);
    toast.error("An error occurred while submitting RFQ");
  }
};

  return (
    <>
      <h2 className="rfq-step-title">Ready To Load</h2>

      <div className="card mt-4 ">
     

        <div className="form-group mb-4">
          <label className="form-label mb-2">
            Goods Ready Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            value={rfqData.goodsReadyDate}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label  mb-2">
            Additional Information
          </label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Additional request or information (e.g incoterms)"
            value={rfqData.additionalInformation}
            onChange={handleAdditionalInfoChange}
          />
        </div>

        <div className="mt-2">
          <button
            className="rfq-next-btn"
            onClick={handleSubmit}
        
          >
            {rfqData.id ? "Save Changes" : "Submit RFQ"}
          </button>
        </div>


      </div>
    </>
  );
}
