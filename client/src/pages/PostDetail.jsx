"use client"

// pages/PostDetail.jsx - Post detail page
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { usePost } from "../context/PostContext"
import { useAuth } from "../context/AuthContext"
import { postService } from "../services/api"
import { formatDate } from "../utils/dateUtils"
import toast from "react-hot-toast"

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentPost, loading, fetchPost, deletePost } = usePost()
  const { user, isAuthenticated } = useAuth()
  const [comment, setComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    fetchPost(id)
  }, [id])

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id)
        toast.success("Post deleted successfully")
        navigate("/")
      } catch (error) {
        toast.error("Failed to delete post")
      }
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      setSubmittingComment(true)
      await postService.addComment(id, { content: comment })
      setComment("")
      toast.success("Comment added successfully")
      // Refresh post to get updated comments
      fetchPost(id)
    } catch (error) {
      toast.error("Failed to add comment")
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Post not found</h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to home
        </Link>
      </div>
    )
  }

  const canEditPost = user && (user.id === currentPost.author._id || user.role === "admin")

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Featured Image */}
        {currentPost.featuredImage && (
          <img
            src={currentPost.featuredImage || "/placeholder.svg"}
            alt={currentPost.title}
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-8">
          {/* Post Header */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span
                className="px-3 py-1 text-sm font-semibold rounded-full text-white mr-4"
                style={{ backgroundColor: currentPost.category?.color || "#3B82F6" }}
              >
                {currentPost.category?.name}
              </span>
              <span className="text-gray-500">{formatDate(currentPost.createdAt)}</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">{currentPost.title}</h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={currentPost.author?.avatar || "/default-avatar.jpg"}
                  alt={currentPost.author?.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-800">{currentPost.author?.name}</p>
                  <p className="text-gray-500 text-sm">{currentPost.author?.bio}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {currentPost.viewCount} views
                </div>

                {canEditPost && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/edit-post/${currentPost._id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDeletePost}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{currentPost.content}</div>
          </div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({currentPost.comments?.length || 0})</h2>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingComment}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {submittingComment ? "Adding..." : "Add Comment"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 rounded-md">
            <p className="text-gray-600">
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>{" "}
              to add a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {currentPost.comments && currentPost.comments.length > 0 ? (
            currentPost.comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.user?.avatar || "/default-avatar.jpg"}
                    alt={comment.user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{comment.user?.name}</span>
                      <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostDetail
