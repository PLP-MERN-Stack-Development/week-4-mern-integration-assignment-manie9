"use client"

// pages/CreatePost.jsx - Create post page
import { useNavigate } from "react-router-dom"
import { usePost } from "../context/PostContext"
import PostForm from "../components/PostForm"
import toast from "react-hot-toast"

const CreatePost = () => {
  const navigate = useNavigate()
  const { createPost, loading } = usePost()

  const handleSubmit = async (postData) => {
    try {
      const response = await createPost(postData)
      toast.success("Post created successfully!")
      navigate(`/posts/${response.data._id}`)
    } catch (error) {
      toast.error("Failed to create post")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your thoughts with the world</p>
      </div>

      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}

export default CreatePost
