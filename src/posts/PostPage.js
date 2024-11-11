import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../api/axiosDefaults";
import appStyles from "../App.module.css";
import Post from "./PostItem";  
import Comment from "./comments/Comment";  
import CommentCreateForm from "./comments/CommentCreateForm";  
import { useCurrentUser } from "../context/CurrentUserContext";
import { useInfiniteScroll } from "../utilis/Utilis"; 
import PopularProfiles from '../profiles/PopularProfiles';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState({ results: [] });
  const [comments, setComments] = useState({ results: [] });
  const [hasMore, setHasMore] = useState(false);
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axiosPrivate.get(`/comments/?post=${id}&page=${comments.results.length / 10 + 1}`);
      setComments((prevComments) => ({
        results: [...prevComments.results, ...data.results],
      }));
      setHasMore(!!data.next); // Check if there's another page
    } catch (err) {
      console.log(err);
    }
  }, [id, comments.results.length]);

  useInfiniteScroll(fetchComments, hasMore);

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: post }, { data: comments }] = await Promise.all([
          axiosPrivate.get(`/posts/${id}`),
          axiosPrivate.get(`/comments/?post=${id}`),
        ]);
        setPost({ results: [post] });
        setComments(comments);
        setHasMore(!!comments.next);
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Post {...post.results[0]} setPosts={setPost} postPage />
        
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}

          {comments.results.length ? (
            comments.results.map((comment) => (
              <Comment
                key={comment.id}
                {...comment}
                setPost={setPost}
                setComments={setComments}
              />
            ))
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
      
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles mobile={false} />
      </Col>
    </Row>
  );
}

export default PostPage;