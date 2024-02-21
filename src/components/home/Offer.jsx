import { Container, Card, Row, Col, Image, Button } from 'react-bootstrap';
import offer2 from '../../assets/images/offer2.png';

const Offer = ({ data: { image, Title, Name, Offer, Subtitle } }) => {
  return (
    <Container fluid>
      <Row className="bg-light offer">
        <Col md={4} className="text-center">
          <Image src={image.url} fluid />
        </Col>
        <Col md={4} className="m-auto">
          <Card className="off-card">
            <h5>{Title}</h5>
            <h2>{Name}</h2>
            <div className="flex">
              <hr />
              <p>With</p>
              <hr />
            </div>
            <h1>{Offer}</h1>
            <h6>{Subtitle}</h6>
            <Button variant="light">SHOP NOW</Button>
            <small>*Terms and Conditions apply</small>
          </Card>
        </Col>
        <Col md={4} className="text-end mt-auto">
          <Image src={offer2} fluid />
        </Col>
      </Row>
    </Container>
  );
};

export default Offer;
