import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "../../styles/CommentCreateEditForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosPrivate } from "../../api/axiosDefaults";

const CommentCreateForm = ({ post, setPost, setComments, profileImage, profile_id }) => {
  const [content, setContent] = useState("");

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosPrivate.post("/comments/", { content, post });
      
      setComments((prev) => ({
        ...prev,
        results: [data, ...prev.results],
      }));
      
      setPost((prev) => ({
        results: [
          {
            ...prev.results[0],
            comments_count: prev.results[0].comments_count + 1,
          },
        ],
      }));
      
      setContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <Form className="mt-2" onSubmit={submitComment}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="my comment..."
            as="textarea"
            value={content}
            onChange={handleContentChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <button
        className={`${styles.Button} btn d-block ml-auto`}
        disabled={!content.trim()}
        type="submit"
      >
        Post
      </button>
    </Form>
  );
};

export default CommentCreateForm;