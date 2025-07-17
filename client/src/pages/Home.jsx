"use client"

// pages/Home.jsx - Home page component
import { useState, useEffect } from "react"
import { usePost } from "../context/PostContext"
import { categoryService } from "../services/api"
import PostCard from "../components/PostCard"
import toast from "react-hot-toast"

const Home = () => {
  const { posts, loading, fetchPosts, pagination } = usePost()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchCategories()
    loadPosts()
  }, [])

  useEffect(() => {
    loadPosts()
  }, [selectedCategory, searchQuery, currentPage])

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories()
      setCategories(response.data)
    } catch (error) {
      toast.error("Failed to fetch categories")
    }
  }

  const loadPosts = () => {
    fetchPosts(currentPage, 10, selectedCategory, searchQuery)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadPosts()
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BlogApp</h1>
        <p className="text-xl text-gray-600">Discover amazing stories and share your own</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No posts found</h2>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (pagination.prev || pagination.next) && (
            <div className="flex justify-center space-x-2">
              {pagination.prev && (
                <button
                  onClick={() => handlePageChange(pagination.prev.page)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Previous
                </button>
              )}

              <span className="px-4 py-2 bg-gray-100 rounded">Page {currentPage}</span>

              {pagination.next && (
                <button
                  onClick={() => handlePageChange(pagination.next.page)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
