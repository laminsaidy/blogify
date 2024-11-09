import React, { useRef, useState, useCallback } from "react";
import { Form, Button, Row, Col, Container, Alert, Image } from "react-bootstrap";
import { useHistory } from "react-router";

import Asset from "../components/ImageAsset";
import Upload from "../assets/Logo.png";
import { axiosReq } from "../api/axiosDefaults";

import styles from "../styles/PostCreateEditForm.module.css";
import appStyles from "../App.module.css";
import btnStyles from "../styles/Button.module.css";

function PostCreateForm() {
  const [postData, setPostData] = useState({ title: "", content: "", image: "" });
  const [errors, setErrors] = useState({});
  
  const { title, content, image } = postData;
  const imageInput = useRef(null);
  const history = useHistory();

  // Handles change in text inputs
  const handleChange = useCallback((event) => {
    setPostData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }, []);

  // Handles change in image input
  const handleImageChange = useCallback((event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData((prevData) => ({
        ...prevData,
        image: URL.createObjectURL(event.target.files[0]),
      }));
    }
  }, [image]);

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageInput.current.files[0]);

    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.status !== 401) {
        setErrors(error.response?.data || {});
      }
    }
  };

  const renderTextFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((msg, idx) => (
        <Alert variant="warning" key={idx}>{msg}</Alert>
      ))}

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((msg, idx) => (
        <Alert variant="warning" key={idx}>{msg}</Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        Cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        Create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload">
                    Change the image
                  </Form.Label>
                </>
              ) : (
                <Form.Label className="d-flex justify-content-center" htmlFor="image-upload">
                  <Asset src={Upload} message="Click or tap to upload an image" />
                </Form.Label>
              )}
              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((msg, idx) => (
              <Alert variant="warning" key={idx}>{msg}</Alert>
            ))}
            <div className="d-md-none">{renderTextFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{renderTextFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;