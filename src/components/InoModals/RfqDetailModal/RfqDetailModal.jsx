"use client";

import { useEffect, useState } from "react";
import client from "@/utils/client";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "./rfq-detail-modal.css";
import {
  CONTAINER_TYPES,
  PACKAGE_TYPES,
  TRUCK_TYPES,
  ULD_CONTAINER_TYPES,
  WAGON_TYPES,
} from "@/utils/quotationConstants";
import QuoteWizard from "@/components/Quotation/QuoteWizard";
import { toast } from "react-toastify";

/* ─── helpers ─────────────────────────────────────────── */

const getTitleById = (list, id) => {
  if (!id) return null;

  return list.find((item) => item.id === Number(id))?.title || null;
};

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "" && value !== 0;

const renderYesNo = (value) => {
  if (!hasValue(value)) return null;
  const map = { yes: "Yes", no: "No", notSure: "Not Sure" };
  return map[value] || value;
};

const formatDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (n, decimals = 0) => {
  if (!hasValue(n)) return null;
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/* ─── status badge ────────────────────────────────────── */

const statusClassMap = {
  Open: "rfq-status-badge--open",
  Closed: "rfq-status-badge--closed",
  Pending: "rfq-status-badge--pending",
  Awarded: "rfq-status-badge--awarded",
};

const StatusBadge = ({ label }) => {
  if (!label) return null;
  const cls = statusClassMap[label] || "rfq-status-badge--default";
  return <span className={`rfq-status-badge ${cls}`}>{label}</span>;
};

/* ─── field ───────────────────────────────────────────── */

const Field = ({ label, value, wide, auto }) => {
  if (!hasValue(value)) return null;
  return (
    <div
      className={
        auto
          ? "rfq-field-auto"
          : wide
            ? "col-12 col-md-8"
            : "col-12 col-sm-6 col-md-4"
      }
    >
      <div className="rfq-field-label">{label}</div>
      <div className="rfq-field-value">{value}</div>
    </div>
  );
};

/* ─── section wrapper ─────────────────────────────────── */

const Section = ({ title, accentColor, children }) => {
  const hasChildren = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children);
  if (!hasChildren) return null;
  return (
    <div className="rfq-section">
      <div
        className="rfq-section-header"
        style={{ borderColor: accentColor || "#f97a29" }}
      >
        {title}
      </div>
      {children}
    </div>
  );
};

/* ─── summary stat ────────────────────────────────────── */

const Stat = ({ label, value, unit }) => {
  if (!hasValue(value)) return null;
  return (
    <div className="rfq-stat">
      <div className="rfq-stat__value">
        {value}
        {unit && <span className="rfq-stat__unit"> {unit}</span>}
      </div>
      <div className="rfq-stat__label">{label}</div>
    </div>
  );
};

/* ─── main component ──────────────────────────────────── */

