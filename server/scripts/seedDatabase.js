"use client"

// seedDatabase.js - Script to seed the database with initial data
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("../server/models/User")
const Category = require("../server/models/Category")
const Post = require("../server/models/Post")

// Load environment variables
dotenv.config()

// Sample data
const users = [
  {
    name: "BIG T",
    email: "BIGT@example.com",
    password: "password123",
    role: "admin",
    bio: "Full-stack developer and tech enthusiast",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    bio: "Content writer and blogger",
  },
]

const categories = [
  {
    name: "Technology",
    description: "Latest tech trends and tutorials",
    color: "#3B82F6",
  },
  {
    name: "Lifestyle",
    description: "Life tips and personal experiences",
    color: "#10B981",
  },
  {
    name: "Travel",
    description: "Travel guides and adventures",
    color: "#F59E0B",
  },
  {
    name: "Food",
    description: "Recipes and food reviews",
    color: "#EF4444",
  },
]

const posts = [
  {
    title: "Getting Started with React Hooks",
    content: `React Hooks have revolutionized the way we write React components. In this comprehensive guide, we'll explore the most commonly used hooks and how they can simplify your code.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the preferred way to write React components.

## useState Hook

The useState hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

React Hooks provide a more direct API to the React concepts you already know. They offer a powerful and flexible way to reuse stateful logic between components.`,
    excerpt: "Learn how to use React Hooks to simplify your React components and manage state effectively.",
    tags: ["react", "javascript", "hooks", "frontend"],
    isPublished: true,
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  },
  {
    title: "The Art of Minimalist Living",
    content: `Minimalism isn't just about having fewer possessions—it's about making room for what matters most in your life. In this post, I'll share my journey towards minimalist living and the benefits I've discovered along the way.

## What is Minimalism?

Minimalism is a lifestyle that helps you focus on what's important by removing excess. It's about being intentional with your choices and surrounding yourself only with things that add value to your life.

## Benefits of Minimalist Living

### 1. Reduced Stress
When you have fewer possessions to manage, you naturally feel less overwhelmed. Your space becomes more peaceful and easier to maintain.

### 2. More Time
Less stuff means less time spent cleaning, organizing, and maintaining. You can redirect this time towards activities and relationships that matter.

### 3. Financial Freedom
By buying less and being more intentional with purchases, you naturally save money and reduce financial stress.

### 4. Environmental Impact
Consuming less means producing less waste and having a smaller environmental footprint.

## Getting Started

Start small. Choose one area of your home and remove items you haven't used in the past year. Ask yourself: "Does this add value to my life?" If the answer is no, it's time to let it go.

Remember, minimalism looks different for everyone. The goal isn't to live with as few possessions as possible, but to live with intention and purpose.`,
    excerpt: "Discover how minimalist living can reduce stress, save money, and help you focus on what truly matters.",
    tags: ["lifestyle", "minimalism", "wellness", "productivity"],
    isPublished: true,
    featuredImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
  },
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Category.deleteMany({})
    await Post.deleteMany({})
    console.log("Cleared existing data")

    // Create users
    const createdUsers = await User.create(users)
    console.log("Created users")

    // Create categories
    const createdCategories = await Category.create(categories)
    console.log("Created categories")

    // Create posts with references
    const postsWithRefs = posts.map((post, index) => ({
      ...post,
      author: createdUsers[index % createdUsers.length]._id,
      category: createdCategories[index % createdCategories.length]._id,
    }))

    await Post.create(postsWithRefs)
    console.log("Created posts")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
