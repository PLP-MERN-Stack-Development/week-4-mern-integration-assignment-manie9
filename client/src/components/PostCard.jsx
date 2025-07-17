// components/PostCard.jsx - Post card component
import { Link } from "react-router-dom"
import { formatDate } from "../utils/dateUtils"

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={post.featuredImage || "/placeholder.svg?height=200&width=400"}
        alt={post.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <div className="flex items-center mb-2">
          <span
            className="px-2 py-1 text-xs font-semibold rounded-full text-white"
            style={{ backgroundColor: post.category?.color || "#3B82F6" }}
          >
            {post.category?.name}
          </span>
          <span className="ml-2 text-sm text-gray-500">{formatDate(post.createdAt)}</span>
        </div>

        <h2 className="text-xl font-bold mb-2 text-gray-800 hover:text-blue-600">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt || post.content.substring(0, 150) + "..."}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.author?.avatar || "/default-avatar.jpg"}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{post.author?.name}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {post.viewCount}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard
