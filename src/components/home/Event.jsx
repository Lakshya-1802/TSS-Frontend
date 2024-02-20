import { Image, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Event = ({ data }) => {
  return (
    <Container fluid>
      <Row>
        <Col md="4" className="event1">
          <Image src={data?.image && data?.image.url} alt="img" fluid />
          <Link to={data?.imagelink && data?.imagelink}>Shop Now</Link>
        </Col>
        <Col md="8" className="event2">
          <Image src={data?.image2 && data?.image2.url} alt="img" fluid />
        </Col>
      </Row>
    </Container>
  );
};

export default Event;
