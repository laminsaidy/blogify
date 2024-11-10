import React, { useEffect, useState, useCallback } from "react";
import { Col, Row, Container, Spinner, Alert } from "react-bootstrap"; 
import appStyles from "../App.module.css";
import { useParams } from "react-router";
import { axiosPrivate } from "../api/axiosDefaults";  // Updated import
import Post from "./PostItem";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch the post data using useEffect
  const fetchPost = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    try {
      const [{ data: post }] = await Promise.all([axiosPrivate.get(`/posts/${id}`)]); // Replaced axiosReq with axiosPrivate
      setPost({ results: [post] });
    } catch (err) {
      setError("Error fetching post. Please try again later.");
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false); // End loading
    }
  }, [id]);

  // Trigger post fetching when the component mounts or id changes
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Conditional rendering for loading, error, and post content
  const renderPostContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!post.results[0]) {
      return <Alert variant="warning">Post not found.</Alert>;
    }

    return <Post {...post.results[0]} setPosts={setPost} postPage />;
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        {renderPostContent()}
        <Container className={appStyles.Content}>Comments</Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;