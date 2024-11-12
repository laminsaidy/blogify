import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { useHistory, useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axiosDefaults";  // Updated import
import { useCurrentUser } from "../context/CurrentUserContext";

import btnStyles from "../styles/Button.module.css";
import appStyles from "../App.module.css";

const ProfileUsernamePassword = () => {
  const history = useHistory();
  const { id } = useParams();
  const activeUser = useCurrentUser();

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const { password, confirmPassword } = passwords;

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (activeUser?.profile_id?.toString() !== id) {
      history.push("/");
    }
  }, [activeUser, history, id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post("/dj-rest-auth/password/change/", passwords);  // Updated request
      history.goBack();
    } catch (error) {
      console.log(error);
      setFormErrors(error.response?.data);
    }
  };

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                placeholder="Enter new password"
                type="password"
                value={password}
                onChange={handleInputChange}
                name="password"
              />
            </Form.Group>
            {formErrors?.password?.map((msg, index) => (
              <Alert key={index} variant="warning">
                {msg}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                placeholder="Re-enter new password"
                type="password"
                value={confirmPassword}
                onChange={handleInputChange}
                name="confirmPassword"
              />
            </Form.Group>
            {formErrors?.confirmPassword?.map((msg, index) => (
              <Alert key={index} variant="warning">
                {msg}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
            >
              Save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default ProfileUsernamePassword;