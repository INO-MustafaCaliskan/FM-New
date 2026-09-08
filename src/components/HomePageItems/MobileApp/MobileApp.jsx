import Image from "next/image";
import Link from "next/link";

const MobileApp = ({ data }) => {
  return (
    <section className="home-mobile-section">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="home-mobile-info-content">
              <h3>{data.Title}</h3>
              <p>{data.Description}</p>
              <div className="home-mobile__apps">
                <Link href={data.AppStoreUrl} className="empty-link-warning">
                  <Image
                    src="images/app-store.svg"
                    alt="App Store"
                    className="empty-link-warning"
                    height={40}
                    width={135}
                  />
                </Link>
                <Link href={data.GooglePlayUrl} className="empty-link-warning">
                  <Image
                    src="images/google-play.svg"
                    alt="Google Play"
                    className="empty-link-warning"
                    height={40}
                    width={135}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="home-mobile-phone-content">
              <div className="home-mobile-phone-icon">
                <Image
                  style={{ borderRadius: "30px" }}
                  src="/images/mobile-app-banner-image.svg"
                  alt="Mobile Phone"
                  width={250}
                  height={600}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
