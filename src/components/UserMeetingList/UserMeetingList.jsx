"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faPhone,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCalendar,
  faCalendarDays,
} from "@fortawesome/free-regular-svg-icons";
import { Tab, Tabs } from "react-bootstrap";
import Link from "next/link";
import client from "@/utils/client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import HumanizedDate from "../UI/HumanizedDate ";
import useFormatDate from "@/utils/hooks/useFormatDate";
import MeetingActions from "../MeetingActions/MeetingActions";
import InoPagination from "../UI/InoPagination";
import { useSearchParams } from "next/navigation";

const VALID_TYPES = ["summary", "confirmed", "pending"];

const FilteredMeetings = ({
  meetings,
  fetchMeetings,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = useFormatDate();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (column) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const sortMeetings = (meetings) => {
    const sortedMeetings = [...meetings];
    if (sortColumn === "delegate") {
      sortedMeetings.sort((a, b) => {
        const nameA =
          `${a.delegateFirstName} ${a.delegateLastName}`.toLowerCase();
        const nameB =
          `${b.delegateFirstName} ${b.delegateLastName}`.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortColumn === "subject") {
      sortedMeetings.sort((a, b) => {
        const timeA = new Date(a.startTime).getTime(); // Başlama zamanını zaman damgasına dönüştür
        const timeB = new Date(b.startTime).getTime(); // Başlama zamanını zaman damgasına dönüştür
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      });
    } else if (sortColumn === "dayTiming") {
      sortedMeetings.sort((a, b) => {
        const dateA = new Date(a.startTime).getTime();
        const dateB = new Date(b.startTime).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (sortColumn === "status") {
      sortedMeetings.sort((a, b) => {
        const statusA = a.zoomMeetingStatusName.toLowerCase();
        const statusB = b.zoomMeetingStatusName.toLowerCase();
        return sortDirection === "asc"
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      });
    }
    return sortedMeetings;
  };

  const sortedMeetings = sortMeetings(meetings);

  return (
    <div>
      <div className="table-responsive">
        <table className="table my-meeting-table-component">
          <thead>
            <tr>
              <th >#</th>
              <th className="col-3" onClick={() => handleSort("delegate")}>
                <div className="d-lg-flex align-items-center">
                  Delegate &nbsp;
                  {sortColumn === "delegate" ? (
                    <FontAwesomeIcon
                      color="grey"
                      icon={sortDirection === "asc" ? faSortUp : faSortDown}
                    />
                  ) : (
                    <FontAwesomeIcon color="lightgray" icon={faSort} />
                  )}
                </div>
              </th>
              <th onClick={() => handleSort("subject")}>
                <div >
                  Subject &nbsp;
                  {sortColumn === "subject" ? (
                    <FontAwesomeIcon
                      color="grey"
                      icon={sortDirection === "asc" ? faSortUp : faSortDown}
                    />
                  ) : (
                    <FontAwesomeIcon color="lightgray" icon={faSort} />
                  )}
                </div>
              </th>
              <th onClick={() => handleSort("dayTiming")}>
                Day/Timing
              </th>
              <th onClick={() => handleSort("status")}>
                <div >
                  Status &nbsp;
                  {sortColumn === "status" ? (
                    <FontAwesomeIcon
                      color="grey"
                      icon={sortDirection === "asc" ? faSortUp : faSortDown}
                    />
                  ) : (
                    <FontAwesomeIcon color="lightgray" icon={faSort} />
                  )}
                </div>
              </th>
              <th >Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedMeetings.map((meetingg, i) => (
              <tr key={meetingg.id}>
                <td>
                  <FontAwesomeIcon
                    icon={meetingg.zoomMeetingType === 1 ? faPhone : faCalendar}
                    className="list-icon"
                    color="grey"
                  />
                </td>
                <td>
                  <div className="meeting-profile meeting-history-item-card d-flex">
                    <div className="col-auto list-delegate">
                      <Image
                        className="my-meeting-avatar"
                        alt={meetingg.delegateFirstName}
                        src={
                          meetingg.delegateImageUrl || "/images/no-photo.png"
                        }
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className="col-8 my-meetings-user-info">
                      <p className="my-meeting-userfullname ">
                        {meetingg.delegateFirstName} {meetingg.delegateLastName}
                      </p>
                      <p className="my-meeting-job-title">
                        {meetingg.delegateJobTitleName}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="my-meeting-subject-text">
                      {meetingg.zoomMeetingTypeName}
                    </p>
                    <p className="mb-0">
                      <HumanizedDate
                        dateString={meetingg.startTime}
                        className="meeting-date-text"
                      />
                    </p>
                  </div>
                </td>
                <td>
                  <div className="meeting-history-item-card my-meeting-datetimes d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="list-icon"
                      color="#ffb382"
                    />
                    <div className="my-meeting-datetime-items">
                      <p className="my-meeting-datetime-text">
                        <span>
                          {formatDate(
                            meetingg.startTime,
                            false,
                            false,
                            "dayOfWeek"
                          )}
                        </span>
                      </p>
                      <p className="my-meeting-datetime-hour">
                        <HumanizedDate
                          dateString={meetingg.startTime}
                          className="meeting-date-text"
                          showTime
                          showHours={false}
                        />
                        {meetingg.zoomMeetingType !== 1 && meetingg.endTime && (
                          <>
                            {" - "}
                            <HumanizedDate
                              dateString={meetingg.endTime}
                              className="meeting-date-text"
                              showTime
                              showHours={false}
                            />
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="meeting-list-item-card">
                    <p className="meeting-history-badge">
                      {meetingg.zoomMeetingStatusName === "Created"
                        ? "Confirmed"
                        : meetingg.zoomMeetingStatusName === "Ended"
                          ? "Completed"
                          : meetingg.zoomMeetingStatusName === "Started"
                            ? "Started"
                            : meetingg.zoomMeetingStatusName}
                    </p>
                  </div>
                </td>
                <td>
                  <MeetingActions
                    meeting={meetingg}
                    afterSubmit={fetchMeetings}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!meetings.length && (
        <div
          className="col-lg-12 text-center not-found-wrapper linear-bg"
          style={{ width: "auto !important", padding: "1.5rem" }}
        >
          <Image
            alt="not-found-img"
            src="/images/not-found.png"
            className="not-found-img"
            width={256}
            height={256}
          />
          <h3>Not Found Result</h3>
        </div>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-2">
          <InoPagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

const UserMeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    VALID_TYPES.includes(tab) ? tab : "pending"
  );
  const itemsPerPage = 15;

  const handleChangeTab = (key) => {
    if (!key) {
      return;
    }

    setCurrentPage(1);
    setActiveTab(key);
    let newUrl = `/my-meetings?tab=${key}`;
    window.history.pushState({}, "", newUrl);
  };

  const fetchMeetings = useCallback(async () => {
    try {
      const type = VALID_TYPES.includes(activeTab) ? activeTab : "pending";

      const res = await client.get(
        `ZoomMeeting/GetLoginUserZoomMeetings?pageNumber=${currentPage}&pageSize=${itemsPerPage}&type=${type}&searchText=${encodeURIComponent(searchQuery)}`
      );
     
      const listRes = res?.data?.data?.listItems || [];
      const totalPage = res?.data?.data?.totalPage || 0;

      setMeetings(listRes);
      setTotalPages(totalPage);
    } catch (err) {
      console.log(err);
    }
  }, [activeTab, currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    if (tab && VALID_TYPES.includes(tab) && tab !== activeTab) {
      setCurrentPage(1);
      setActiveTab(tab);
    }
  }, [tab, activeTab]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="my-meetings-search-section">
        <div className="d-flex justify-content-between meetings-buttons align-items-center">
          <div
            className="col-12 col-md-4 my-2 position-relative pr-0 pl-0"
            style={{ paddingLeft: "0" }}
          >
            <form id="searchMeeting" onSubmit={handleSearchSubmit}>
              <label
                htmlFor="search-meeting"
                className="form-label search-meeting-input-label"
                style={{ top: "9px !important" }}
              >
                Search Meetings
              </label>
              <input
                type="text"
                className="form-control"
                id="search-meeting"
                placeholder="Enter User Name"
                aria-describedby="search-meeting-help"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <button
                className="position-absolute"
                type="submit"
                style={{ top: "44%", right: "4%", zIndex: "2" }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <button
                className="position-absolute"
                id="meetingSearchClearBtn"
                type="button"
                style={{
                  top: "36%",
                  right: "4%",
                  zIndex: "2",
                  display: searchInput ? "block" : "none",
                }}
                onClick={handleClearSearch}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
              <div id="search-meeting-help" className="form-text"></div>
            </form>
          </div>
          <div className="col-12 col-md-2 my-4 pr-0 new-meeting-btn-col">
            <Link
              className="btn w-100 h-100 py-3 px-2"
              id="createScheduleMeeting"
              href="/global-networkers"
              title="Schedule a New Meeting"
            >
              <FontAwesomeIcon icon={faPlus} /> New Meeting
            </Link>
          </div>
        </div>
      </div>
      <div id="meeting-history-section" className="pt-0"></div>

      <Tabs
        activeKey={activeTab}
        onSelect={(selectedTab) => handleChangeTab(selectedTab)}
        defaultActiveKey={activeTab}
        mountOnEnter={true}
        unmountOnExit={false}
        className="mb-3 border-0 d-flex"
        fill
      >
        <Tab
          eventKey="pending"
          title="Pending"
        >
          <FilteredMeetings
            meetings={meetings}
            fetchMeetings={fetchMeetings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Tab>
        <Tab
          eventKey="confirmed"
          title="Confirmed"
        >
          <FilteredMeetings
            meetings={meetings}
            fetchMeetings={fetchMeetings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Tab>
        <Tab eventKey="summary" title="Summary">
          <FilteredMeetings
            meetings={meetings}
            fetchMeetings={fetchMeetings}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserMeetingList;
