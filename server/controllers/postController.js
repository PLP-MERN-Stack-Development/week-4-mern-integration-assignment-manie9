// postController.js - Controllers for post routes
const Post = require("../models/Post")
const Category = require("../models/Category")
const asyncHandler = require("../middleware/asyncHandler")
const ErrorResponse = require("../utils/errorResponse")

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit

  const query = {}

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category
  }

  // Filter by published status
  if (req.query.published !== undefined) {
    query.isPublished = req.query.published === "true"
  } else {
    query.isPublished = true // Default to published posts only
  }

  // Search functionality
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, "i")] } },
    ]
  }

  const total = await Post.countDocuments(query)
  const posts = await Post.find(query)
    .populate("author", "name email avatar")
    .populate("category", "name slug color")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex)

  const pagination = {}

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    pagination,
    data: posts,
  })
})

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email avatar bio")
    .populate("category", "name slug color")
    .populate("comments.user", "name avatar")

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404))
  }

  // Increment view count
  await post.incrementViewCount()

  res.status(200).json({
    success: true,
    data: post,
  })
})

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id

  // Validate category exists
  const category = await Category.findById(req.body.category)
  if (!category) {
    return next(new ErrorResponse("Category not found", 404))
  }

  const post = await Post.create(req.body)

  res.status(201).json({
    success: true,
    data: post,
  })
})

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id)

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is post owner or admin
  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to update this post", 401))
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: post,
  })
})

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is post owner or admin
  if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorized to delete this post", 401))
  }

  await post.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404))
  }

  await post.addComment(req.user.id, req.body.content)

  const updatedPost = await Post.findById(req.params.id).populate("comments.user", "name avatar")

  res.status(200).json({
    success: true,
    data: updatedPost.comments,
  })
})
