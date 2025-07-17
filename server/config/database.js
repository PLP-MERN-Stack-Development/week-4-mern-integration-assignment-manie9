const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false)

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database Name: ${conn.connection.name}`)
  } catch (error) {
    console.error("❌ Database connection error:", error.message)

    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 Please check:")
      console.error("   1. MongoDB Atlas connection string is correct")
      console.error("   2. Your IP address is whitelisted in MongoDB Atlas")
      console.error("   3. Username and password are correct")
    }

    process.exit(1)
  }
}

module.exports = connectDB
