import React, { useEffect, useState } from "react";
import client from "@/utils/client";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import HumanizedDate from "../UI/HumanizedDate ";
import Image from "next/image";
import { InoSelect } from "../UI/InoSelect";

const perfomanceSelectData = [
  { value: "0", label: "All Time" },
  { value: "1", label: "Last 1 Month" },
  { value: "3", label: "Last 3 Month" },
  { value: "6", label: "Last 6 Month" },
  { value: "9", label: "Last 9 Month" },
];

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const PlanTab = () => {
  const [pageData, setPageData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = () => {
    setLoading(true);
    var url = "User/GetSubscriptionPlanDetails";
    if (selectedPeriod !== "0") url += "?lastInMonth=" + selectedPeriod;

    client
      .get(url)
      .then((response) => {
        setPageData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeFilter = (data) => {
    setSelectedPeriod(data.value);
  };

  if (loading || !pageData) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <CircularProgress />
      </div>
    );
  }

  if (hasError) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="row g-3">
            <div className="col-12 col-md-3">
              <div className="subscription__profile-status">
                <span className="active"></span>
                <p className="subscription__profile-status-text mb-2">
                  <strong>Account: </strong> Active
                </p>
              </div>
              <Image
                width={145}
                height={145}
                src={pageData.imageUrl || "/images/empty-image.png"}
                className="img-fluid w-100"
                alt={pageData.firstName}
              />
            </div>
            <div className="col-12 col-md-9">
              <p className="fw-bold h4 mt-4">
                {pageData.firstName} {pageData.lastName}
              </p>
              <p>FTalk ID: {pageData.fTalkId}</p>
              <div>
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Performance Statistics
                </label>
                <InoSelect
                  isSearchable={false}
                  defaultValue={perfomanceSelectData[0]}
                  onChange={(data) => onChangeFilter(data)}
                  options={perfomanceSelectData}
                  value={perfomanceSelectData.find(
                    (option) => option.value === selectedPeriod,
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-3 mt-md-0 ">
          <div className="row g-3">
            <div className="col-12">
              <div className="card text-center p-4 bg-light border-0">
                <b className="pb-1">You Have Had</b>
                <div id="session-count-area"> {pageData.sessionCount}</div>{" "}
                sessions
              </div>
            </div>
            <div className="col-12">
              <div className="card text-center p-4 bg-light border-0">
                <b className="pb-1">You Have Had</b>
                <div id="session-count-area">
                  {" "}
                  {pageData.favoriteCount}
                </div>{" "}
                favorites
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2 mt-md-4 g-3">
        <div className="col-12 col-md-4">
          <div className="card text-center p-4 bg-light border-0">
            <b className="pb-1">Started On</b>
            {pageData.startedOn ? (
              <HumanizedDate dateString={pageData.startedOn} />
            ) : (
              "-"
            )}
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-center p-4 bg-light border-0">
            <b className="pb-1">Free Trial Period</b>
            <p>
              {pageData.freeTrialStart ? (
                <HumanizedDate dateString={pageData.freeTrialStart} />
              ) : (
                "-"
              )}
              &nbsp; - &nbsp;
              {pageData.freeTrialEnd ? (
                <HumanizedDate dateString={pageData.freeTrialEnd} />
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-center p-4 bg-light border-0">
            <b className="pb-1">Package</b>
            {pageData.packageName || "-"}
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-center p-4 bg-light border-0">
            <b className="pb-1">Last Renewal</b>
            {pageData.lastRenewal ? (
              <HumanizedDate dateString={pageData.lastRenewal} />
            ) : (
              "-"
            )}
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-center p-4 bg-light border-0">
            <b className="pb-1">Next Billing Date</b>
            {pageData.nextBillingDate ? (
              <HumanizedDate dateString={pageData.nextBillingDate} />
            ) : (
              "-"
            )}
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card text-center p-4 bg-light border-0">
            <b className="pb-1">Next Billing Amount</b>
            {pageData.nextBillingAmount != null
              ? `${USDollar.format(pageData.nextBillingAmount)} / ${
                  pageData.packageName || "-"
                }`
              : "-"}
          </div>
        </div>
      </div>

      <div className="row mt-3 mb-3">
        <div className="col-12 text-end">
          <Link
            href="/pricing/"
            className="subscription-pricing-btn"
          >
            Buy Package
          </Link>
        </div>
      </div>
    </>
  );
};
