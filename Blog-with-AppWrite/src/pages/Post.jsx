import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const status = useSelector((state) => state.auth.status); // ⭐ VERY IMPORTANT

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  // 🔹 Load post
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    appwriteService.getPost(id).then((post) => {
      if (post) setPost(post);
      else navigate("/");
    });
  }, [id]);

  // 🔹 Load image AFTER auth session restored
  useEffect(() => {
    const loadImage = async () => {
      if (!post?.featuredImage) return;
      if (status === null) return; // wait for auth restore

      try {
        const url = appwriteService.getFileView(post.featuredImage);
        setImageSrc(url);
      } catch (err) {
        console.log("Image load failed", err);
      }
    };

    loadImage();
  }, [post, status]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((success) => {
      if (success) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  if (!post) return <div className="p-10 text-center">Loading post...</div>;

  return (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {imageSrc ? (
            <img src={imageSrc} alt={post.title} className="rounded-xl" />
          ) : (
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl" />
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  );
}