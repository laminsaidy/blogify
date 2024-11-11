import { useEffect } from "react";
import { axiosPrivate } from "../api/axiosDefaults"; 

export const useInfiniteScroll = (callback) => {
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled near the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
};

export const fetchMoreData = async (data, setData) => {
  try {
    const response = await axiosPrivate.get(data.next); 
    setData(prevData => ({
      results: [...prevData.results, ...response.data.results],
      next: response.data.next
    }));
  } catch (error) {
    console.error("Error fetching more data:", error);
  }
};