# MERN Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js.

## 🚀 Features

- ✅ User authentication (register/login/logout)
- ✅ Create, read, update, delete blog posts
- ✅ Comment system on posts
- ✅ Category management and filtering
- ✅ Search functionality
- ✅ Pagination for posts
- ✅ Responsive design
- ✅ User profiles with bio
- ✅ Protected routes
- ✅ Image support for posts
- ✅ Tag system
- ✅ View counter for posts

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Custom CSS** - Styling (Tailwind-inspired)
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## 📁 Project Structure

\`\`\`
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── scripts/            # Database scripts
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
\`\`\`

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or pnpm package manager

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd mern-blog
\`\`\`

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 3. Server Setup

\`\`\`bash
cd server

# Install dependencies
npm install
# or
pnpm install

# Create .env file
cp .env.example .env
\`\`\`

Edit the `.env` file with your MongoDB Atlas connection string:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/mern-blog?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex-12345
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=http://localhost:3000
\`\`\`

### 4. Client Setup

\`\`\`bash
cd ../client

# Install dependencies
npm install
# or
pnpm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env
\`\`\`

### 5. Seed the Database (Optional)

\`\`\`bash
cd server
npm run seed
# or
pnpm run seed
\`\`\`

### 6. Start the Application

**Terminal 1 - Start the server:**
\`\`\`bash
cd server
npm run dev
# or
pnpm run dev
\`\`\`

**Terminal 2 - Start the client:**
\`\`\`bash
cd client
npm run dev
# or
pnpm run dev
\`\`\`

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 🔗 Connecting MongoDB Atlas to MongoDB Compass

1. Open MongoDB Compass
2. Click "New Connection"
3. Use your MongoDB Atlas connection string:
   \`\`\`
   mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
   \`\`\`
4. Click "Connect"

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/updatedetails` - Update user details (protected)
- `PUT /api/auth/updatepassword` - Update password (protected)

### Post Endpoints

- `GET /api/posts` - Get all posts (with pagination, search, filter)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/comments` - Add comment to post (protected)

### Category Endpoints

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## 🧪 Testing the Application

### 1. Test Server Connection
\`\`\`bash
curl http://localhost:5000/health
\`\`\`

### 2. Test User Registration
- Navigate to http://localhost:3000/register
- Create a new account

### 3. Test User Login
- Navigate to http://localhost:3000/login
- Login with your credentials

### 4. Test Post Creation
- Login and navigate to http://localhost:3000/create-post
- Create a new blog post

### 5. Test Search and Filter
- Use the search bar and category filter on the home page

## 🚨 Troubleshooting

### Server Won't Start
- Check if MongoDB Atlas connection string is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure all environment variables are set

### Client Styling Issues
- Clear browser cache
- Restart the development server
- Check console for CSS errors

### Database Connection Issues
- Verify MongoDB Atlas credentials
- Check network connectivity
- Ensure database user has proper permissions

## 📝 Environment Variables

### Server (.env)
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=http://localhost:3000
\`\`\`

### Client (.env) - Optional
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas is properly configured
4. Check server and client logs for errors

## 🎯 Assignment Requirements Completed

- ✅ **Project Setup**: Complete MERN stack setup
- ✅ **Back-End Development**: Express server with MongoDB
- ✅ **Front-End Development**: React application with routing
- ✅ **Integration**: Full-stack integration with API calls
- ✅ **Advanced Features**: Authentication, search, pagination
- ✅ **Database**: MongoDB Atlas integration
- ✅ **Deployment Ready**: Environment configuration
