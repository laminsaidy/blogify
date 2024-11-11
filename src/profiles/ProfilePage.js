import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Row, Container, Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import { useCurrentUser } from "../context/CurrentUserContext";
import { useProfileData, useSetProfileData } from "../context/ProfileDataContext";
import { axiosPrivate as axiosReq } from "../api/axiosDefaults";
import { loadMoreData } from "../utilis/Utilis"; 

import Asset from "../components/Asset";
import PopularProfiles from "./PopularProfiles";
import PostItem from "../posts/PostItem"; 
import NoResults from "../assets/no-results.png";

import styles from "../styles/ProfilePage.module.css";
import appStyles from "../App.module.css";
import btnStyles from "../styles/Button.module.css";

function ProfilePage() {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });

  const { pageProfile } = useProfileData();
  const { setProfileData, followProfile, unfollowProfile } = useSetProfileData();

  const [profile] = pageProfile.results;
  const isOwner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [{ data: profileData }, { data: postsData }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/posts/?owner__profile=${id}`),
        ]);
        setProfileData((prev) => ({
          ...prev,
          pageProfile: { results: [profileData] },
        }));
        setProfilePosts(postsData);
        setHasLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, [id, setProfileData]);

  const renderProfileInfo = (
    <Row noGutters className="px-3 text-center">
      <Col lg={3} className="text-lg-left">
        <Image className={styles.ProfileImage} roundedCircle src={profile?.image} />
      </Col>
      <Col lg={6}>
        <h3 className="m-2">{profile?.owner}</h3>
        <Row className="justify-content-center no-gutters">
          <Col xs={3} className="my-2">
            <div>{profile?.posts_count}</div>
            <div>posts</div>
          </Col>
          <Col xs={3} className="my-2">
            <div>{profile?.followers_count}</div>
            <div>followers</div>
          </Col>
          <Col xs={3} className="my-2">
            <div>{profile?.following_count}</div>
            <div>following</div>
          </Col>
        </Row>
      </Col>
      <Col lg={3} className="text-lg-right">
        {currentUser && !isOwner && (
          profile?.following_id ? (
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => unfollowProfile(profile)}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              className={`${btnStyles.Button} ${btnStyles.Black}`}
              onClick={() => followProfile(profile)}
            >
              Follow
            </Button>
          )
        )}
      </Col>
      {profile?.content && <Col className="p-3">{profile.content}</Col>}
    </Row>
  );

  const renderProfilePosts = (
    <>
      <hr />
      <p className="text-center">{`${profile?.owner}'s posts`}</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <PostItem key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => loadMoreData(profilePosts, setProfilePosts)} 
        />
      ) : (
        <Asset src={NoResults} message={`No results found, ${profile?.owner} hasn't posted yet.`} />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {renderProfileInfo}
              {renderProfilePosts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;