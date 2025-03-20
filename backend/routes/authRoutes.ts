import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import axios from "axios"
import { IUser } from "../models/user"
import cookieParser from "cookie-parser"

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

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Forces Google to ask for an email every time
  })
)

router.get("/proxy-image", async (req, res) => {
  const imageUrl = req.query.url
  if (typeof imageUrl !== "string") {
    res.status(400).send("Invalid image URL")
    return
  }
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
    res.set("Content-Type", "image/jpeg")
    res.send(response.data)
  } catch (error) {
    res.status(500).send("Error fetching image")
  }
})

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    if (!req.user) return res.redirect("/login")

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
      `http://localhost:8080/home?name=${user.name}&email=${user.email}&image=${user.picture}`
    )
  }
)

router.get("/me", (req, res) => {
  const token = req.cookies?.token // Access the token from cookies
  console.log(token)
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

export default router
