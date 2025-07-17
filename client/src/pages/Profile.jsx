"use client"

// pages/Profile.jsx - Profile page
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { usePost } from "../context/PostContext"
import { authService } from "../services/api"
import PostCard from "../components/PostCard"
import toast from "react-hot-toast"

const Profile = () => {
  const { user } = useAuth()
  const { posts, fetchPosts } = usePost()
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      })
      loadUserPosts()
    }
  }, [user])

  const loadUserPosts = async () => {
    try {
      // Fetch all posts and filter by current user
      const response = await fetchPosts(1, 100) // Get more posts to show user's posts
      const filteredPosts = posts.filter((post) => post.author._id === user.id)
      setUserPosts(filteredPosts)
    } catch (error) {
      toast.error("Failed to load your posts")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await authService.updateDetails(formData)
      toast.success("Profile updated successfully")
      setEditing(false)
      // Update user in localStorage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-6">
          <img src={user?.avatar || "/default-avatar.jpg"} alt={user?.name} className="w-24 h-24 rounded-full" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-gray-600 mt-2">{user?.email}</p>
            {user?.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
            <div className="mt-4 flex space-x-4 text-sm text-gray-500">
              <span>{userPosts.length} posts</span>
              <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <form onSubmit={handleSubmit} className="mt-8 border-t pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="mt-6">
              <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User's Posts */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Posts</h2>

        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
            <Link to="/create-post" className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
