"use client"

// pages/EditPost.jsx - Edit post page
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePost } from "../context/PostContext"
import { useAuth } from "../context/AuthContext"
import PostForm from "../components/PostForm"
import toast from "react-hot-toast"

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentPost, loading, fetchPost, updatePost } = usePost()
  const { user } = useAuth()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        await fetchPost(id)
      } catch (error) {
        toast.error("Failed to load post")
        navigate("/")
      } finally {
        setInitialLoading(false)
      }
    }

    loadPost()
  }, [id])

  useEffect(() => {
    if (currentPost && user) {
      // Check if user can edit this post
      if (currentPost.author._id !== user.id && user.role !== "admin") {
        toast.error("You are not authorized to edit this post")
        navigate("/")
      }
    }
  }, [currentPost, user])

  const handleSubmit = async (postData) => {
    try {
      await updatePost(id, postData)
      toast.success("Post updated successfully!")
      navigate(`/posts/${id}`)
    } catch (error) {
      toast.error("Failed to update post")
    }
  }

  if (initialLoading) {
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
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your post content</p>
      </div>

      <PostForm post={currentPost} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}

export default EditPost
