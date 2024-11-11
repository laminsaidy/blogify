import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import styles from "../../styles/CommentCreateEditForm.module.css";

const CommentEditForm = ({ currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { commentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(`/api/comments/${commentId}`);
        if (response.data.user === currentUser.id) {
          setCommentText(response.data.text);
        } else {
          setError('You can only edit your own comments');
          navigate('/');
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching comment data');
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId, currentUser.id, navigate]);

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`/api/comments/${commentId}`, { text: commentText });
      if (response.status === 200) {
        navigate(`/post/${response.data.post_id}`);
      }
    } catch (err) {
      setError('Error updating comment');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.commentEditForm}>
      <h2 className={styles.title}>Edit Comment</h2>
      {error && <p className={`text-danger ${styles.errorText}`}>{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentText">
          <Form.Label>Your Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={commentText}
            onChange={handleChange}
            placeholder="Edit your comment"
            className={styles.textarea}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} className={styles.submitButton}>
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default CommentEditForm;