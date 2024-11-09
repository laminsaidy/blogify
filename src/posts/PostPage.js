import React, { useEffect, useState, useCallback } from "react";
import { Col, Row, Container } from "react-bootstrap";
import appStyles from "../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../api/axiosDefaults";
import Post from "./Post";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });

  // Fetch the post data using useEffect
  const fetchPost = useCallback(async () => {
    try {
      const [{ data: post }] = await Promise.all([axiosReq.get(`/posts/${id}`)]);
      setPost({ results: [post] });
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  }, [id]);

  // Trigger post fetching when the component mounts or id changes
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Render the post component and handle layout
  const renderPostContent = post.results[0] ? (
    <Post {...post.results[0]} setPosts={setPost} postPage />
  ) : (
    <p>Loading post...</p>
  );

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        {renderPostContent}
        <Container className={appStyles.Content}>Comments</Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;