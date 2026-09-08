import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Table, Dropdown, Spinner, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BiStar, BiSolidStar, BiVideo, BiMessageRounded, BiCalendar, BiDotsVerticalRounded, BiTrash, BiUser } from 'react-icons/bi';
import InoPagination from "@/components/UI/InoPagination";
import { InoSelect } from '@/components/UI/InoSelect';
import InoButton from '@/components/Buttons/InoButton';
import client from '@/utils/client';
import { getCountries, getCategories } from '@/utils/apiActions';
import { useSignalR } from "@/context/SignalRContext2";
import { useMeetingStore } from "@/context/MeetingContext";
import NetworkersCreateSheduleModal from "@/components/GlobalNetworkers/NetworkersCreateSheduleModal";
import { toast } from 'react-toastify';
import './my-networks-list.css';

const PAGE_SIZES = [12, 24, 48];
const DEFAULT_PAGE_SIZE = 12;

// CountrySelect / InoSelect pattern: countryCode → flagcdn.com/w20/{code}.png
const getFlagUrl = (countryCode) => {
  if (!countryCode) return null;
  if (countryCode === 'TRNC') return '/images/north-cyprus.png';
  return `https://flagcdn.com/w20/${countryCode.toLowerCase().slice(0, 2)}.png`;
};

