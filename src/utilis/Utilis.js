import { useEffect } from "react";

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