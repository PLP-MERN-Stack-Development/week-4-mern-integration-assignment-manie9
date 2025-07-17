"use client"

// context/AuthContext.jsx - Authentication context
import { createContext, useContext, useReducer, useEffect } from "react"
import { authService } from "../services/api"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return {
        ...state,
        loading: true,
        error: null,
      }
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      }
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
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
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check if user is logged in on app start
    const user = authService.getCurrentUser()
    const token = localStorage.getItem("token")

    if (user && token) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      })
    }
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: "LOGIN_START" })
      const response = await authService.login(credentials)
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.error || "Login failed",
      })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: "REGISTER_START" })
      const response = await authService.register(userData)
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: response,
      })
      return response
    } catch (error) {
      dispatch({
        type: "REGISTER_FAILURE",
        payload: error.response?.data?.error || "Registration failed",
      })
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: "LOGOUT" })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
