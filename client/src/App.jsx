import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { PostProvider } from "./context/PostContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import PostDetail from "./pages/PostDetail"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/create-post"
                  element={
                    <ProtectedRoute>
                      <CreatePost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-post/:id"
                  element={
                    <ProtectedRoute>
                      <EditPost />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  )
}

export default App
