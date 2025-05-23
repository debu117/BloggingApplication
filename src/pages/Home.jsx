import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux"; // ✅ Add this

function Home() {
  const userData = useSelector((state) => state.auth.userData); // ✅ Add this

  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth.status); // ✅ Get auth status

  useEffect(() => {
    if (authStatus && userData) {
      appwriteService.getPost(userData.$id).then((posts) => {
        if (posts) {
          setPosts(posts.documents);
        }
      });
    } else {
      setPosts([]);
    }
  }, [authStatus, userData]);
  // ✅ Watch authStatus changes

  if (!authStatus) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold animate-pulse hover:text-black">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-xl font-semibold text-gray-500">
                No posts available
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
