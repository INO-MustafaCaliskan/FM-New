"use client";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import React from "react";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import client from "@/utils/client";
import InoLoading from "@/components/InoLoading/InoLoading";
import HumanizedDate from "@/components/UI/HumanizedDate ";


const Page = () => {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("paymentId");
  const [transactionData, setTransactionData] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (paymentId) {
      const fetchTransaction = async () => {
        try {
          const response = await client.get('/UserTransaction/GetByIdForLoginUser/' + paymentId);
          
          setTransactionData(response.data.data); 
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        } finally {
          setLoading(false); 
        }
      };

      fetchTransaction();
    }
  }, [paymentId]);
  
  const handleTransactionHistoryClick = () => {
    window.location.href = "/subscription?activeTab=3";
  };

  const handleGoToHomepageClick = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="container d-flex flex-column">
        <InoBreadcrumb linkName="Payment Success" />
        <div className="card p-3 p-md-0 p-xl-5">
          <div className="card-body">
            <div className="d-flex flex-column align-items-center">
              <img
                src="/images/success.png"
                alt="Payment Success"
                style={{ width: "100px", height: "100px", fontSize: "48px" }}
              />
              <h1 className="mb-3 text-success">Payment Successful!</h1>
              <p className="mb-4 text-muted">
                Thank you for your purchase. Your payment has been processed
                successfully.
              </p>
              {loading ? (
                <InoLoading />
              ) : (
                <>
                  <div
                    className="border rounded p-3 mb-4 w-100"
                    style={{ background: "#f9f9f9" }}
                  >
                    <div className="d-flex ">
                      <h6 className="mb-3">Invoice No: </h6>
                      <p className="mb-0 pl-3" style={{fontWeight:600 , marginLeft:4 }}>
                         {transactionData.referenceNo}
                      </p>
                    </div>

                    <div className="d-flex ">
                      <h6 className="mb-3">Subscription Package: </h6>
                      <p className="mb-3 pl-3" style={{fontWeight:600  , marginLeft:4 }}>
                        {transactionData.subscriptionPackageName}
                      </p>
                    </div>
                    <div className="d-flex ">
                      <h6 className="mb-3">Price: </h6>
                      <p className="mb-0 pl-3" style={{fontWeight:600  , marginLeft:4 }}>
                        ${transactionData.price}
                      </p>
                    </div>
                    <div className="d-flex ">
                      <h6 className="mb-3">Payment Date: </h6>
                      <p className="mb-0 pl-3" style={{fontWeight:600  , marginLeft:4 }}>
                         <HumanizedDate dateString={transactionData.paymentDate} showHours={false} /> 
                      </p>
                    </div>
                    <div className="d-flex ">
                      <h6 className="mb-3">Renewal Due On: </h6>
                      <p className="mb-0 pl-3" style={{fontWeight:600  , marginLeft:4 }}>
                        <HumanizedDate dateString={transactionData.renewalDueOn} showHours={false}/>
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="home-showcase__buttons">
                <button
                  className="btn ino-button"
                  style={{ marginRight: "5px" }}
                  onClick={handleTransactionHistoryClick}
                >
                 View Payment Detail
                </button>
                <button
                  className="btn ino-button ino-button-outline ml-2"
                  onClick={handleGoToHomepageClick}
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
