import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage }) {
  const imageUrl = appwriteService.getFileView(featuredImage);

  return (
    <Link to={`/post/${$id}`}>
      <div className="bg-gray-200 rounded-xl p-4 hover:shadow-lg transition">

        {/* IMAGE */}
        <div className="w-full rounded-xl mb-3 overflow-hidden">
          <div className="w-full aspect-16/10 bg-gray-300 rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-bold">{title}</h2>

      </div>
    </Link>
  );
}

export default PostCard;