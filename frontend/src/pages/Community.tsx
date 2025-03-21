import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, TrendingUp, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface Post {
  title: string;
  description: string;
  imageUrl: string[]; // URLs will be replaced with signed URLs
  recipe: any;
  tags: string[];
  createdAt: string;
}

// Define the user data structure
interface UserData {
  googleId: string;
  name: string;
  email: string;
  picture: string;
  posts: Post[];
}

const Community = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<"trending" | "following">("following");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch signed URLs for images
  const fetchSignedImage = async (publicId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/get-signed-url?public_id=${publicId}`);
      const data = await response.json();
      return data.signedUrl; // Use this signed URL
    } catch (error) {
      console.error("Error fetching signed image URL:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;
  
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/yourPosts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data: UserData = await response.json();
  
        // Ensure imageUrl is always an array
        const updatedPosts = data.posts.map((post) => ({
          ...post,
          imageUrl: Array.isArray(post.imageUrl) ? post.imageUrl : [], // Prevents errors
        }));
  
        setUserData({ ...data, posts: updatedPosts });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} name={userData?.name || ""} image={userData?.picture || ""} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - User Profile */}
          <div className="lg:col-span-3 space-y-6">
            {userData ? (
              <div className={`rounded-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                <div className="text-center">
                  <img
                    src={userData.picture}
                    alt={userData.name}
                    crossOrigin="anonymous"
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{userData.name}</h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{userData.email}</p>
                  <div className="mt-4 flex justify-center space-x-4">
                    <div className="text-center">
                      <div className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{userData.posts.length}</div>
                      <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Posts</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Loading profile...</p>
            )}
          </div>

          {/* Main Content - Recipe Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Feed Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("trending")}
                className={`pb-4 px-2 text-sm font-medium ${
                  activeTab === "trending" ? "border-b-2 border-primary text-primary" : darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <TrendingUp className="h-5 w-5 inline mr-2" />
                Trending
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`pb-4 px-2 text-sm font-medium ${
                  activeTab === "following" ? "border-b-2 border-primary text-primary" : darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Your Posts
              </button>
            </div>

            {/* Display User Posts */}
            {loading ? (
              <p className="text-center text-gray-500">Loading posts...</p>
            ) : userData?.posts.length ? (
              userData.posts.map((post, index) => (
                <div key={index} className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                  
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={userData.picture} alt={userData.name} className="w-10 h-10 rounded-full" />
                      <div className="ml-3">
                        <div className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{userData.name}</div>
                        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Images */}
                  {post.imageUrl.length > 0 && (
                    <img src={post.imageUrl[0]} alt={post.title} className="w-full aspect-video object-cover" crossOrigin="anonymous" />
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{post.title}</h2>
                    <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{post.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
