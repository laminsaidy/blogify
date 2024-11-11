import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "../context/CurrentUserContext";  
import Avatar from "../components/Avatar"; 
import styles from "./styles/Profile.module.css";  
import btnStyles from "../styles/Button.module.css";  

const Profile = ({ profile, mobile, imageSize = 55 }) => {
  const { id, following_id, image, owner } = profile;
  const currentUser = useCurrentUser();
  const isOwner = currentUser?.username === owner;  

  // Handle follow/unfollow functionality
  const handleFollowUnfollow = () => {
  };

  return (
    <div className={`my-3 d-flex align-items-center ${mobile && "flex-column"}`}>
      <div>
        <Link className="align-self-center" to={`/profiles/${id}`}>
          <Avatar src={image} height={imageSize} />
        </Link>
      </div>
      <div className={`mx-2 ${styles.WordBreak}`}>
        <strong>{owner}</strong>
      </div>
      <div className={`text-right ${!mobile && "ml-auto"}`}>
        {!mobile && currentUser && !isOwner && (
          <Button
            className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
            onClick={handleFollowUnfollow}  
          >
            {following_id ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;