import React, { useEffect, useState, useCallback } from "react";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import appStyles from "../App.module.css";
import searchBarStyles from "../styles/SearchBar.module.css"; 
import { useParams } from "react-router";
import { axiosPrivate } from "../api/axiosDefaults";
import Post from "./PostItem";
import { useInfiniteScroll } from "../utilis/Utilis";
import CommentCreateForm from "./comments/CommentCreateForm";
import { useCurrentUser } from "../context/CurrentUserContext";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true); 
  const [page, setPage] = useState(1); 
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await axiosPrivate.get(`/posts/${id}?page=${page}`);
      setPost((prevPost) => ({
        results: page === 1 ? [data] : [...prevPost.results, data],
      }));
      setHasMore(data.has_next); 
    } catch (err) {
      console.error("Error fetching post:", err);
    }
  }, [id, page]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axiosPrivate.get(`/posts/${id}/comments`);
      setComments({ results: data });
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  useInfiniteScroll(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  });

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Searching for:", query);
  };

  const renderPostContent = post.results.length ? (
    post.results.map((postData, index) => (
      <React.Fragment key={index}>
        <Post {...postData} setPosts={setPost} postPage />
        <CommentCreateForm 
          post={postData.id} 
          setPost={setPost} 
          setComments={setComments} 
          profileImage={profile_image} 
          profile_id={currentUser?.id} 
        />
      </React.Fragment>
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
        <Container className={appStyles.Content}>
          {comments.results.map((comment, index) => (
            <p key={index}>{comment.content}</p>
          ))}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default PostPage;