export default function RfqDetailModal({ show, onHide, rfqId, onUpdateSuccess, readOnly }) {
  const [data, setData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!show || !rfqId) return;
    fetchDetail();
  }, [show, rfqId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/Quotation/GetById/${rfqId}`);
      if (response.data?.success) setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    // Map API response to QuoteWizard format
    const mappedData = {
      ...data,
      id: rfqId,
      shippingMode: data.shippingMode || data.shippingModeId || null,
      deliveryTerm: data.deliveryTerm || data.deliveryTermId || null,
      shippingType: data.shippingType || data.shippingTypeId || null,
      shippingFromCountryId: data.shippingFromCountryId || null,
      shippingToCountryId: data.shippingToCountryId || null,
      
      needInsurance: data.needInsurance ? "yes" : "no",
      needCustomClearance: data.needCustomClearance ? "yes" : "no",
      
      isCargoHazardous: data.isCargoHazardous === null ? "notSure" : (data.isCargoHazardous ? "yes" : "no"),
      cargoStackable: data.cargoStackable === null ? "notSure" : (data.cargoStackable ? "yes" : "no"),
      isCargoPerishable: data.isCargoPerishable === null ? "notSure" : (data.isCargoPerishable ? "yes" : "no"),
      
      goodsReadyDate: data.goodsReadyDate ? new Date(data.goodsReadyDate).toISOString().split('T')[0] : "",
      
      cargoDetails: data.cargoDetails?.map(c => ({
        ...c,
        id: c.id || crypto.randomUUID(),
      })) || []
    };
    
    setEditData(mappedData);
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    onHide();
  };

  const handleExited = () => {
    setData(null);
    setEditData(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await client.get(`/Quotation/Delete/${rfqId}`);
      if (response.data?.success || response.status === 200) {
        toast.success("RFQ deleted successfully");
        setShowDeleteModal(false);
        handleClose();
        if (onUpdateSuccess) onUpdateSuccess();
      } else {
        toast.error("An error occurred while deleting the RFQ.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the RFQ.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    fetchDetail();
    if (onUpdateSuccess) onUpdateSuccess();
  };

  const hasStats =
    hasValue(data?.totalQuantity) ||
    hasValue(data?.totalVolume) ||
    hasValue(data?.totalWeight);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onExited={handleExited}
      centered
      size="xl"
    >
      {/* ── Header ── */}
      <Modal.Header closeButton className="rfq-modal-header">
        <div style={{ flex: 1 }}>
          <div className="rfq-modal-title">Request for Quotation</div>
          {data && (
            <div className="rfq-modal-meta">
              <span className="rfq-modal-ref-no">{data.referenceNo}</span>
              <StatusBadge label={data.quotationStatusName} />
            </div>
          )}
        </div>
      </Modal.Header>

      {/* ── Body ── */}
      <Modal.Body className="rfq-modal-body">
        {loading ? (
          <div className="rfq-loading-wrap">
            <Spinner animation="border" style={{ color: "#f97a29" }} />
          </div>
        ) : !data ? null : isEditing ? (
          <div className="rfq-edit-wrap">
             <QuoteWizard initialData={editData} onSuccess={handleUpdateSuccess} />
          </div>
        ) : (
          <div className="rfq-modal-inner">
            {/* ── Document Header Info ── */}
            <div className="rfq-doc-header">
              <div className="rfq-doc-header-grid">
                {hasValue(data.fromUserFullName) && (
                  <div>
                    <div className="rfq-field-label">Requested By</div>
                    <div className="rfq-field-value rfq-field-value--large">
                      {data.fromUserFullName}
                    </div>
                  </div>
                )}
                {hasValue(data.requestForQuotationDate) && (
                  <div>
                    <div className="rfq-field-label">Date</div>
                    <div className="rfq-field-value">
                      {formatDate(data.requestForQuotationDate)}
                    </div>
                  </div>
                )}
                {hasValue(data.goodsReadyDate) && (
                  <div>
                    <div className="rfq-field-label">Goods Ready</div>
                    <div className="rfq-field-value">
                      {formatDate(data.goodsReadyDate)}
                    </div>
                  </div>
                )}
              </div>

              {hasStats && (
                <div className="rfq-stats-row">
                  <Stat
                    label="Total Qty"
                    value={formatNumber(data.totalQuantity)}
                    unit="pcs"
                  />
                  <Stat
                    label="Total Weight"
                    value={formatNumber(data.totalWeight)}
                    unit="kg"
                  />
                  <Stat
                    label="Total Volume"
                    value={formatNumber(data.totalVolume)}
                    unit="cm³"
                  />
                </div>
              )}
            </div>

            {/* ── Shipment Information ── */}
            <Section title="Shipment Information" accentColor="#f97a29">
              <div className="row gy-3">
                <Field label="Shipping Mode" value={data.shippingModeName} />
                <Field label="Delivery Term" value={data.deliveryTermName} />
                <Field label="Shipping Type" value={data.shippingTypeName} />
              </div>
              <hr />
              <div className="row gy-3">
                <Field
                  label="Departure Country"
                  value={data.shippingFromCountryName}
                />
                <Field label="Port of Loading" value={data.portOfLoading} />
                <Field
                  label="Pick-Up Address"
                  value={data.pickUpAddress}
                />
              </div>
              <hr />
              <div className="row gy-3">
                <Field
                  label="Destination Country"
                  value={data.shippingToCountryName}
                />
                <Field
                  label="Port of Destination"
                  value={data.portOfDestination}
                />
                <Field
                  label="Delivery Address"
                  value={data.deliveryAddress}
                />
              </div>
            </Section>

            {/* ── Cargo Details ── */}
            {data.cargoDetails?.length > 0 && (
              <Section title="Cargo Details" accentColor="#3b82f6">
                <div className="rfq-cargo-cards">
                  {data.cargoDetails.map((cargo, index) => (
                    <div key={cargo.id || index} className="rfq-cargo-card">
                      <div className="rfq-cargo-label">Cargo {index + 1}</div>
                      <div className="rfq-cargo-fields">
                        <Field
                          auto
                          label="Container Type"
                          value={getTitleById(
                            CONTAINER_TYPES,
                            cargo.containerType,
                          )}
                        />

                        <Field
                          auto
                          label="Package Type"
                          value={getTitleById(PACKAGE_TYPES, cargo.packageType)}
                        />

                        <Field
                          auto
                          label="Truck Type"
                          value={getTitleById(TRUCK_TYPES, cargo.truckType)}
                        />

                        <Field
                          auto
                          label="ULD Container Type"
                          value={getTitleById(
                            ULD_CONTAINER_TYPES,
                            cargo.uldContainerType,
                          )}
                        />

                        <Field
                          auto
                          label="Wagon Type"
                          value={getTitleById(WAGON_TYPES, cargo.wagonType)}
                        />
                      </div>

                      <div className="rfq-cargo-fields">
                        <Field
                          auto
                          label="Quantity"
                          value={formatNumber(cargo.quantity)}
                        />
                        <Field
                          auto
                          label="Weight"
                          value={
                            cargo.weight
                              ? `${formatNumber(cargo.weight)} kg`
                              : null
                          }
                        />
                      </div>

                      <div className="rfq-cargo-fields">
                        <Field
                          auto
                          label="Length"
                          value={cargo.length ? `${cargo.length} cm` : null}
                        />
                        <Field
                          auto
                          label="Width"
                          value={cargo.width ? `${cargo.width} cm` : null}
                        />
                        <Field
                          auto
                          label="Height"
                          value={cargo.height ? `${cargo.height} cm` : null}
                        />
                      </div>

                      <div className="rfq-cargo-fields">
                        <Field
                          auto
                          label="Oversized"
                          value={cargo.oversizedCargo ? "Yes" : null}
                        />
                        <Field auto label="Loading Rate" value={cargo.loadingRate} />
                        <Field
                          auto
                          label="Discharging Rate"
                          value={cargo.dischargingRate}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Cargo Information ── */}
            <Section title="Cargo Information" accentColor="#8b5cf6">
              <div className="row gy-3">
                <Field
                  label="Product Description"
                  value={data.productDescription}
                  wide
                />
                <Field
                  label="Hazardous Cargo"
                  value={renderYesNo(data.isCargoHazardous)}
                />
                <Field label="IMO Class" value={data.imoClassName} />
                <Field
                  label="UN Number"
                  value={hasValue(data.unNumber) ? data.unNumber : null}
                />
                <Field
                  label="Cargo Stackable"
                  value={renderYesNo(data.cargoStackable)}
                />
                <Field
                  label="Cargo Perishable"
                  value={renderYesNo(data.isCargoPerishable)}
                />
                <Field
                  label="Temperature Type"
                  value={data.temperatureTypeName}
                />
                <Field
                  label="Temperature Regime"
                  value={data.temperatureRegime}
                />
              </div>
            </Section>

            {/* ── Insurance & Customs ── */}
            <Section title="Insurance & Customs" accentColor="#10b981">
              <div className="row gy-3">
                <Field
                  label="Need Insurance"
                  value={renderYesNo(data.needInsurance)}
                />
                <Field
                  label="Insurance Currency"
                  value={data.insuranceCurrencyName}
                />
                <Field
                  label="Insurance Amount"
                  value={
                    data.insuranceAmount
                      ? formatNumber(data.insuranceAmount, 2)
                      : null
                  }
                />
                <Field
                  label="Custom Clearance"
                  value={renderYesNo(data.needCustomClearance)}
                />
              </div>
            </Section>

            {/* ── Additional Information ── */}
            {hasValue(data.additionalInformation) && (
              <Section title="Additional Information" accentColor="#64748b">
                <p className="rfq-additional-text">
                  {data.additionalInformation}
                </p>
              </Section>
            )}
          </div>
        )}
      </Modal.Body>

      {/* ── Footer ── */}
      <Modal.Footer className="rfq-modal-footer">
        {!readOnly && !isEditing && data?.quotationStatusName?.toLowerCase() === "open" && (
          <div className="me-auto">
            <button className="rfq-detail-modal-close-btn rfq-detail-modal-delete-btn" style={{marginRight: '8px'}} onClick={() => setShowDeleteModal(true)}>
              Delete
            </button>
            <button className="rfq-detail-modal-close-btn" onClick={handleEditClick}>
              Edit
            </button>
          </div>
        )}
        {isEditing && (
          <div className="me-auto">
            <button className="rfq-detail-modal-close-btn rfq-detail-modal-cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel Edit
            </button>
          </div>
        )}
        <button className="rfq-detail-modal-close-btn" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered
        style={{ zIndex: 1060, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <Modal.Header closeButton className="d-flex justify-content-between align-items-center w-100">
          <Modal.Title className="m-0">Delete Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this quotation? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
}
