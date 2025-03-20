import React, { useState } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  Award,
  TrendingUp,
  Users,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { useDarkMode } from "@/contexts/DarkModeContext"

interface Recipe {
  id: string
  title: string
  description: string
  images: string[]
  author: {
    name: string
    avatar: string
    followers: number
  }
  likes: number
  comments: number
  shares: number
  createdAt: string
}

interface Cook {
  id: string
  name: string
  avatar: string
  followers: number
  recipes: number
  isFollowing: boolean
}

const Community = () => {
  const { darkMode, setDarkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState<"trending" | "following">(
    "trending"
  )

  // Mock data - replace with actual API calls
  const trendingRecipes: Recipe[] = [
    {
      id: "1",
      title: "Homemade Pizza",
      description: "Perfect crispy crust with fresh toppings...",
      images: ["/mock/pizza.jpg"],
      author: {
        name: "John Doe",
        avatar: "/mock/avatar1.jpg",
        followers: 1200,
      },
      likes: 342,
      comments: 56,
      shares: 28,
      createdAt: "2024-03-15T10:00:00Z",
    },
    // Add more mock recipes
  ]

  const topCooks: Cook[] = [
    {
      id: "1",
      name: "Gordon Ramsay",
      avatar: "/mock/gordon.jpg",
      followers: 5000,
      recipes: 150,
      isFollowing: false,
    },
    // Add more mock cooks
  ]

  const handleFollow = (cookId: string) => {
    // Implement follow functionality
    console.log("Following cook:", cookId)
  }

  const handleLike = (recipeId: string) => {
    // Implement like functionality
    console.log("Liking recipe:", recipeId)
  }

  const handleComment = (recipeId: string) => {
    // Implement comment functionality
    console.log("Commenting on recipe:", recipeId)
  }

  const handleShare = (recipeId: string) => {
    // Implement share functionality
    console.log("Sharing recipe:", recipeId)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - User Profile & Stats */}
          <div className="lg:col-span-3 space-y-6">
            <div
              className={`rounded-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <div className="text-center">
                <img
                  src="/mock/user-avatar.jpg"
                  alt="Your profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Name
                </h2>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  @username
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <div className="text-center">
                    <div
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      250
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Followers
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      15
                    </div>
                    <div
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Recipes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Cooks */}
            <div
              className={`rounded-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <h3
                className={`text-lg font-semibold mb-4 flex items-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Award className="h-5 w-5 mr-2" />
                Top Cooks
              </h3>
              <div className="space-y-4">
                {topCooks.map((cook) => (
                  <div
                    key={cook.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={cook.avatar}
                        alt={cook.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <div
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {cook.name}
                        </div>
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {cook.followers} followers
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(cook.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        cook.isFollowing
                          ? "bg-gray-200 text-gray-800"
                          : "bg-primary text-white"
                      }`}
                    >
                      {cook.isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Recipe Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Feed Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
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
                Following
              </button>
            </div>

            {/* Recipe Posts */}
            <div className="space-y-6">
              {trendingRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className={`rounded-lg ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } shadow`}
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={recipe.author.avatar}
                        alt={recipe.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <div
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {recipe.author.name}
                        </div>
                        <div
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(recipe.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Images */}
                  {recipe.images.length > 0 && (
                    <img
                      src={recipe.images[0]}
                      alt={recipe.title}
                      className="w-full aspect-video object-cover"
                    />
                  )}

                  {/* Recipe Content */}
                  <div className="p-4">
                    <h2
                      className={`text-xl font-semibold mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {recipe.title}
                    </h2>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {recipe.description}
                    </p>
                  </div>

                  {/* Interaction Buttons */}
                  <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => handleLike(recipe.id)}
                      className={`flex items-center space-x-2 ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span>{recipe.likes}</span>
                    </button>
                    <button
                      onClick={() => handleComment(recipe.id)}
                      className={`flex items-center space-x-2 ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{recipe.comments}</span>
                    </button>
                    <button
                      onClick={() => handleShare(recipe.id)}
                      className={`flex items-center space-x-2 ${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Share2 className="h-5 w-5" />
                      <span>{recipe.shares}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Trending This Week */}
          <div className="lg:col-span-3">
            <div
              className={`rounded-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow`}
            >
              <h3
                className={`text-lg font-semibold mb-4 flex items-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending This Week
              </h3>
              <div className="space-y-4">
                {trendingRecipes.slice(0, 5).map((recipe) => (
                  <div key={recipe.id} className="flex items-center space-x-3">
                    <img
                      src={recipe.images[0]}
                      alt={recipe.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4
                        className={`font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {recipe.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {recipe.likes} likes
                      </p>
                    </div>
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
