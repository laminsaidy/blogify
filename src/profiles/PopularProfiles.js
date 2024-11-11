import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom"; 
import { axiosPrivate } from "../api/axiosDefaults";  
import appStyles from "../App.module.css";
import Asset from "../components/Asset";  
import { useCurrentUser, useSetCurrentUser } from "../context/CurrentUserContext";
import ImageAsset from "../components/ImageAsset";  


// Reusable hook for fetching popular profiles
const usePopularProfiles = () => {
  const [popularProfiles, setPopularProfiles] = useState({ results: [] });

  useEffect(() => {
    const fetchPopularProfiles = async () => {
      try {
        const { data } = await axiosPrivate.get("/profiles/?ordering=-followers_count");
        setPopularProfiles(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPopularProfiles();
  }, []);

  return popularProfiles;
};

function PopularProfileEditDisplayForm() {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    image: "",
  });
  const { username, bio, image } = profileData;
  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const history = useHistory(); 

  const popularProfiles = usePopularProfiles();

  // Fetch profile data when component mounts
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data: profileData } = await axiosPrivate.get(`/profiles/${id}/`);
        if (currentUser?.profile_id?.toString() === id) {
          const { username, bio, image } = profileData;
          setProfileData({
            username,
            bio,
            image,
          });
        } else {
          history.push("/"); 
        }
      } catch (err) {
        console.log(err);
        history.push("/?edit-profile=error");  
      }
    };

    if (currentUser) {
      handleMount();
    }
  }, [currentUser, id, history]);  

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setProfileData({
        ...profileData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);

    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      const { data } = await axiosPrivate.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        username: data.username,
        image: data.image,
      }));
      history.push(`/profiles/${id}/`);  
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Container className="pb-5">
      <Row className="justify-content-center pb-3">
        <Col xs={12} md={8} lg={6}>
          <h4>Edit Profile</h4>
        </Col>
      </Row>

      {/* Display popular profiles */}
      {popularProfiles.results.length ? (
        <>
          <p className={appStyles.Content}>Most followed profiles:</p>
          {popularProfiles.results.slice(0, 4).map((profile) => (
            <p key={profile.id}>{profile.owner}</p>
          ))}
        </>
      ) : (
        <Asset spinner />
      )}

      {/* Profile edit form */}
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label visuallyHidden>Username</Form.Label>
              <Form.Control
                className={`${appStyles.ProfileFormFont}`}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group controlId="bio" className="mb-3">
              <Form.Label visuallyHidden>Bio</Form.Label>
              <Form.Control
                className={`${appStyles.ProfileFormFont}`}
                as="textarea"
                rows={3}
                placeholder="Bio"
                name="bio"
                value={bio}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.bio?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group controlId="image" className="mb-3">
              <Form.Label visuallyHidden>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            {image && <ImageAsset src={image} />}
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => history.goBack()}  
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="mt-3 ms-2">
              Save
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default PopularProfileEditDisplayForm;