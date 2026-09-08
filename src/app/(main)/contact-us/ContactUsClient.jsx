"use client";
import ContactUsForm from "@/components/ContactUs/ContactUsForm";
import ContactBox from "@/components/ContactUs/ContactBox";
import InoBreadcrumb from "@/components/InoBreadcrumb/InoBreadcrumb";
import Image from "next/image";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import useIsTablet from "@/utils/hooks/useIsTablet";
import { IoMail } from "react-icons/io5";
import { RiPhoneFill } from "react-icons/ri";
import { RiMapPinFill } from "react-icons/ri";
import { RiMailFill } from "react-icons/ri";
import "./contactus.css";
import ContactStructuredData from "@/components/Seo/ContactStructuredData";

const ContactUsClient = () => {
    const isTablet = useIsTablet();

    const quickContact = (
        <div className="col">
            <p className="fw-bold fs-4 mb-4">Quick Contact</p>
            <div className="col-12">
                <div className="contact-box d-flex gap-3">
                    <div
                        className="contact-box-image d-flex justify-content-center align-items-center rounded flex-shrink-0"
                        style={{ backgroundColor: "#DBEAFE", width: 50, height: 50 }}
                    >
                        <RiMailFill size={25} />
                    </div>
                    <div className="contact-box-info" style={{ color: "#414141" }}>
                        <p className="text-muted">Email:</p>
                        <p className="fw-bold">hello[AT]freighttalk.com</p>
                    </div>
                </div>

                <div className="contact-box d-flex gap-3">
                    <div
                        className="contact-box-image d-flex justify-content-center align-items-center rounded flex-shrink-0"
                        style={{ backgroundColor: "#E6D4FF", width: 50, height: 50 }}
                    >
                        <RiPhoneFill size={25} />
                    </div>
                    <div className="contact-box-info" style={{ color: "#414141" }}>
                        <p className="text-muted">Phone Number:</p>
                        <p className="fw-bold">+90 533 074 11 81</p>
                    </div>
                </div>

                <div className="contact-box d-flex gap-3">
                    <div
                        className="contact-box-image d-flex justify-content-center align-items-center rounded flex-shrink-0"
                        style={{ backgroundColor: "#FFE3BD", width: 50, height: 50 }}
                    >
                        <RiMapPinFill size={25} />
                    </div>
                    <div className="contact-box-info" style={{ color: "#414141" }}>
                        <p className="text-muted">Address:</p>
                        <p className="fw-bold mb-1">INO ULUS. NAK. ORG. LTD. STI.</p>
                        <p className="mb-1">(Globally known as INO Networks Group)</p>
                        <p className="fw-bold mb-1">
                            Cinarli Mah. Ankara Asfalti Cd. Mistral Izmir No: 15 Ic Kapi No:
                            391 Konak / Izmir - TÜRKİYE
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <ContactStructuredData />
            <div className="container">
                <InoBreadcrumb linkName="Contact Us" />
                <section className="card p-4 mb-4 wrap">
                    <div className="contact-us-head">
                        <h1 className="fw-bold">Contact Us</h1>
                        <p className="contactus-head-description hello-description mb-5">
                            We’re an energetic, flexible, and open-minded team who are ready
                            to work hard for our members. If you’re interested in joining the
                            Freight Talk or cooperating with us, please send us a message. Our
                            team is touch as soon as possible.
                        </p>
                    </div>
                    <div className="contact-us-body d-flex gap-4">
                        <div
                            className={`contact-us-form d-flex gap-3 ${isTablet ? "flex-column" : ""}`}
                        >
                            <div
                                className={`shadow rounded p-4 ${isTablet ? "col-12" : "col-7"}`}
                            >
                                <ContactUsForm />
                            </div>

                            {!isTablet && (
                                <div
                                    className="contact-us-image col-3 rounded shadow p-4"
                                    style={{ position: "relative", flex: 1 }}
                                >
                                    <div
                                        className=" mb-4 "
                                        style={{ position: "relative", height: "60%" }}
                                    >
                                        <div
                                            style={{
                                                position: "relative",
                                                width: "100%",
                                                height: "100%",

                                            }}
                                        >
                                            <Image
                                                src="/images/contact_us_photo.webp"
                                                fill
                                                alt="contact us image"
                                                className="rounded"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    </div>
                                    {quickContact}
                                </div>
                            )}

                            {isTablet && (
                                <div className="shadow rounded p-4 col-12">{quickContact}</div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ContactUsClient;
