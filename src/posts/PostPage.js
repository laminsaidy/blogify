import React, { useEffect, useState, useCallback } from "react";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import appStyles from "../App.module.css";
import searchBarStyles from "../styles/SearchBar.module.css"; 
import { useParams } from "react-router";
import { axiosReq } from "../api/axiosDefaults";
import Post from "./PostItem";
import { useInfiniteScroll } from "../utilis/Utilis";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true); 
  const [page, setPage] = useState(1); 

  // Fetch posts data using useEffect
  const fetchPost = useCallback(async () => {
    try {
      const { data } = await axiosReq.get(`/posts/${id}?page=${page}`);
      setPost((prevPost) => ({
        results: page === 1 ? [data] : [...prevPost.results, data],
      }));
      setHasMore(data.has_next); 
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  }, [id, page]);

  // Trigger fetching posts on component mount or page change
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // Infinite scroll trigger
  useInfiniteScroll(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more data
    }
  });

  // Search function to handle query changes
  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Searching for:", query);
    // Implement actual search functionality if needed
  };

  const renderPostContent = post.results.length ? (
    post.results.map((postData, index) => (
      <Post key={index} {...postData} setPosts={setPost} postPage />
    ))
  ) : (
    <p>Loading post...</p>
  );

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Form onSubmit={handleSearch} className={`${searchBarStyles.SearchBar} mb-3`}>
          <Form.Control
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="primary" className="ms-2">
            Search
          </Button>
        </Form>
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