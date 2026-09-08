import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "../SubscribeForm/SubscribeForm";


const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="mb-4 mb-m-0">
            <div className="footer__app">
              <Link href="/" className="footer__logo-link ">
                <Image
                  src="/images/freight-talk-logo.png"
                  alt="Freight Talk"
                  width={125}
                  height={40}
                  className="footer__logo-image"
                  priority
                />
              </Link>
              <div className="d-flex flex-row flex-md-column gap-1 gap-md-0 mb-0">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__app-link footer-appstore-logo"
                  style={{ marginBottom: "4px", display: "block" }}
                >
                  <Image
                    src="/images/app-store.svg"
                    alt="App Store"
                    className="footer__app-image"
                    width={135}
                    height={40}
                  />
                </Link>

                <Link
                  href="https://play.google.com/store/apps/details?id=com.freighttalk.mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__app-link"
                >
                  <Image
                    src="/images/google-play.svg"
                    alt="Google Play"
                    className="footer__app-image"
                    width={135}
                    height={40}
                  />
                </Link>
              </div>
            </div>
            <div
              className="d-flex flex-row flex-md-column   "
              style={{ gap: "5px", marginTop: "5px" }}
            >
              <div className="d-flex" style={{ gap: "5px" }}>
                <Image
                  src="/images/mastercard_.svg"
                  alt="Mastercard"
                  className="footer_bank-card-image"
                  width={65}
                  height={40}
                />
                <Image
                  src="/images/visa.png"
                  alt="Visa"
                  className="footer_bank-card-image visa"
                  width={65}
                  height={40}
                />
              </div>
              <Image
                src="/images/vakif_bank.png"
                alt="Vakıf Bank"
                className="footer_bank-card-image visa"
                width={135}
                height={40}
              />
            </div>
          </div>

          <div className="footer__links">
            <p className="footer__title">Freight Talk</p>
            <a href="/faq" className="footer__link">
              FAQ
            </a>
            <Link href="/pricing" className="footer__link">
              Pricing
            </Link>
            <Link href="/about-us" className="footer__link">
              About Us
            </Link>
            <Link href="/contact-us" className="footer__link">
              Contact Us
            </Link>
            <Link href="/global-networkers" className="footer__link">
              Global Networkers
            </Link>
          </div>
          <div className="footer__links">
            <p className="footer__title">More</p>
            <Link href="/privacy-policy" className="footer__link">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="footer__link">
              Cookie Policy
            </Link>
            <Link href="/warranty-policy" className="footer__link">
              Warranty Policy
            </Link>
            <Link href="/news-and-blog" className="footer__link">
              News and Blog
            </Link>
            <Link href="/terms-and-conditions" className="footer__link">
              Terms and Conditions
            </Link>
          </div>
          <div className="footer__social">
            <p className="footer__title">Follow Us</p>
            <div className="footer__social-icons">
              <Link
                href="https://www.linkedin.com/showcase/freighttalk"
                target="_blank"
                className="footer__social-link"
              >
                <span className="footer__social-icon">
                  <Image
                    src="/images/icon-linkedin.svg"
                    alt="Linkedin"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="footer__social-text">Linkedin</span>
              </Link>
              <Link
                href="https://www.facebook.com/thefreighttalk"
                target="_blank"
                className="footer__social-link"
              >
                <span className="footer__social-icon">
                  <Image
                    src="/images/icon-facebook.svg"
                    alt="Facebook"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="footer__social-text">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/thefreighttalk/"
                target="_blank"
                className="footer__social-link"
              >
                <span className="footer__social-icon">
                  <Image
                    src="/images/icon-instagram.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="footer__social-text">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="subscription-main">
            <SubscribeForm />
          </div>
        </div>
        <div className="container subscription-main-mobile pt-0">
          <SubscribeForm />
        </div>
      </footer>

      <div className="copyright">
        <div className="container">
          <small className="copyright__text">
            Copyright <span>@{new Date().getFullYear()}</span> Freight Talk -
            INO Ulus. Nak. Org. Ltd. Şti. All rights reserved.
          </small>
        </div>
      </div>
    </>
  );
};

export default Footer;
