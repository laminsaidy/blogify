import React, { useEffect, useState, useCallback } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useLocation } from "react-router";

import Post from "./Post";
import Asset from "../components/ImageAsset";
import { axiosReq } from "../api/axiosDefaults";

import appStyles from "../App.module.css";
import NoResults from "../assets/no-results.png";

function PostsPage({ message, filter = "" }) {
  const [posts, setPosts] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await axiosReq.get(`/posts/?${filter}`);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [fetchPosts, pathname]);

  const renderContent = () => {
    if (loading) {
      return (
        <Container className={appStyles.Content}>
          <Asset spinner />
        </Container>
      );
    }

    if (posts.results.length === 0) {
      return (
        <Container className={appStyles.Content}>
          <Asset src={NoResults} message={message} />
        </Container>
      );
    }

    return posts.results.map((post) => (
      <Post key={post.id} {...post} setPosts={setPosts} />
    ));
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles mobile</p>
        {renderContent()}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <p>Popular profiles for desktop</p>
      </Col>
    </Row>
  );
}

export default PostsPage;