// Tooltip that only renders/displays if the text is truncated / overflowing
const TruncatedTooltip = ({ text, id, children, className = '' }) => {
  const containerRef = React.useRef(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

  const checkTruncation = React.useCallback(() => {
    if (containerRef.current) {
      const target = containerRef.current.classList.contains('text-truncate')
        ? containerRef.current
        : containerRef.current.querySelector('.text-truncate') || containerRef.current;

      setIsTruncated(target.scrollWidth > target.clientWidth);
    }
  }, []);

  React.useEffect(() => {
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [checkTruncation, text]);

  const content = (
    <div
      ref={containerRef}
      onMouseEnter={checkTruncation}
      className={className}
    >
      {children || text}
    </div>
  );

  if (!isTruncated || !text) {
    return content;
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={id} className="custom-orange-tooltip">{text}</Tooltip>}
    >
      {content}
    </OverlayTrigger>
  );
};

const MyNetworksList = () => {
  const signalRContext = useSignalR();
  const getQuickChatUser = signalRContext?.getQuickChatUser;
  const makeInstantCall = useMeetingStore((state) => state.makeInstantCall);

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Local filter states (inputs)
  const [searchText, setSearchText] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Applied filter states (passed to API)
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [appliedCountry, setAppliedCountry] = useState(null);
  const [appliedCategory, setAppliedCategory] = useState(null);

  const [countryOptions, setCountryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Map of userId -> boolean override for favorite status
  const [favorites, setFavorites] = useState({});

  // Active user states for modals
  const [scheduleUserId, setScheduleUserId] = useState(null);
  const [removeConnectionUser, setRemoveConnectionUser] = useState(null);

  useEffect(() => {
    getCountries().then((data) => {
      setCountryOptions(
        (data ?? []).map((c) => ({
          value: c.id,
          label: c.name,
          countryCode: c.countryCode
        }))
      );
    });
    getCategories().then((data) => {
      setCategoryOptions(
        (data ?? []).map((c) => ({ value: c.id, label: c.name }))
      );
    });
  }, []);

  // baseURL already contains /api — do NOT add /api prefix here
  const fetchConnections = useCallback(async (page, size, search, countryId, categoryId) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pageNumber', page);
      params.append('pageSize', size);
      if (search) params.append('generalSearch', search);
      if (countryId) params.append('countryId', countryId);
      if (categoryId) params.append('categoryId', categoryId);

      const response = await client.get(`/NetworkConnection/MyConnections?${params.toString()}`);
      const resData = response.data;

      if (resData?.success && resData?.data) {
        const data = resData.data;
        setConnections(data.listItems ?? []);
        setCurrentPage(data.currentPage ?? page);
        setTotalPage(data.totalPage ?? 1);
        setTotalCount(data.totalCount ?? 0);
      }
    } catch (error) {
      console.error('[MyNetworksList] Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections(currentPage, pageSize, appliedSearchText, appliedCountry?.value, appliedCategory?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, appliedCountry, appliedCategory, appliedSearchText]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCountryChange = (option) => { setSelectedCountry(option); };
  const handleCategoryChange = (option) => { setSelectedCategory(option); };

  const handleSearch = () => {
    setAppliedCountry(selectedCountry);
    setAppliedCategory(selectedCategory);
    setAppliedSearchText(searchText);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSelectedCountry(null);
    setSelectedCategory(null);
    setSearchText('');
    setAppliedCountry(null);
    setAppliedCategory(null);
    setAppliedSearchText('');
    setCurrentPage(1);
  };

  const handleCall = (usr) => {
    makeInstantCall({
      id: usr.id,
      firstName: usr.firstName || '',
      lastName: usr.lastName || '',
      fTalkId: usr.fTalkId || '',
      imageUrl: usr.imageUrl || '',
    });
  };

  const handleMessage = async (userId) => {
    if (getQuickChatUser) {
      await getQuickChatUser(userId);
    }
  };

  const handleRemoveConnectionConfirm = async () => {
    if (!removeConnectionUser) return;
    try {
      const response = await client.get(`/NetworkConnection/Remove/${removeConnectionUser.id}`);
      if (response.data?.success) {
        toast.success("Connection removed successfully.");
        fetchConnections(currentPage, pageSize, appliedSearchText, appliedCountry?.value, appliedCategory?.value);
      } else {
        toast.error(response.data?.message || "Failed to remove connection.");
      }
    } catch (error) {
      console.error("[MyNetworksList] Remove connection error:", error);
      toast.error("An error occurred while removing the connection.");
    } finally {
      setRemoveConnectionUser(null);
    }
  };

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };

  const toggleFavorite = async (targetUser) => {
    if (!targetUser?.id) return;
    const userId = targetUser.id;
    const currentFav = favorites[userId] ?? targetUser.isFavorite ?? false;
    const nextFav = !currentFav;

    setFavorites(prev => ({ ...prev, [userId]: nextFav }));

    try {
      const response = await client.get(`/UserFavorite/AddOrRemoveForLoginUser/${userId}`);
      if (response.data?.success) {
        if (nextFav) {
          toast.info("User added to your favorites");
        }
      } else {
        // Revert state if failed
        setFavorites(prev => ({ ...prev, [userId]: currentFav }));
        toast.error(response.data?.message || "Failed to update favorite status.");
      }
    } catch (error) {
      console.error("[MyNetworksList] Toggle favorite error:", error);
      setFavorites(prev => ({ ...prev, [userId]: currentFav }));
      toast.error("An error occurred while updating favorite status.");
    }
  };

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className="my-networks-list-card w-100">
      <Card.Body className="p-4">

        {/* ── Filters ─────────────────────────────────────────── */}
        <div className="row align-items-end mb-4">
          <div className="col-lg-10 col-md-12">
            <div className="row">
              {/* Country */}
              <div className="col-12 col-md-4 mb-3 mb-lg-0">
                <InoSelect
                  label="Search by Country"
                  placeholder="Select Country"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  options={countryOptions}
                  name="mn-country"
                />
              </div>

              {/* Category */}
              <div className="col-12 col-md-4 mb-3 mb-lg-0">
                <InoSelect
                  label="Search by Category"
                  placeholder="Select Category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  name="mn-category"
                />
              </div>

              {/* Search Term */}
              <div className="col-12 col-md-4 mb-3 mb-lg-0">
                <div>
                  <label className="form-label">Search Term</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={searchText}
                      onChange={handleSearchChange}
                      placeholder="Enter Name, Company or Email"
                      className="talk-select form-control"
                      style={{ paddingRight: '30px' }}
                    />
                    {searchText && (
                      <span
                        onClick={() => setSearchText('')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          fontSize: '1.2rem',
                          zIndex: 10,
                          lineHeight: 1
                        }}
                        title="Clear search"
                      >
                        &times;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-12">
            <div className="d-flex flex-row gap-2 network-filter-btn mt-3 mt-lg-0">
              <InoButton title="Search" onClick={handleSearch} />
              <InoButton isOutline title="Clear" onClick={handleClear} />
            </div>
          </div>
        </div>

        {/* ── Title ───────────────────────────────────────────── */}
        <h6 className="connections-title fw-bold mb-3 fs-6">
          My Connections ({totalCount})
        </h6>

        {/* ── Table ───────────────────────────────────────────── */}
        <div className="table-responsive">
          <Table hover className="align-middle my-networks-table mb-0 border-top">
            <thead>
              <tr>
                <th className="col-fav" style={{ width: '50px' }}></th>
                <th className="col-name">Name</th>
                <th className="col-company">Company</th>
                <th className="col-country">Country</th>
                <th className="col-category">Category</th>
                <th className="text-center col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span className="text-muted">Loading connections...</span>
                  </td>
                </tr>
              ) : connections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No connections found.
                  </td>
                </tr>
              ) : (
                connections.map((conn, index) => {
                  const { networkConnectionId, user } = conn;
                  const isFav = favorites[user?.id] ?? user?.isFavorite ?? false;
                  const fullName = user?.fullName
                    || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
                    || '?';
                  const flagUrl = getFlagUrl(user?.countryCode);

                  return (
                    <tr key={networkConnectionId ?? user?.id ?? index}>

                      {/* Favourite */}
                      <td className="text-center px-1 col-fav">
                        {isFav ? (
                          <span
                            onClick={() => toggleFavorite(user)}
                            style={{ cursor: 'pointer' }}
                            title="Remove Favorite"
                          >
                            <BiSolidStar className="star-icon text-warning fs-5" />
                          </span>
                        ) : (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-fav-${networkConnectionId}`} className="custom-orange-tooltip">Add Favorite and Follow</Tooltip>}
                          >
                            <span
                              onClick={() => toggleFavorite(user)}
                              style={{ cursor: 'pointer' }}
                            >
                              <BiStar className="star-icon text-muted fs-5" />
                            </span>
                          </OverlayTrigger>
                        )}
                      </td>

                      {/* Name + Avatar */}
                      <td className="col-name">
                        <div className="d-flex align-items-center gap-3 py-1" style={{ minWidth: 0 }}>
                          <div className="avatar-placeholder rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center text-white fw-bold">
                            {user?.imageUrl
                              ? <img src={user.imageUrl} alt={fullName} />
                              : fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden" style={{ minWidth: 0 }}>
                            <TruncatedTooltip
                              text={fullName}
                              id={`tt-name-${networkConnectionId}`}
                              className="fw-bold text-dark text-truncate"
                            >
                              {fullName}
                            </TruncatedTooltip>
                            {user?.jobTitle && (
                              <TruncatedTooltip
                                text={user.jobTitle}
                                id={`tt-job-${networkConnectionId}`}
                                className="text-muted small text-truncate"
                              >
                                {user.jobTitle}
                              </TruncatedTooltip>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="text-secondary col-company">
                        {user?.companyName ? (
                          <TruncatedTooltip
                            text={user.companyName}
                            id={`tt-comp-${networkConnectionId}`}
                            className="text-truncate"
                          >
                            {user.companyName}
                          </TruncatedTooltip>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>

                      {/* Country + Flag */}
                      <td className="text-secondary col-country">
                        {user?.countryName ? (
                          <TruncatedTooltip
                            text={user.countryName}
                            id={`tt-ctry-${networkConnectionId}`}
                            className="d-flex align-items-center overflow-hidden"
                          >
                            {flagUrl && (
                              <img
                                src={flagUrl}
                                alt={user.countryName}
                                width={20}
                                height={15}
                                className="me-2 rounded-1 shadow-sm flex-shrink-0"
                                style={{ objectFit: 'cover' }}
                              />
                            )}
                            <span className="text-truncate">{user.countryName}</span>
                          </TruncatedTooltip>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="text-secondary col-category">
                        {user?.categoryName ? (
                          <TruncatedTooltip
                            text={user.categoryName}
                            id={`tt-cat-${networkConnectionId}`}
                            className="text-truncate"
                          >
                            {user.categoryName}
                          </TruncatedTooltip>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="text-center col-actions">
                        <div className="d-flex align-items-center justify-content-center gap-3 action-icons">
                          <BiVideo 
                            onClick={() => handleCall(user)} 
                            className="fs-5 cursor-pointer text-muted action-icon" 
                            title="Video Call" 
                          />
                          <BiMessageRounded 
                            onClick={() => handleMessage(user?.id)} 
                            className="fs-5 cursor-pointer text-muted action-icon" 
                            title="Message" 
                          />
                          <BiCalendar 
                            onClick={() => setScheduleUserId(user?.id)} 
                            className="fs-5 cursor-pointer text-muted action-icon" 
                            title="Meeting" 
                          />
                          <Dropdown>
                            <Dropdown.Toggle as="div" className="cursor-pointer d-inline-block p-0 hide-dropdown-arrow">
                              <BiDotsVerticalRounded className="fs-5 text-muted action-icon" title="More" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="action-dropdown-menu shadow border-0 py-2">
                              <Dropdown.Item
                                href={`/user-profile/${user?.slug ?? user?.id}`}
                                className="text-dark d-flex align-items-center px-3 py-2 action-dropdown-item"
                              >
                                <BiUser className="me-2 fs-5 text-secondary" />
                                <span>View Profile</span>
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => setRemoveConnectionUser(user)}
                                className="text-danger d-flex align-items-center px-3 py-2 action-dropdown-item action-dropdown-item-danger"
                                style={{ cursor: 'pointer' }}
                              >
                                <BiTrash className="me-2 fs-5" />
                                <span>Remove Connection</span>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>

        {/* ── Pagination ──────────────────────────────────────── */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mt-4">
          <div className="text-muted small mb-3 mb-md-0">
            {totalCount > 0
              ? `Showing ${startItem} to ${endItem} of ${totalCount} connections`
              : 'No connections found'}
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3">
            {totalPage > 1 && (
              <InoPagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPage={totalPage}
              />
            )}
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small text-nowrap">Rows per page</span>
              <Form.Select
                size="sm"
                className="shadow-none w-auto border-light text-secondary filter-select"
                style={{ height: 'auto', minWidth: 'auto' }}
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </div>
          </div>
        </div>

        {/* Modals */}
        {scheduleUserId && (
          <NetworkersCreateSheduleModal
            show={!!scheduleUserId}
            handleClose={() => setScheduleUserId(null)}
            userId={scheduleUserId}
          />
        )}

        <Modal show={!!removeConnectionUser} onHide={() => setRemoveConnectionUser(null)} centered>
          <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
            <Modal.Title className="fs-5 fw-bold mb-0">Remove Connection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove <strong>{removeConnectionUser?.fullName || `${removeConnectionUser?.firstName ?? ''} ${removeConnectionUser?.lastName ?? ''}`.trim() || '?'}</strong> from your network?
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button 
              className="btn ino-button-gray-outline px-4 d-flex justify-content-center align-items-center" 
              style={{ minWidth: '120px', height: '36px' }} 
              onClick={() => setRemoveConnectionUser(null)}
            >
              Cancel
            </button>
            <button 
              className="btn ino-button-red px-4 d-flex justify-content-center align-items-center" 
              style={{ minWidth: '120px', height: '36px' }} 
              onClick={handleRemoveConnectionConfirm}
            >
              Remove
            </button>
          </Modal.Footer>
        </Modal>

      </Card.Body>
    </Card>
  );
};

export default MyNetworksList;
