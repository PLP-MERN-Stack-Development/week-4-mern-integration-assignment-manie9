"use client"

// context/PostContext.jsx - Post context
import { createContext, useContext, useReducer } from "react"
import { postService } from "../services/api"

const PostContext = createContext()

const postReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_POSTS_START":
    case "FETCH_POST_START":
    case "CREATE_POST_START":
    case "UPDATE_POST_START":
    case "DELETE_POST_START":
      return {
        ...state,
        loading: true,
        error: null,
      }
    case "FETCH_POSTS_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: action.payload.data,
        pagination: action.payload.pagination,
        total: action.payload.total,
        error: null,
      }
    case "FETCH_POST_SUCCESS":
      return {
        ...state,
        loading: false,
        currentPost: action.payload.data,
        error: null,
      }
    case "CREATE_POST_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: [action.payload.data, ...state.posts],
        error: null,
      }
    case "UPDATE_POST_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) => (post._id === action.payload.data._id ? action.payload.data : post)),
        currentPost: action.payload.data,
        error: null,
      }
    case "DELETE_POST_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post._id !== action.payload),
        error: null,
      }
    case "FETCH_POSTS_FAILURE":
    case "FETCH_POST_FAILURE":
    case "CREATE_POST_FAILURE":
    case "UPDATE_POST_FAILURE":
    case "DELETE_POST_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case "CLEAR_CURRENT_POST":
      return {
        ...state,
        currentPost: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {},
  total: 0,
}

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState)

  const fetchPosts = async (page = 1, limit = 10, category = null, search = null) => {
    try {
      dispatch({ type: "FETCH_POSTS_START" })
      const response = await postService.getAllPosts(page, limit, category, search)
      dispatch({
        type: "FETCH_POSTS_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
      dispatch({
        type: "FETCH_POSTS_FAILURE",
        payload: error.response?.data?.error || "Failed to fetch posts",
      })
      throw error
    }
  }

  const fetchPost = async (id) => {
    try {
      dispatch({ type: "FETCH_POST_START" })
      const response = await postService.getPost(id)
      dispatch({
        type: "FETCH_POST_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
      dispatch({
        type: "FETCH_POST_FAILURE",
        payload: error.response?.data?.error || "Failed to fetch post",
      })
      throw error
    }
  }

  const createPost = async (postData) => {
    try {
      dispatch({ type: "CREATE_POST_START" })
      const response = await postService.createPost(postData)
      dispatch({
        type: "CREATE_POST_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
      dispatch({
        type: "CREATE_POST_FAILURE",
        payload: error.response?.data?.error || "Failed to create post",
      })
      throw error
    }
  }

  const updatePost = async (id, postData) => {
    try {
      dispatch({ type: "UPDATE_POST_START" })
      const response = await postService.updatePost(id, postData)
      dispatch({
        type: "UPDATE_POST_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
      dispatch({
        type: "UPDATE_POST_FAILURE",
        payload: error.response?.data?.error || "Failed to update post",
      })
      throw error
    }
  }

  const deletePost = async (id) => {
    try {
      dispatch({ type: "DELETE_POST_START" })
      await postService.deletePost(id)
      dispatch({
        type: "DELETE_POST_SUCCESS",
        payload: id,
      })
    } catch (error) {
      dispatch({
        type: "DELETE_POST_FAILURE",
        payload: error.response?.data?.error || "Failed to delete post",
      })
      throw error
    }
  }

  const clearCurrentPost = () => {
    dispatch({ type: "CLEAR_CURRENT_POST" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    clearCurrentPost,
    clearError,
  }

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}

export const usePost = () => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error("usePost must be used within a PostProvider")
  }
  return context
}
