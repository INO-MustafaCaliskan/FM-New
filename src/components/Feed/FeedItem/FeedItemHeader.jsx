import { BiSolidEditAlt, BiSolidTrashAlt, BiDotsVerticalRounded } from "react-icons/bi";
import { GoReport } from "react-icons/go";
import { Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useFeed from "@/context/FeedContext";
import { useState } from "react";
import FeedAvatar from "../FeedAvatar";
import Link from "next/link";
import styles from './FeedItemHeader.module.css';
import FeedDropdown from "../Common/FeedDropdown";
import useFormatDate from "@/utils/hooks/useFormatDate";

const REPORT_REASONS = {
    SPAM: { label: "It's spam", value: "0" },
    HARASSMENT: { label: "Harassment", value: "1" },
    HATE_SPEECH: { label: "Hate Speech", value: "2" },
    VIOLENCE: { label: "Violence", value: "3" },
    MISINFORMATION: { label: "Misinformation", value: "4" },
    OTHER: { label: "Other", value: "5" },
}

export const FeedItemHeader = ({ feedId, slug, createdDate, userImageUrl, userFullName, companyName, isOwnFeed, onEdit }) => {
    const { deleteFeed, processing, reportFeed } = useFeed(state => state);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [reportModalShow, setReportModalShow] = useState(false);
    const [reportReason, setReportReason] = useState(null);
    const formatDate = useFormatDate()

    const handleDelete = async () => {
        await deleteFeed(feedId);
        setDeleteModalShow(false);
    }

    const handleReport = async () => {
        if (!reportReason) return;
        await reportFeed(feedId, reportReason);
        setReportModalShow(false);
    }

    const selectReason = (reason) => {
        setReportReason(reason);
    }

    const onHideReport = () => {
        if (processing) return;
        setReportModalShow(false);
        setReportReason(null);
    }

    return (
        <>
            <div className='feed-header d-flex flex-row justify-content-between'>
                <div className='d-flex flex-row'>
                    <FeedAvatar imageUrl={userImageUrl} altName={userFullName} />
                    <div className='ms-3 d-flex flex-column justify-content-center'>
                        <Link href={`/user-profile/${slug}`} title="View Profile">
                            <p className={`mb-1 ${styles.ufn}`}>{userFullName}</p>
                        </Link>
                        <p className={`mb-0 ${styles.ucn}`}>{companyName}</p>
                        <Link href={`/feed/${feedId}`} title="View Feed">
                            <span className={styles.date} >{formatDate(createdDate, true)}</span>
                        </Link>
                    </div>
                </div>
                <div>
                    <FeedDropdown
                        items={isOwnFeed
                            ? [
                                { key: 'edit', label: <><BiSolidEditAlt /> Edit</>, onClick: onEdit },
                                { key: 'delete', label: <><BiSolidTrashAlt /> Delete</>, onClick: () => setDeleteModalShow(true) }
                            ]
                            : [
                                { key: 'report', label: <><GoReport /> Report</>, onClick: () => setReportModalShow(true) }
                            ]
                        }
                    />
                </div>
            </div>
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} backdrop={processing ? "static" : true} keyboard={!processing} className="secondary-modal">
                <Modal.Header>
                    <Modal.Title>Delete Feed</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this feed? This action cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModalShow(false)} disabled={processing}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={processing}>
                        {
                            processing ? <Spinner animation="border" size="sm" /> : 'Delete !'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={reportModalShow} onHide={onHideReport} backdrop={processing ? "static" : true} keyboard={!processing} style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Modal.Header>
                    <Modal.Title>Report Feed</Modal.Title>
                </Modal.Header>
                <Modal.Body>What is the reason for reporting this feed?
                    <div className="mt-3">
                        {
                            Object.values(REPORT_REASONS).map(reason => (
                                <Button key={reason.value} variant={reportReason === reason.value ? "danger" : "outline-danger"} className="me-2 mb-2" onClick={() => selectReason(reason.value)}>
                                    {reason.label}
                                </Button>
                            ))
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideReport} disabled={processing}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleReport} disabled={processing || !reportReason}>
                        {
                            processing ? <Spinner animation="border" size="sm" /> : 'Report'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
