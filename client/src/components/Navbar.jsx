"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  return (
    <nav>
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            BlogApp
          </Link>

          {/* Desktop Menu */}
          <div className="nav-links" style={{ display: window.innerWidth >= 768 ? "flex" : "none" }}>
            <Link to="/" className="nav-link">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/create-post" className="nav-link">
                  Create Post
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatar || "/default-avatar.jpg"}
                    alt={user?.name}
                    style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
                  />
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            style={{ display: window.innerWidth < 768 ? "block" : "none" }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={{ paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
            <div className="flex flex-col gap-4">
              <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/create-post" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Create Post
                  </Link>
                  <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
