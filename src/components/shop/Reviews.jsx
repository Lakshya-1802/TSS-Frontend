import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Card,
} from 'react-bootstrap';
import axios from 'axios';
import { FaRegCheckCircle } from 'react-icons/fa';
import ReactStars from 'react-stars';
import Ratings from '../common/Ratings';
import tssurl from '../../port';

const Reviews = ({ productID }) => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDesc, setReviewDesc] = useState('');
  const [rating, setRating] = useState(0);
  const [recommendProduct, setRecommendProduct] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(4);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${tssurl}/review/reviews/product/${productID}`
        );
        setReviews(response.data);
        const totalRatings = response.data.reduce(
          (total, review) => total + review.rating,
          0
        );
        const avgRating =
          totalRatings / (response.data.length > 0 ? response.data.length : 1);
        setAverageRating(avgRating);
        setTotalReviews(response.data.length);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productID]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleAddReview = async () => {
    try {
      const reviewData = {
        mid: localStorage.getItem('MID'),
        pid: productID,
        product_name: reviewTitle,
        rating: rating,
        review: reviewDesc,
        images: images,
        // recommendProduct: recommendProduct,
        // rid:review23,
        // username: john_doe,
        // location: Hong-kong ,
        // Age:21,
        // Height:6,
        // BodyType:SlimFit2,
        // FitPurchased:Petite,
        // SizePurchased:L,
        // SizeWorn:L Petite,
      };

      const response = await axios.post(`${tssurl}/review/reviews`, reviewData);
      console.log("Review added successfully:", response.data);
      resetFormData();

      setShowModal(false);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const resetFormData = () => {
    setReviewTitle("");
    setReviewDesc("");
    setRating(0);
    setRecommendProduct(false);
    setImages([]);
    setImagePreviews([]);
  };

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    const newImages = [...images, ...selectedImages].slice(0, 4); // Concatenate new images with existing ones and limit to 4
    setImages(newImages);

    const previews = newImages.map((image) => URL.createObjectURL(image));
    setImagePreviews(previews);
  };

  const handleCloseModal = () => {
    resetFormData();
    setShowModal(false);
  };

  const renderImagePreviews = () => {
    return (
      <Row className="mb-3">
        {imagePreviews.map((preview, index) => (
          <Col key={index} md={3} sm={4} className="d-flex align-items-center">
            <img
              src={preview}
              alt={`Preview ${index}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const renderReviews = () => {
    const numCardsPerRow = 2;
    const numTotalCards = currentReviews.length;
    const numRows = Math.ceil(numTotalCards / numCardsPerRow);

    const rows = Array.from({ length: numRows }, (_, rowIndex) => {
      const startIndex = rowIndex * numCardsPerRow;
      const endIndex = startIndex + numCardsPerRow;
      const rowReviews = currentReviews.slice(startIndex, endIndex);

      return (
        <Container className="reviews-cards">
          <Row key={rowIndex}>
            {rowReviews.map((review, colIndex) => (
              <Col key={colIndex} md={6} lg={6}>
                <Card className="px-4 py-3 gap-3 my-2">
                  <Row>
                    <Col md={6} className="d-flex flex-column">
                      <h5 className="fw-bold mb-0">{review.username}</h5>
                      <span className="mt-1">
                        <strong>Location:</strong> {review.location}
                      </span>
                      <span className="mt-1">
                        <strong>Age:</strong> {review.Age}
                      </span>
                      <span className="mt-1">
                        <strong>Height:</strong> {review.Height}'
                      </span>
                      <span className="mt-1">
                        <strong>Body type:</strong> {review.BodyType}
                      </span>
                    </Col>
                    <Col md={6} className="d-flex flex-column">
                      <Ratings value={review.rating} />
                      <h5 className="mt-1 mb-0">{review.product_name}</h5>
                      <span className="mt-1">{review.review}</span>
                      <span className="mt-1">
                        <strong>Fit Purchased:</strong> {review.FitPurchased}
                      </span>
                      <span className="mt-1">
                        <strong>Size Purchased:</strong> {review.SizePurchased}
                      </span>
                      <span className="mt-1">
                        <strong>Size Normally Worn:</strong> {review.SizeWorn}
                      </span>
                      {review.recommendProduct && (
                        <span className="mt-1">
                          <strong>Yes</strong> I recommend this product
                        </span>
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      );
    });

    return rows;
  };

  return (
    <Container>
      <div className="d-flex justify-content-between my-3 review-text">
        <h5 className="fw-bold">Ratings and Reviews</h5>
        <Button variant="dark" onClick={() => setShowModal(true)}>
          Add Review
        </Button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="reviewTitle">
                <Form.Label>Review Title</Form.Label>
                <Form.Control
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="reviewDesc">
                <Form.Label>Review Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={reviewDesc}
                  onChange={(e) => setReviewDesc(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="rating">
                <Form.Label>Rating</Form.Label>
                <ReactStars
                  count={5}
                  value={rating}
                  onChange={(newValue) => setRating(newValue)}
                  size={24}
                  color2={'#ffd700'}
                />
              </Form.Group>
              <Form.Group controlId="recommendProduct">
                <Form.Check
                  type="checkbox"
                  label="Yes, I recommend this product"
                  checked={recommendProduct}
                  onChange={(e) => setRecommendProduct(e.target.checked)}
                />
              </Form.Group>
              <Form.Group controlId="image">
                <Form.Label>Upload Images (Up to 4)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                <div>{renderImagePreviews()}</div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddReview}>
              Submit Review
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="review-body">
        <Row>
          <Col md={4} sm={6} className="column column-stars">
            <div className="stars-info row1">
              {averageRating.toFixed(1)} stars | {totalReviews} Reviews
            </div>
            <div className="stars-rating row2">
              <Ratings value={averageRating} />
            </div>
          </Col>

          <Col md={4} sm={6} className="column column-recommendations">
            <div className=" row1"> 92 % Recommended</div>
            <div className=" row2">
              <FaRegCheckCircle size={30} />
            </div>
          </Col>
          <Col md={4} className="column column-size">
            Customer says true to size
          </Col>
        </Row>
      </div>

      {/* <div className="text-center">Images</div> */}
      <div className="review-head justify-content-end mt-3 d-flex">
        <div className="pagination absolute flex">
          <button
            className={`px-2 border-1 rounded-md ${
              currentPage === 0
                ? 'bg-[#DDDEF9] text-gray-500 cursor-default'
                : 'bg-white text-gray-700 '
            }`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {'<'} Prev
          </button>
          <span className="p-2">{`Review ${Math.min(
            4 * currentPage,
            currentReviews.length
          )} of ${currentReviews.length}`}</span>
          <button
            className={`px-2 border-1 rounded-md ${
              currentPage === indexOfLastReview - 1
                ? 'bg-[#DDDEF9] text-gray-500 cursor-default'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastReview >= reviews.length}
          >
            Next {'>'}
          </button>
        </div>
      </div>

      {renderReviews()}
    </Container>
  );
};

export default Reviews;
