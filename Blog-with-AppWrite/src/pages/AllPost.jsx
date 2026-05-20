import { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state => state.auth.userData);

  useEffect(() => {
    if (!userData) return;

    const fetchPosts = async () => {
      const res = await appwriteService.getPosts(userData.$id);
      if (res) setPosts(res.documents);
      setLoading(false);
    };

    fetchPosts();
  }, [userData]);

  if (loading) return <h1 className="text-center mt-10">Loading posts...</h1>;

  if (posts.length === 0)
    return <h1 className="text-center mt-10">No posts found</h1>;

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map(post => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;