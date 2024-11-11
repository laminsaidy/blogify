import React, { useEffect, useState } from "react";
import { Col, Row, Container, Button, Image } from "react-bootstrap";
import { useParams } from "react-router";
import { axiosPrivate } from "../api/axiosDefaults";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useProfileData, useSetProfileData } from "../context/ProfileDataContext";
import Post from "../posts/PostItem";
import InfiniteScroll from "react-infinite-scroll-component";
import PopularProfiles from "../profiles/PopularProfiles";
import styles from "../styles/ProfilePage.module.css";
import appStyles from "../App.module.css";
import btnStyles from "../styles/Button.module.css";
import Asset from "../components/Asset";
import NoResults from "../assets/no-results.png";
import { fetchMoreData } from "../utilis/Utilis";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const setProfileData = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const isOwner = currentUser?.username === profile?.owner;

  // Fetching profile and posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profilePosts }] = await Promise.all([
          axiosPrivate.get(`/profiles/${id}/`),
          axiosPrivate.get(`/posts/?owner__profile=${id}`)
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfilePosts(profilePosts);
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  // Rendering profile section
  const renderProfile = (
    <>
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
            <Button
              className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
              onClick={() => {}}
            >
              {profile?.following_id ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Col>
        {profile?.content && <Col className="p-3">{profile.content}</Col>}
      </Row>
    </>
  );

  // Rendering profile posts section
  const renderProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll
          children={profilePosts.results.map((post) => (
            <Post key={post.id} {...post} setPosts={setProfilePosts} />
          ))}
          dataLength={profilePosts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profilePosts.next}
          next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No posts available from ${profile?.owner}.`}
        />
      )}
    </>
  );

  // Main component return
  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {renderProfile}
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