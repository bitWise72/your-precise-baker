import express, { Request, Response, NextFunction } from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/user"
import { v2 as cloudinary } from "cloudinary"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()

// Extend the Request interface to include cookies
declare global {
  namespace Express {
    interface Request {
      cookies: { token?: string }
    }
  }
}

const router = express.Router()
router.use(cookieParser())
router.use(express.json())

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    if (!req.user) return res.redirect("/")

    const user = req.user as IUser & { _id: string } // ✅ Cast user to include _id
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables")
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    })

    res.cookie("token", token, { httpOnly: true })
    // ✅ Redirect to frontend with user data in query params
    res.redirect(
      `http://localhost:8080/home?name=${user.name}&email=${user.email}&image=${user.picture}&id=${user._id}`
    )
  }
)

router.get("/me", (req, res) => {
  const token = req.cookies?.token // Access the token from cookies
  if (!token) {
    res.status(401).json({ message: "Not logged in" })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    res.json({ user: decoded })
    return
  } catch (err) {
    console.error("JWT verification failed:", err)
    res.status(403).json({ message: "Invalid token" })
    return
  }
})

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err)
      res.status(500).json({ message: "Logout failed" })
      return
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    res.status(200).json({ message: "Logged out successfully" })
  })
})
// Ensure this path is correct

router.post(
  "/post",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { googleId, post } = req.body
      // console.log(googleId,post);
      if (!googleId || !post) {
        res
          .status(400)
          .json({ message: "Google ID and post data are required." })
        return
      }

      // Find user by googleId
      const user = await User.findById(googleId)
      // console.log(user);
      if (!user) {
        res.status(404).json({ message: "User not found." })
        return
      }

      // Add the new post to the user's posts array
      user.posts.push(post)
      await user.save()

      res.status(201).json({ message: "Post added successfully!", user })
    } catch (error) {
      console.error("Error adding post:", error)
      res.status(500).json({ message: "Internal Server Error." })
    }
  }
)

router.post(
  "/yourPosts",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.body
    if (!id) {
      res.status(400).json({ message: "Google ID and post data are required." })
      return
    }
    try {
      const user = await User.findById(id)
      if (!user) {
        res.status(404).json({ message: "User not found." })
        return
      }
      res.status(201).json({ message: "Fetched", posts: user.posts })
    } catch (error) {}
  }
)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Route to Get Signed Upload URL
router.get("/get-signed-url", (req, res) => {
  if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "CLOUDINARY_API_SECRET is not defined in environment variables"
    )
  }
  try {
    const publicId = req.query.public_id
    if (!publicId || typeof publicId !== "string") {
      res.status(400).json({ error: "Invalid public_id parameter" })
      return
    }
    const signedUrl = cloudinary.utils.private_download_url(publicId, "jpg", {
      attachment: true,
    })
    res.json({ signedUrl })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    res.status(500).json({ error: "Failed to generate signed URL" })
  }
})
export default router
