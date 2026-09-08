"use client";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import "./solution-partners-detail.css";
import { useParams } from "next/navigation";
import client from "@/utils/client";
import { useRouter } from "next/navigation";

const SolutionPartnerClient = () => {
  const searchParams = useParams();
  const [partner, setPartner] = useState(null);
  const seoUrl = searchParams.seoUrl;
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (seoUrl) {
      const fetchPartnerDetail = async () => {
        try {
          const response = await client.get(
            `/SolutionPartner/GetBySeoUrl/seoUrl?seoUrl=${seoUrl}`,
          );

          if (response && response.data.success) {
            setPartner(response.data.data);
           
          }
        } catch (error) {
          console.error("Error fetching partner detail: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPartnerDetail();
    }
  }, [seoUrl]);
  if (!partner) {
    return (
      <Container className="text-center">
        <p>Partner not found</p>
      </Container>
    );
  }

  return (
    <Container className="solution-partners-detail-container my-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="solution-partners-detail-card d-flex flex-column flex-md-row gap-md-5 align-items-start">
            {partner.imageUrl && (
              <div className="solution-partners-detail-image">
                <Image
                  src={partner.imageUrl || "/images/no-img.png"}
                  alt={partner.name}
                  fill
                  priority
                />
              </div>
            )}

            <div className="solution-partners-detail-content text-start">
              <h1 className="custom-h1 mt-4">{partner.name}</h1>
              {partner.title && <h5 className="mb-4">{partner.title}</h5>}
            </div>
          </div>

          {partner.content && (
            <div
              className="solution-partners-editor-content mt-4"
              dangerouslySetInnerHTML={{ __html: partner.content }}
            />
          )}

          <div className="d-flex justify-content-md-end text-center mb-4">
            <button
              className="btn ino-button ino-button-outline solution-partners-header-btn "
              onClick={() => router.push("/solution-partners")}
            >
              Back to Solution Partners
            </button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SolutionPartnerClient;
