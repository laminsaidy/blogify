import { useState, useCallback } from "react";
import { axiosPublic } from "../api/axiosDefaults";

// This hook will handle the infinite scroll logic
export const useInfiniteScroll = (resource, updateResource) => {
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = useCallback(() => {
    if (resource.next) {
      axiosPublic
        .get(resource.next)
        .then(({ data }) => {
          updateResource((prev) => ({
            ...prev,
            next: data.next,
            results: data.results.reduce((acc, newItem) => {
              return acc.some((item) => item.id === newItem.id)
                ? acc
                : [...acc, newItem];
            }, prev.results),
          }));
          setHasMore(!!data.next);  
        })
        .catch((error) => console.error("Error fetching more data:", error));
    } else {
      setHasMore(false);  
    }
  }, [resource, updateResource]);

  return { hasMore, fetchMoreData };
};

export const loadMoreData = async (resource, updateResource) => {
  try {
    const { data } = await axiosPublic.get(resource.next);
    updateResource((prev) => ({
      ...prev,
      next: data.next,
      results: data.results.reduce((acc, newItem) => {
        return acc.some((item) => item.id === newItem.id)
          ? acc
          : [...acc, newItem];
      }, prev.results),
    }));
  } catch (error) {
    console.error("Error fetching more data:", error);
  }
};

export const applyFollow = (profile, targetProfile, newFollowingId) => {
  if (profile.id === targetProfile.id) {
    return {
      ...profile,
      followers_count: profile.followers_count + 1,
      following_id: newFollowingId,
    };
  }
  if (profile.is_owner) {
    return { ...profile, following_count: profile.following_count + 1 };
  }
  return profile;
};

export const applyUnfollow = (profile, targetProfile) => {
  if (profile.id === targetProfile.id) {
    return {
      ...profile,
      followers_count: profile.followers_count - 1,
      following_id: null,
    };
  }
  if (profile.is_owner) {
    return { ...profile, following_count: profile.following_count - 1 };
  }
  return profile;
};