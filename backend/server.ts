import express from "express"
import connectDB from "./config/db"
import passport from "passport"
import session from "express-session"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes"

import "./config/passport"

const app = express()
import dotenv from "dotenv"
dotenv.config()

connectDB()

app.use(express.json())
app.use(cors({ origin: "http://localhost:8080", credentials: true }))
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret", // Use a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Change to true if using HTTPS
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
