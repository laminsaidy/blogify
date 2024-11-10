import React from "react";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext";
import Avatar from "../components/Avatar";
import { axiosPublic } from "../api/axiosDefaults";  // Updated import
import { OwnerDropdown } from "../components/OwnerDropdown";
import postStyles from "../styles/PostItem.module.css";

const PostItem = ({ 
  id, owner, profile_id, profile_image, comments_count, 
  likes_count, like_id, title, content, image, updated_at, 
  postPage, updatePosts 
}) => {
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;
  const history = useHistory();

  // Handle post editing
  const onEdit = () => {
    history.push(`/posts/${id}/edit`);
  };

  // Handle post deletion
  const onDelete = async () => {
    try {
      await axiosPublic.delete(`/posts/${id}/`);  // Replaced axiosRes with axiosPublic
      history.goBack();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Handle liking the post
  const onLike = async () => {
    try {
      const { data } = await axiosPublic.post("/likes/", { post: id });  // Replaced axiosRes with axiosPublic
      updatePosts((prevState) => ({
        ...prevState,
        results: prevState.results.map((post) => 
          post.id === id 
            ? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
            : post
        ),
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Handle unliking the post
  const onUnlike = async () => {
    try {
      await axiosPublic.delete(`/likes/${like_id}/`);  // Replaced axiosRes with axiosPublic
      updatePosts((prevState) => ({
        ...prevState,
        results: prevState.results.map((post) => 
          post.id === id 
            ? { ...post, likes_count: post.likes_count - 1, like_id: null }
            : post
        ),
      }));
    } catch (err) {
      console.error("Error unliking post:", err);
    }
  };

  return (
    <Card className={postStyles.Post}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {isOwner && postPage && (
              <OwnerDropdown
                handleEdit={onEdit}
                handleDelete={onDelete}
              />
            )}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/posts/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={postStyles.PostBar}>
          {isOwner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't like your own post!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={onUnlike}>
              <i className={`fas fa-heart ${postStyles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={onLike}>
              <i className={`far fa-heart ${postStyles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to like posts!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/posts/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostItem;