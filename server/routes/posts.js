// posts.js - Routes for posts
const express = require("express")
const { getPosts, getPost, createPost, updatePost, deletePost, addComment } = require("../controllers/postController")

const { protect } = require("../middleware/auth")

const router = express.Router()

router.route("/").get(getPosts).post(protect, createPost)

router.route("/:id").get(getPost).put(protect, updatePost).delete(protect, deletePost)

router.route("/:id/comments").post(protect, addComment)

module.exports = router
