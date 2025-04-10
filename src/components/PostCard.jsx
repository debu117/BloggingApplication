{
  /*import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage }) {
  console.log("Featured Image:", featuredImage);

  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage) // No `.href` if it's a URL
    : "https://via.placeholder.com/400x200?text=No+Image";

  console.log("Image URL:", imageUrl);

  return (
    <Link to={`/post/${$id}`} className="block">
      <div className="w-full bg-gray-100 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      </div>
    </Link>
  );
}
export default PostCard;
*/
}
import React from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/config";

function PostCard({ $id, title, featuredImage }) {
  const imageUrl = featuredImage ? service.getFileView(featuredImage) : null;

  console.log("Preview URL:", imageUrl);

  return (
    <Link to={`/post/${$id}`} className="w-full">
      <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Post image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default.jpg";
            }}
            className="rounded shadow-md w-full h-[200px] object-cover"
          />
        ) : (
          <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <h3 className="text-lg font-semibold mt-3 line-clamp-2">{title}</h3>
      </div>
    </Link>
  );
}

export default PostCard;
