"use client"

import InoBreadcrumb from '@/components/InoBreadcrumb/InoBreadcrumb'
import React, { useEffect, useState } from 'react'
import { FaBuilding, FaGift, FaRegCopy, FaRegEnvelope, FaRegPaperPlane, FaUser, FaCheck } from 'react-icons/fa'
import { IoInformationCircleOutline } from 'react-icons/io5'

import Image from 'next/image'
import { InoSelect } from '@/components/UI/InoSelect'
import { PhoneNumberSelect } from '@/components/UI/PhoneNumberSelect'
import { getCategories } from '@/utils/apiActions'
import client from '@/utils/client'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReferralSuccessModal from '@/components/ReferralSuccessModal/ReferralSuccessModal'
import './style.css'
import { useUser } from "@/context/UserContext";
const MySwal = withReactContent(Swal)
const Page = () => {
    const [industryOptions, setIndustryOptions] = useState([])
    const [referralForm, setReferralForm] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        industry: '',
        email: '',
        mobileNumberCountryCode: '+1',
        mobileNumberCountryIso: 'us',
        mobilePhone: '',
        acceptRewardRules: false,

    })
    const { user } = useUser();
    console.log('user', user)
    const [referrals, setReferrals] = useState([])
    const [copiedReferralId, setCopiedReferralId] = useState(null);
    const [copiedMainReferralLink, setCopiedMainReferralLink] = useState(false);
    const [successModalShow, setSuccessModalShow] = useState(false);
    const [successEmail, setSuccessEmail] = useState('');
    const handleCopyLink = async (referralId, referralLink) => {
        await navigator.clipboard.writeText(referralLink);

        setCopiedReferralId(referralId);

        setTimeout(() => {
            setCopiedReferralId(null);
        }, 2000);
    };

    const handleCopyMainReferralLink = async () => {
        const mainReferralLink = `${window.location.origin}/sign-up?referral=${user.fTalkId}`;
        await navigator.clipboard.writeText(mainReferralLink);

        setCopiedMainReferralLink(true);

        setTimeout(() => {
            setCopiedMainReferralLink(false);
        }, 2000);
    };
    useEffect(() => {
        getCategories().then((categories) => {
            setIndustryOptions(
                categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                }))
            )
        })
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await client.get(
                "/Referral/MyReferrals"
            )
            const responseData = response.data.data;
            setReferrals(responseData);



        }
        fetchData();

    }, [])
    const handleConfirm = async (e) => {
        e.preventDefault()

        const response = await MySwal.fire({
            title: 'Confirm Referral',
            icon: 'warning',
            html: `
            <div style="text-align: left; font-size: 14px; line-height: 2">
                <p><strong>Email:</strong> ${referralForm.email}</p>
            </div>
        `,
            showConfirmButton: true,
            confirmButtonText: 'Confirm',
            showCancelButton: true,
            confirmButtonColor: '#EF6C00',
        })

        if (response.isConfirmed) {
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        const payload = {
            Email: referralForm.email,
        }

        try {
            await client.post('/Referral/Add', payload)

            const response = await client.get('/Referral/MyReferrals')
            setReferrals(response.data.data)

            setSuccessEmail(referralForm.email)
            setSuccessModalShow(true)

            setReferralForm({
                firstName: '',
                lastName: '',
                companyName: '',
                industry: '',
                email: '',
                mobileNumberCountryCode: '+1',
                mobileNumberCountryIso: 'us',
                mobilePhone: '',
                acceptRewardRules: false,
            })

        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Something went wrong. Please try again.'

            if (errorMessage.includes('no-membership')) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Your Membership Has Expired!',
                    html: `
            <p style="text-align: justify;">
                To submit referrals and participate in the Freight Talk Refer a Friend Program, you must have an
                active membership. Renew your membership to continue enjoying member benefits and start
                earning referral rewards.
            </p>
        `,
                    confirmButtonText: 'Renew Membership Now',
                    confirmButtonColor: '#EF6C00',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/pricing/';
                    }
                });
            }
            else if (errorMessage.includes('email-already-member')) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Already a Freight Talk Member',
                    html: `<p style="text-align: justify;">This professional is already a Freight Talk member. Please recommend another trusted professional from your contacts.</p>`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#EF6C00',
                })
            }
            else if (errorMessage.includes('already-added')) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Referral Already Submitted',
                    html: `<p style="text-align: justify;">This professional has already been invited through Freight Talk's Refer a Friend Program. Please recommend another trusted professional from your network.</p>`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#EF6C00',
                })
            }
            else if (errorMessage.includes('no-limit')) {
                MySwal.fire({
                    icon: 'error',
                    title: 'Referral Limit Reached',
                    html: `<p style="text-align: justify;">You have reached your maximum referral limit of 250 invitations for this period. Please wait for your next referral cycle to submit more invitations.</p>`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#EF6C00',
                })
            }
            else {
                MySwal.fire({

                    icon: 'error',
                    html: `<p style="text-align: justify;">${errorMessage}</p>`,
                    confirmButtonColor: '#EF6C00',
                })
            }
        }
    }

    return (
        <>
            <div className='container '>
                <InoBreadcrumb linkName="Refer a Friend" />
                <section className='card p-4 mb-4 refer-card'>
                    <div
                        className='d-flex flex-column flex-lg-row align-items-start justify-content-between gap-4 pb-3 mb-4 border-bottom'>
                        <div className='refer-a-friend-head'>
                            <h1 className='fw-bold mb-2'>Refer A Friend</h1>
                            <p className='mb-0 text-muted'>
                                Invite your business connections to join Freight Talk and earn rewards.
                                <br />
                                {/* You can add 1 referral or up to 3 referrals at the same time. */}
                                Earn 10 days of free membership for every professional who joins Freight Talk through your invitation.
                            </p>
                        </div>
                        <div className='refer-hero-graphic'>
                            <Image src='/images/freight-referral.jpeg' alt='Refer a Friend' width={800} height={150}
                                className='refer-hero-image' priority />
                        </div>
                    </div>
                    <div className='referal-form-container'>
                        <div className='d-flex align-items-center justify-content-between mb-4'>
                            <div>
                                {referrals.canAddNewReferral && (<>
                                    <h2 className='h5 fw-semibold mb-3'>Add Referrals</h2>
                                    {/* <h3 className='h6 fw-semibold mb-3'>Referral Information</h3> */}
                                    <h3 className='h6 fw-semibold mb-3'>Enter the email address of the person you would like to invite.</h3>
                                </>
                                )}

                            </div>
                            {/* <div>
                                {referrals.canAddNewReferral && (<span
                                    className='badge rounded-pill status-pill status-pill-warning'>{referrals.referralCount} / 3
                                </span>)}
                            </div> */}
                        </div>
                        <form className='referral-form' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className='row d-flex flex-column'>
                                {/* <div className='col-12 col-md-6'>
                                    <label htmlFor='firstName' className='form-label fw-semibold'>First Name <span
                                        className='text-danger'>*</span></label>
                                    <div className='input-group referral-input-group'>
                                        <span className='input-group-text'><FaUser /></span>
                                        <input
                                            type='text'
                                            id='firstName'
                                            name='firstName'
                                            className='form-control'
                                            placeholder='Enter first name'
                                            value={referralForm.firstName}
                                            onChange={(e) => setReferralForm(prev => ({
                                                ...prev,
                                                firstName: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <label htmlFor='lastName' className='form-label fw-semibold'>Last Name <span
                                        className='text-danger'>*</span></label>
                                    <div className='input-group referral-input-group'>
                                        <span className='input-group-text'><FaUser /></span>
                                        <input
                                            type='text'
                                            id='lastName'
                                            name='lastName'
                                            className='form-control'
                                            placeholder='Enter last name'
                                            value={referralForm.lastName}
                                            onChange={(e) => setReferralForm(prev => ({
                                                ...prev,
                                                lastName: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>
                                </div> */}
                                {/* <div className='col-12 col-md-6'>
                                    <label htmlFor='companyName' className='form-label fw-semibold'>Company Name <span
                                        className='text-danger'>*</span></label>
                                    <div className='input-group referral-input-group'>
                                        <span className='input-group-text'><FaBuilding /></span>
                                        <input
                                            type='text'
                                            id='companyName'
                                            name='companyName'
                                            className='form-control'
                                            placeholder='Enter company name'
                                            value={referralForm.companyName}
                                            onChange={(e) => setReferralForm(prev => ({
                                                ...prev,
                                                companyName: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <InoSelect
                                        label='Category *'
                                        name='industry'
                                        options={industryOptions}
                                        placeholder='Select industry / sector'
                                        value={industryOptions.find((option) => option.value === referralForm.industry) || null}
                                        onChange={(option) => {
                                            setReferralForm((prev) => ({
                                                ...prev,
                                                industry: option?.value || '',
                                            }))
                                        }}
                                    />
                                </div> */}
                                <div className='col-12'>
                                    <label htmlFor='email' className='form-label fw-semibold'>Email Address <span
                                        className='text-danger'>*</span></label>
                                    <div className='d-flex gap-2'>
                                        <div className='flex-grow-1'>
                                            <div className='input-group referral-input-group '>
                                                <span className='input-group-text'><FaRegEnvelope /></span>
                                                <input
                                                    type='email'
                                                    id='email'
                                                    name='email'
                                                    className='form-control'
                                                    placeholder='Enter business email address'
                                                    value={referralForm.email}
                                                    onChange={(e) => setReferralForm(prev => ({
                                                        ...prev,
                                                        email: e.target.value
                                                    }))}
                                                    required
                                                />

                                            </div>
                                        </div>
                                        <button type='submit'
                                            className='btn referral-submit-btn d-flex align-items-center justify-content-center gap-2'
                                            style={{
                                                padding: '0.6rem 1.2rem',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                backgroundColor: '#ff5f1a',
                                                color: 'white',
                                                border: 'none',
                                                flexShrink: 0,
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                boxShadow: '0 4px 12px rgba(239, 108, 0, 0.3)',
                                                cursor: 'pointer',
                                                letterSpacing: '0.3px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.05)';
                                                e.target.style.boxShadow = '0 6px 16px rgba(239, 108, 0, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(239, 108, 0, 0.3)';
                                            }}
                                        >
                                            <FaRegPaperPlane />
                                            Submit Referral
                                        </button>
                                    </div>

                                    <p className='small text-muted mt-2 mb-0'>
                                        Please enter a valid business email address.    {/* Personal email addresses are not
                                        accepted. */}
                                    </p>

                                </div>


                                <div className='col-auto d-flex align-self-end'>
                                    {/* <label htmlFor='mobilePhone' className='form-label fw-semibold'>Mobile Phone <span
                                        className='text-danger'>*</span></label>
                                    <PhoneNumberSelect
                                        phoneCodeName='mobileNumberCountryCode'
                                        phoneNumberName='mobilePhone'
                                        phoneCodeValue={referralForm.mobileNumberCountryCode}
                                        phoneIsoValue={referralForm.mobileNumberCountryIso}
                                        phoneNumberValue={referralForm.mobilePhone}
                                        onPhoneCodeChange={(code, iso) => {
                                            setReferralForm((prev) => ({
                                                ...prev,
                                                mobileNumberCountryCode: code,
                                                mobileNumberCountryIso: iso,
                                                mobilePhone: '',
                                            }))
                                        }}
                                        onPhoneNumberChange={(value) => {
                                            setReferralForm((prev) => ({
                                                ...prev,
                                                mobilePhone: value,
                                            }))
                                        }}
                                        onBlur={() => {
                                        }}
                                        inputClassName='refer-phone-input'
                                    /> */}

                                </div>
                                <div className='mt-3'>
                                    <div className='text-center my-4'>
                                        <div className='d-flex align-items-center gap-3 justify-content-center mb-5'>
                                            <div style={{ flex: 1, height: '2px', backgroundColor: '#EF6C00' }}></div>
                                            <p className='fw-bold mb-0' style={{ color: '#EF6C00', fontSize: '18px', letterSpacing: '2px', minWidth: 'fit-content' }}>
                                                OR
                                            </p>
                                            <div style={{ flex: 1, height: '2px', backgroundColor: '#EF6C00' }}></div>
                                        </div>
                                    </div>
                                    <div className='d-flex gap-3'>
                                        {/* Share Description Card */}
                                        <div className='p-3 rounded-3 referral-link-container' style={{
                                            backgroundColor: '#f8f9fa',
                                            borderLeft: '4px solid #EF6C00',
                                            flex: 1
                                        }}>
                                            <p className='mb-0 text-muted'>Share your exclusive referral link with your partners. For every professional who joins Freight Talk through your link, you will earn 10 days of free membership.</p>
                                        </div>

                                        {/* Referral Link Card */}
                                        <div className='p-3 rounded-3 referral-link-container' style={{
                                            backgroundColor: '#f8f9fa',
                                            borderLeft: '4px solid #EF6C00',
                                            flex: 1
                                        }}>
                                            <div className='d-flex align-items-center gap-3 h-100'>
                                                <div className='overflow-hidden flex-grow-1'>
                                                    <p className='mb-1 small fw-semibold text-muted'>
                                                        <FaRegPaperPlane className='me-2' style={{ color: '#EF6C00' }} />
                                                        Your Referral Link
                                                    </p>
                                                    <p className='mb-0 referral-link-text font-monospace text-break' style={{ fontSize: '13px', wordBreak: 'break-all' }}>
                                                        {`${window.location.origin}/sign-up?referral=${user.fTalkId}`}
                                                    </p>
                                                </div>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm rounded-3 ino-button'
                                                    onClick={() => handleCopyMainReferralLink()}
                                                    title='Copy referral link'
                                                    disabled={copiedMainReferralLink}

                                                    style={{
                                                        padding: '0.6rem 1.2rem',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        backgroundColor: copiedMainReferralLink ? '#28a745' : '#ff5f1a',
                                                        color: 'white',
                                                        border: 'none',
                                                        flexShrink: 0,
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        boxShadow: copiedMainReferralLink
                                                            ? '0 4px 12px rgba(40, 167, 69, 0.3)'
                                                            : '0 4px 12px rgba(239, 108, 0, 0.3)',
                                                        cursor: copiedMainReferralLink ? 'default' : 'pointer',
                                                        transform: copiedMainReferralLink ? 'scale(1)' : 'scale(1)',
                                                        letterSpacing: '0.3px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!copiedMainReferralLink) {
                                                            e.target.style.transform = 'scale(1.05)';
                                                            e.target.style.boxShadow = '0 6px 16px rgba(239, 108, 0, 0.4)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!copiedMainReferralLink) {
                                                            e.target.style.transform = 'scale(1)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(239, 108, 0, 0.3)';
                                                        }
                                                    }}
                                                >
                                                    <span className='d-flex align-items-center gap-2'>
                                                        {copiedMainReferralLink ? (
                                                            <>
                                                                <FaCheck size={15} />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaRegCopy size={15} />
                                                                Copy
                                                            </>
                                                        )}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className='d-flex justify-content-end mt-3'>
                                <button type='button' className='btn btn-sm btn-outline-warning referral-add-btn'>
                                    + Add Another Referral
                                </button>
                            </div> */}
                            {/* <div className='mt-3 mb-3 p-3 rounded referral-important-box-ft'>
                                <p className='mb-2 fw-semibold d-flex align-items-center gap-2'>
                                    <IoInformationCircleOutline className='text-success-ft' size={22} />
                                    Important
                                </p>
                                <p className='mb-2'>
                                    To qualify for the referral reward, your referral must register using the same email address provided in your referral submission. Please make sure you enter your referral's correct business email address. Registrations completed with a different email address will not qualify for referral rewards.
                                    </p>

                            </div> */}

                            {/* <div className='mt-3 mb-3 p-3 rounded referral-important-box'>
                                <p className='mb-2 fw-semibold d-flex align-items-center gap-2'>
                                    <IoInformationCircleOutline className='text-success' size={22} />
                                    Important
                                </p>
                                <p className='mb-2'>
                                    To maintain the quality of our community, we ask members to invite only professionals they know and trust. You can submit up to 3 referrals during each 12-month referral cycle. Your referral cycle starts on the date you first joined Freight Talk and is not linked to your membership package or renewal date. Once your current referral limit is reached, you will be able to submit new referrals when your next 12-month referral cycle begins.</p>

                            </div> */}

                            {/* <div className='mb-3 p-3 rounded referral-ack-box'>
                                <div className='form-check m-0 d-flex align-items-start gap-2'>
                                    <input
                                        className='form-check-input mt-1 referral-ack-checkbox'
                                        type='checkbox'
                                        id='referralAcknowledge'
                                        name='referralAcknowledge'
                                        checked={referralForm.acceptRewardRules}
                                        onChange={(e) => setReferralForm(prev => ({
                                            ...prev,
                                            acceptRewardRules: e.target.checked
                                        }))}
                                        required
                                    />
                                    <label className='form-check-label' htmlFor='referralAcknowledge'>
                                        I understand that referral rewards are granted only when the referred
                                        professional registers using the same email address provided in this referral
                                        form.
                                    </label>
                                </div>
                            </div> */}

                            {/* <button type='submit'
                                className='btn referral-submit-btn w-100 d-flex align-items-center justify-content-center gap-2'
                            >
                                <FaRegPaperPlane />
                                Submit Referral
                            </button> */}
                        </form>

                        {/* <div className='mt-3 mb-3 p-3 rounded referral-important-box-ft'>
                            <p className='mb-2 fw-semibold d-flex align-items-center gap-2'>
                                <IoInformationCircleOutline className='text-success-ft' size={22} />
                                Important
                            </p>
                            <p className='mb-2'>
                                To qualify for the referral reward, your referral must register using the same email address provided in your referral submission. Please make sure you enter your referral's correct business email address. Registrations completed with a different email address will not qualify for referral rewards.</p>

                        </div>

                        <div className='mt-3 mb-3 p-3 rounded referral-important-box'>
                            <p className='mb-2 fw-semibold d-flex align-items-center gap-2'>
                                <IoInformationCircleOutline className='text-success' size={22} />
                                Important
                            </p>
                            <p className='mb-2'>
                                To maintain the quality of our community, we ask members to invite only professionals they know and trust. You can submit up to 3 referrals during each 12-month referral cycle. Your referral cycle starts on the date you first joined Freight Talk and is not linked to your membership package or renewal date. Once your current referral limit is reached, you will be able to submit new referrals when your next 12-month referral cycle begins.</p>

                        </div> */}

                    </div>
                </section >

                <section className='card p-4 mb-4 refer-card'>
                    <h2 className='fw-bold mb-4'>Your Referral Status</h2>

                    <div className='row g-3 mb-4'>
                        <div className='col-12 col-md-4'>
                            <div className='d-flex align-items-center gap-3 h-100 p-3 referral-stat-card'>
                                <div className='referral-stat-icon bg-orange-soft text-warning'>
                                    <FaRegPaperPlane size={20} />
                                </div>
                                <div>
                                    <p className='mb-1 text-muted small'>Submitted</p>
                                    <p className='mb-0 fw-bold fs-4'>{referrals.referralCount} </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-4'>
                            <div className='d-flex align-items-center gap-3 h-100 p-3 referral-stat-card'>
                                <div className='referral-stat-icon bg-green-soft text-success'>
                                    <FaUser size={20} />
                                </div>
                                <div>
                                    <p className='mb-1 text-muted small'>Successful</p>
                                    <p className='mb-0 fw-bold fs-4'>{referrals.successfullCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-12 col-md-4'>
                            <div className='d-flex align-items-center gap-3 h-100 p-3 referral-stat-card'>
                                <div className='referral-stat-icon bg-blue-soft text-primary'>
                                    <FaGift size={20} />
                                </div>
                                <div>
                                    <p className='mb-1 text-muted small'>Reward</p>
                                    <p className='mb-0 fw-bold fs-4 lh-sm'>{referrals.rewardEarnedDays} Days</p>
                                    <p className='mb-0 text-muted small'>Free Membership</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='table-responsive mb-3'>
                        <table className='table align-middle mb-0 referral-table'>
                            <thead>
                                <tr>
                                    {/* <th scope='col'>Referral</th> */}
                                    <th scope='col'>Email</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Invitation Date</th>
                                    {/* <th scope='col'>Link</th> */}
                                    {/* <th scope='col'>Link Valid Till</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.referrals?.length > 0 ? (
                                    referrals.referrals.map((referral, index) => {
                                        const avatarColors = ['bg-orange', 'bg-green', 'bg-blue']
                                        const avatarColor = avatarColors[index % avatarColors.length]
                                        const initials = `${referral.firstName?.charAt(0) ?? ''}${referral.lastName?.charAt(0) ?? ''}`.toUpperCase()
                                        const fullName = `${referral.firstName} ${referral.lastName}`
                                        const invitationDate = new Date(referral.createdDate).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        })
                                        const referralLink = `${window.location.origin}/sign-up?referral=${referral.code}`
                                        const validUntil = referral.validUntil ? new Date(referral.validUntil).toLocaleDateString('en-GB', {
                                            day: '2-digit', month: 'long', year: 'numeric'
                                        }) : '-'

                                        const statusMap = {
                                            1: { label: 'Pending', pill: 'status-pill-warning' },
                                            2: { label: 'Registered', pill: 'status-pill-warning' },
                                            3: { label: 'Reward Earned', pill: 'status-pill-success' },
                                            4: { label: 'Reward Limit Reached', pill: 'status-pill-success' },
                                            5: { label: 'Time Out', pill: 'status-pill-danger' },
                                        }
                                        const statusInfo = statusMap[referral.status] ?? {
                                            label: referral.statusName,
                                            pill: 'status-pill-secondary'
                                        }

                                        return (
                                            <tr key={referral.id}>
                                                {/* <td>
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <span className={`referral-avatar ${avatarColor}`}>{initials}</span>
                                                        <span>{fullName}</span>
                                                    </div>
                                                </td> */}
                                                <td>
                                                    {referral.email}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill status-pill ${statusInfo.pill}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    {invitationDate}
                                                </td>
                                                {/* <td>
                                                    <button
                                                        type='button'
                                                        className={`btn btn-sm border referral-copy-btn ${copiedReferralId === referral.id ? 'btn-success' : 'btn-light'}`}
                                                        onClick={() => handleCopyLink(referral.id, referralLink)}
                                                        title='Copy referral link'
                                                        disabled={copiedReferralId === referral.id}
                                                    >
                                                        {copiedReferralId === referral.id ? (
                                                            <FaCheck />
                                                        ) : (
                                                            <FaRegCopy />
                                                        )}
                                                    </button>
                                                </td> */}
                                                {/* <td>
                                                    {validUntil}
                                                </td> */}
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className='text-center text-muted py-4'>No referrals yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* <div className='d-flex align-items-start gap-2 text-muted'>
                        <span className='referral-note-icon'>
                            <FaRegCopy size={12} />
                        </span>
                        <p className='mb-0'>
                            You can copy the link and share it with your partner. This will help expedite the membership
                            process.
                        </p>
                    </div> */}
                </section>
            </div >

            <ReferralSuccessModal
                show={successModalShow}
                onClose={() => setSuccessModalShow(false)}
                email={successEmail}
            />
        </>
    )
}

export default Page