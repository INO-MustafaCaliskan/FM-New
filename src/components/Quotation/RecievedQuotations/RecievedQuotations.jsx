"use client";

import { useState, useEffect } from "react";
import {
  faSort,
  faSortUp,
  faSortDown,
  faFileExcel,
  faFilePdf,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InoSelect } from "@/components/UI/InoSelect";
import "./recieved-quotations.css";
import InoPagination from "@/components/UI/InoPagination";
import RfqDetailModal from "@/components/InoModals/RfqDetailModal/RfqDetailModal";
import client from "@/utils/client";
import InoLoading from "@/components/InoLoading/InoLoading";
import { useSignalR } from "@/context/SignalRContext2";

export default function ReceivedQuotations() {
  const [sortColumn, setSortColumn] = useState("requestForQuotationDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { connection, getQuickChatUser } = useSignalR();
  const [rfqs, setRfqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const dateFilterOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 Days" },
    { value: "month", label: "This Month" },
  ];
  useEffect(() => {
    fetchRfqs();
  }, [currentPage, dateFilter, appliedSearch, sortColumn, sortDirection]);

  const fetchRfqs = async () => {
    try {
      setIsLoading(true);

      const lastInDays = getLastInDaysValue(dateFilter);
      const order = getOrderParam();

      const response = await client.get(
        `/Quotation/GetReceivedList?pageNumber=${currentPage}&pageSize=30&lastInDays=${lastInDays}` +
          `${appliedSearch ? `&search=${appliedSearch}` : ""}` +
          `${order ? `&order=${order}` : ""}`,
      );

      if (response.data.success) {
        const result = response.data.data;

        setRfqs(result?.listItems || []);
        setTotalPages(result?.totalPage || 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    setAppliedSearch(searchText);
  };
  const messageToUser = async (userId) => {
    if (connection && connection.state === "Connected") {
      await getQuickChatUser(userId);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(column);
    setSortDirection(direction);
    setCurrentPage(1);
  };
  const getOrderParam = () => {
    const map = {
      referenceNo: "ReferenceNo",
      fromUserFullName: "FromUserFullName",
      requestForQuotationDate: "RequestForQuotationDate",
      shippingFromCountryName: "ShippingFromCountryName",
      shippingToCountryName: "PortOfDestination",
      goodsReadyDate: "GoodsReadyDate",
    };

    if (!sortColumn) return "";

    const field = map[sortColumn];
    if (!field) return "";

    return sortDirection === "asc" ? field : `${field}_DESC`;
  };
  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return (
        <FontAwesomeIcon
          color="grey"
          icon={sortDirection === "asc" ? faSortUp : faSortDown}
        />
      );
    }

    return <FontAwesomeIcon color="lightgray" icon={faSort} />;
  };

  const getLastInDaysValue = (filter) => {
    switch (filter) {
      case "today":
        return 1;

      case "7days":
        return 7;

      case "month":
        return 30;

      case "all":
      default:
        return 3650; // tüm kayıtlar
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const exportExcel = () => {
    const data = rfqs.map((item) => ({
      "Ref No": item.referenceNo,
      "User Name": item.fromUserFullName,
      "RFQ Date": formatDate(item.requestForQuotationDate),
      Mode: item.shippingModeName,
      "Delivery Term": item.deliveryTermName,
      Departure: item.shippingFromCountryName,
      Destination: item.shippingToCountryName,
      Type: item.shippingTypeName,
      "Goods Ready Date": formatDate(item.goodsReadyDate),
      Status: item.quotationStatusName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      origin: "A3",
    });

    XLSX.utils.sheet_add_aoa(worksheet, [["RECEIVED RFQ REPORT"]], {
      origin: "A1",
    });

    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 }, // A1
        e: { r: 0, c: 9 }, // J1
      },
    ];

    worksheet["!cols"] = [
      { wch: 18 }, // Ref No
      { wch: 25 }, // User Name
      { wch: 18 }, // RFQ Date
      { wch: 20 }, // Mode
      { wch: 22 }, // Delivery Term
      { wch: 18 }, // Departure
      { wch: 18 }, // Destination
      { wch: 25 }, // Type
      { wch: 18 }, // RTL Date
      { wch: 15 }, // Status
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Received RFQ");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer]),
      `received-rfq-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const exportPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    autoTable(doc, {
      startY: 30,

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      headStyles: {
        fontStyle: "bold",
      },

      tableWidth: "auto",

      theme: "grid",
      head: [
        [
          "Ref No",
          "User Name",
          "RFQ Date",
          "Mode",
          "Delivery Term",
          "Departure",
          "Destination",
          "Type",
          "RTL Date",
          "Status",
        ],
      ],

      body: rfqs.map((item) => [
        item.referenceNo,
        item.fromUserFullName,
        formatDate(item.requestForQuotationDate),
        item.shippingModeName,
        item.deliveryTermName,
        item.shippingFromCountryName,
        item.shippingToCountryName,
        item.shippingTypeName,
        formatDate(item.goodsReadyDate),
        item.quotationStatusName,
      ]),
    });

    doc.save("received-rfq.pdf");
  };
  if (isLoading) {
    return <InoLoading />;
  }

  return (
    <>
      <div className="mt-0">
        <div>
          <h1
            className="mb-2"
            style={{
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            Received RFQ
          </h1>

          <p className="text-muted">
            You can list the quotes received from network members on this page.
          </p>
        </div>

        <div className="rfq-table-header">
          <div className="rfq-table-actions">
            <button className="rfq-export-btn" onClick={exportExcel}>
              <FontAwesomeIcon icon={faFileExcel} />
              Excel
            </button>

            <button className="rfq-export-btn" onClick={exportPdf}>
              <FontAwesomeIcon icon={faFilePdf} />
              PDF
            </button>
          </div>

          <div className="rfq-table-filters">
            <div className="rfq-search-wrapper d-flex align-items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="rfq-search-input"
              />

              <button
                type="button"
                className="rfq-search-btn"
                onClick={handleSearch}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div  className="rfq-table-list-filter-select">
              <InoSelect
                id="dateFilter"
                name="dateFilter"
                placeholder="Select Date Filter"
                options={dateFilterOptions}
                value={
                  dateFilterOptions.find(
                    (option) => option.value === dateFilter,
                  ) || null
                }
                onChange={(option) => {
                  setDateFilter(option?.value || "all");
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table rfq-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("referenceNo")}>
                  <div className="d-flex align-items-center gap-1">
                    Ref No
                    {renderSortIcon("referenceNo")}
                  </div>
                </th>

                <th onClick={() => handleSort("fromUserFullName")}>
                  <div className="d-flex align-items-center gap-1">
                    User Name
                    {renderSortIcon("fromUserFullName")}
                  </div>
                </th>

                <th onClick={() => handleSort("requestForQuotationDate")}>
                  <div className="d-flex align-items-center gap-1">
                    RFQ Date
                    {renderSortIcon("requestForQuotationDate")}
                  </div>
                </th>

                <th>Mode</th>
                <th>Delivery Term</th>
                <th>Departure</th>
                <th>Destination</th>
                <th>Type</th>

                <th onClick={() => handleSort("goodsReadyDate")}>
                  <div className="d-flex align-items-center gap-1">
                    RTL Date
                    {renderSortIcon("goodsReadyDate")}
                  </div>
                </th>

                <th>Status</th>

                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rfqs.map((rfq) => (
                <tr
                  key={rfq.id}
                  className={
                    !rfq.isViewed &&
                    rfq.quotationStatusName?.toLowerCase() === "open"
                      ? "rfq-unread-row"
                      : ""
                  }
                >
                  <td>
                    <div className="rfq-ref">{rfq.referenceNo}</div>
                  </td>

                  <td style={{maxWidth:"150px"}}>
                    <span
                      onClick={() => messageToUser(rfq.fromUserId)}
                      style={{
                        color: "#0d6efd",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {rfq.fromUserFullName}
                    </span>
                  </td>

                  <td>{formatDate(rfq.requestForQuotationDate)}</td>

                  <td>{rfq.shippingModeName}</td>

                  <td>{rfq.deliveryTermName}</td>

                  <td style={{maxWidth:"150px"}}>{rfq.shippingFromCountryName}</td>

                  <td style={{maxWidth:"150px"}}>{rfq.shippingToCountryName}</td>

                  <td>{rfq.shippingTypeName}</td>

                  <td>{formatDate(rfq.goodsReadyDate)}</td>

                  <td>
                    <span
                      className={`rfq-status-badge ${rfq.quotationStatusName?.toLowerCase()}`}
                    >
                      {rfq.quotationStatusName}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="rfq-view-btn"
                      disabled={
                        rfq.quotationStatusName?.toLowerCase() === "closed"
                      }
                      onClick={() => {
                        setSelectedRfqId(rfq.id);
                        setShowDetailModal(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rfqs.length && (
          <div className="text-center py-5">
            <h5>No RFQ Found</h5>
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <InoPagination
              currentPage={currentPage}
              totalPage={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      <RfqDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        rfqId={selectedRfqId}
        readOnly={true}
      />

      {/* <Modal
        show={showCloseModal}
        onHide={() => setShowCloseModal(false)}
        centered
      >
        <Modal.Header
          className="d-flex align-items-center  justify-content-between"
          closeButton
        >
          <Modal.Title>Close RFQ</Modal.Title>
        </Modal.Header>

        <Modal.Body className="close-rfq-modal-body">
          If you close this RFQ, other users will no longer be able to view your
          request or submit quotations.
          <br />
          <br />
          Are you sure you want to continue?
        </Modal.Body>
        <Modal.Footer className="rfq-close-footer">
          <Button
            className="rfq-btn-cancel"
            onClick={() => setShowCloseModal(false)}
          >
            No
          </Button>

          <Button className="rfq-btn-confirm" onClick={handleCloseQuotation}>
            Yes, Close RFQ
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}
