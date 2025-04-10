import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();

  const fetchPosts = async () => {
    setLoading(true);
    console.log("🔁 Fetching posts for user:", userData?.$id);

    const result = await appwriteService.getPostsByUserId(userData?.$id);
    console.log("📦 Fetched posts:", result);

    if (result && result.documents) {
      setPosts(result.documents);
    } else {
      setPosts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userData?.$id) {
      fetchPosts();
    }
  }, [userData]);

  useEffect(() => {
    if (location?.state?.refresh && userData?.$id) {
      fetchPosts();
      window.history.replaceState({}, document.title); // clear refresh flag
    }
  }, [location?.state, userData]);

  return (
    <div className="w-full py-8">
      <Container>
        {loading ? (
          <p className="text-white">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">No posts available.</p>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
