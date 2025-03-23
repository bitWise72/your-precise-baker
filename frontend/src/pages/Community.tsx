import React, { useEffect, useState } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { useDarkMode } from "@/contexts/DarkModeContext"

// Define step interface for recipe
interface RecipeStep {
  procedure: string
  time: string
  measurements: [string, string][]
}

// Define recipe interface
interface Recipe {
  [key: string]: RecipeStep
}

interface Post {
  title: string
  description: string
  imageUrl: string[] // URLs will be replaced with signed URLs
  recipe: Recipe
  tags: string[]
  createdAt: string
}

// Define the user data structure
interface UserData {
  googleId: string
  name: string
  email: string
  picture: string
  posts: Post[]
}

const Community = () => {
  const { darkMode, setDarkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState<"trending" | "following">(
    "following"
  )
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedPost, setExpandedPost] = useState<number | null>(null)
  const [user, setUser] = useState<{
    name: string
    email: string
    image: string
    id: string
  } | null>(null)

  // Function to fetch signed URLs for images
  const fetchSignedImage = async (publicId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_PORT
        }/auth/get-signed-url?public_id=${publicId}`
      )
      const data = await response.json()
      return data.signedUrl // Use this signed URL
    } catch (error) {
      console.error("Error fetching signed image URL:", error)
      return ""
    }
  }

  useEffect(() => {
    // Load user from localStorage (similar to Index.tsx)
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (!user.id) return

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_PORT}/auth/yourPosts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id }),
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data: UserData = await response.json()

        // Ensure imageUrl is always an array
        const updatedPosts = data.posts.map((post) => ({
          ...post,
          imageUrl: Array.isArray(post.imageUrl) ? post.imageUrl : [], // Prevents errors
        }))

        setUserData({ ...data, posts: updatedPosts })
      } catch (error) {
        console.error("Error fetching user posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const togglePostExpansion = (index: number) => {
    setExpandedPost(expandedPost === index ? null : index)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name || ""}
        image={user?.image || ""}
      />

      {/* Mobile Tabs - Only visible on smaller screens */}
      <div
        className={`md:hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        } sticky top-0 z-10 shadow-sm`}
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "trending"
                ? "border-b-2 border-primary text-primary"
                : darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            <TrendingUp className="h-4 w-4 mx-auto mb-1" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "following"
                ? "border-b-2 border-primary text-primary"
                : darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            <Users className="h-4 w-4 mx-auto mb-1" />
            <span>Your Posts</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="md:col-span-1 lg:col-span-3 order-2 md:order-1">
            {userData ? (
              <div
                className={`rounded-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow md:sticky md:top-20`}
              >
                {/* Cover image/banner with better profile picture placement */}
                <div className="h-24 sm:h-36 bg-gradient-to-r from-primary to-blue-500 relative">
                  {/* Profile image integrated with banner */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <img
                      src={user?.image || userData.picture}
                      alt={userData.name}
                      crossOrigin="anonymous"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
                    />
                  </div>
                </div>

                {/* Profile details with adjusted top margin to accommodate image */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-12 sm:pt-16 text-center">
                  <h2
                    className={`text-lg sm:text-xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user?.name || userData.name}
                  </h2>
                  <p
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } mt-1`}
                  >
                    {user?.email || userData.email}
                  </p>

                  <div className="mt-3 sm:mt-4 flex justify-center space-x-6 sm:space-x-8">
                    <div className="text-center">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {userData.posts.length}
                      </div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Posts
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        0
                      </div>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Followers
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <button
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-lg p-6 sm:p-10 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-16 w-16 sm:h-24 sm:w-24"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-4 sm:mt-6"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-2 sm:mt-3"></div>
                  <div className="flex justify-center space-x-4 sm:space-x-8 mt-4 sm:mt-6">
                    <div className="text-center">
                      <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-6 sm:w-8"></div>
                      <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-12 sm:w-16 mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-6 sm:w-8"></div>
                      <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-12 sm:w-16 mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Popular Tags - Visible on mobile, hidden on desktop where it appears in right sidebar */}
            <div className="md:hidden mt-4">
              <div
                className={`rounded-lg p-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <h3
                  className={`text-base font-medium mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["healthy", "quick", "vegetarian", "dessert"].map(
                    (tag, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-700 text-gray-200"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Recipe Feed */}
          <div className="md:col-span-2 lg:col-span-6 space-y-4 md:space-y-6 order-1 md:order-2">
            {/* Feed Tabs - Hidden on mobile */}
            <div className="hidden md:flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("trending")}
                className={`pb-4 px-2 text-sm font-medium ${
                  activeTab === "trending"
                    ? "border-b-2 border-primary text-primary"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <TrendingUp className="h-5 w-5 inline mr-2" />
                Trending
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`pb-4 px-2 text-sm font-medium ${
                  activeTab === "following"
                    ? "border-b-2 border-primary text-primary"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Your Posts
              </button>
            </div>

            {/* Display User Posts */}
            {loading ? (
              <div className="space-y-4 md:space-y-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow p-4 animate-pulse`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex-1">
                        <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                        <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6 mt-2"></div>
                      </div>
                    </div>
                    <div className="h-40 sm:h-48 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    <div className="mt-4">
                      <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userData?.posts.length ? (
              userData.posts.map((post, index) => (
                <div
                  key={index}
                  className={`rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } shadow overflow-hidden`}
                >
                  {/* Post Header */}
                  <div className="p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user?.image || userData.picture}
                        alt={userData.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        crossOrigin="anonymous"
                      />
                      <div className="ml-2 sm:ml-3">
                        <div
                          className={`font-medium text-sm sm:text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user?.name || userData.name}
                        </div>
                        <div
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Images */}
                  {post.imageUrl.length > 0 && (
                    <img
                      src={post.imageUrl[0]}
                      alt={post.title}
                      className="w-full aspect-video object-cover"
                      crossOrigin="anonymous"
                    />
                  )}

                  {/* Post Basic Content */}
                  <div className="p-3 sm:p-4">
                    <h2
                      className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {post.title}
                    </h2>
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {post.description}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              darkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="mt-3 sm:mt-4 flex justify-between items-center">
                      <div className="flex space-x-2 sm:space-x-4">
                        <button
                          className={`flex items-center ${
                            darkMode
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                          <span className="text-xs sm:text-sm">Like</span>
                        </button>
                        <button
                          className={`flex items-center ${
                            darkMode
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                          <span className="text-xs sm:text-sm">Comment</span>
                        </button>
                        <button
                          className={`hidden sm:flex items-center ${
                            darkMode
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                          <span className="text-xs sm:text-sm">Share</span>
                        </button>
                      </div>

                      {/* Toggle expand button */}
                      <button
                        onClick={() => togglePostExpansion(index)}
                        className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        }`}
                      >
                        {expandedPost === index ? (
                          <>
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="sm:inline">Hide Recipe</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="sm:inline">View Recipe</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Recipe Details */}
                  {expandedPost === index && post.recipe && (
                    <div
                      className={`border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      } p-3 sm:p-4`}
                    >
                      <h3
                        className={`text-base sm:text-lg font-medium mb-3 sm:mb-4 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Recipe Steps
                      </h3>

                      <div className="space-y-4 sm:space-y-6">
                        {Object.entries(post.recipe).map(
                          (
                            [stepKey, step]: [string, RecipeStep],
                            stepIndex
                          ) => (
                            <div
                              key={stepKey}
                              className={`p-3 sm:p-4 rounded-lg ${
                                darkMode ? "bg-gray-700" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <h4
                                  className={`text-sm sm:text-base font-medium ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  Step {stepIndex + 1}
                                </h4>
                                {step.time && (
                                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    <span>{step.time} min</span>
                                  </div>
                                )}
                              </div>

                              <p
                                className={`text-xs sm:text-sm mb-2 sm:mb-3 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {step.procedure}
                              </p>

                              {step.measurements &&
                                step.measurements.length > 0 && (
                                  <div className="mt-2 sm:mt-3">
                                    <h5
                                      className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                                        darkMode
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      Ingredients for this step:
                                    </h5>
                                    <ul
                                      className={`grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 ${
                                        darkMode
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {step.measurements.map(
                                        (
                                          [ingredient, quantity]: [
                                            string,
                                            string
                                          ],
                                          ingIndex: number
                                        ) => (
                                          <li
                                            key={ingIndex}
                                            className="flex items-center text-xs sm:text-sm"
                                          >
                                            <span
                                              className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1.5 sm:mr-2 ${
                                                darkMode
                                                  ? "bg-primary/60"
                                                  : "bg-primary/40"
                                              }`}
                                            ></span>
                                            <span className="font-medium">
                                              {ingredient}
                                            </span>
                                            <span className="mx-1 sm:mx-2">
                                              -
                                            </span>
                                            <span>{quantity}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                className={`text-center py-8 sm:py-12 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400" />
                <p
                  className={`mt-3 sm:mt-4 text-base sm:text-lg font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No posts yet
                </p>
                <p
                  className={`mt-1 sm:mt-2 text-xs sm:text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Your recipe posts will appear here
                </p>
              </div>
            )}
          </div>

          {/* Right sidebar - Popular Tags - Hidden on mobile */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3 order-3">
            <div
              className={`rounded-lg p-4 sm:p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow sticky top-20`}
            >
              <h3
                className={`text-base sm:text-lg font-medium mb-3 sm:mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "healthy",
                  "quick meals",
                  "vegetarian",
                  "dessert",
                  "breakfast",
                  "dinner",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Add a trending recipes section */}
            <div
              className={`rounded-lg p-4 sm:p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow mt-4 sm:mt-6`}
            >
              <h3
                className={`text-base sm:text-lg font-medium mb-3 sm:mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Trending Recipes
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Garlic Butter Shrimp Pasta",
                  "Chocolate Lava Cake",
                  "Avocado Toast",
                ].map((recipe, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 ${
                      i < 2 ? "border-b" : ""
                    } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {recipe}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community
