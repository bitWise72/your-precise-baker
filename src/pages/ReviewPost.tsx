import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Upload, X, Camera, Clock, Save } from "lucide-react"
import type { Recipe } from "@/services/recipeService"
import Navbar from "@/components/Navbar"
import { useDarkMode } from "@/contexts/DarkModeContext"

interface RecipeFormData {
  title: string
  description: string
  images: string[]
  recipe: Recipe
  tags: string[]
}

const ReviewPost = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { darkMode, setDarkMode } = useDarkMode()
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    images: [],
    recipe: {} as Recipe,
    tags: [],
  })

  useEffect(() => {
    // Get recipe data from location state
    if (location.state?.recipe) {
      setFormData((prev) => ({
        ...prev,
        title: location.state.recipeName || "",
        recipe: location.state.recipe,
      }))
    }
  }, [location])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      )
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement post submission to backend
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate("/community")
    } catch (error) {
      console.error("Failed to post recipe:", error)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className={`${darkMode ? "text-white" : "text-gray-900"}`}>
            <h1 className="text-3xl font-bold">Review Your Recipe Post</h1>
            <p className="mt-2 text-sm text-gray-500">
              Make any final adjustments before sharing with the community
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Recipe Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Recipe ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label
                className={`h-40 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer ${
                  darkMode
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="space-y-1 text-center">
                  <Camera
                    className={`mx-auto h-12 w-12 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Add Photos
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Recipe Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300"
                } focus:ring-primary focus:border-primary`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={`mt-1 block w-full rounded-md shadow-sm ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300"
                } focus:ring-primary focus:border-primary`}
                placeholder="Share the story behind this recipe..."
              />
            </div>
          </div>

          {/* Recipe Steps */}
          <div className="space-y-4">
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Recipe Steps
            </h3>
            {Object.entries(formData.recipe).map(([stepKey, step], index) => (
              <div
                key={stepKey}
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Step {index + 1}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{step.time} min</span>
                  </div>
                </div>
                <textarea
                  value={step.procedure}
                  onChange={(e) => {
                    const updatedRecipe = { ...formData.recipe }
                    updatedRecipe[stepKey] = {
                      ...step,
                      procedure: e.target.value,
                    }
                    setFormData((prev) => ({ ...prev, recipe: updatedRecipe }))
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200"
                  } focus:ring-primary focus:border-primary`}
                  rows={3}
                />
                <div className="mt-2">
                  <h5
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Ingredients for this step:
                  </h5>
                  <ul className="mt-1 space-y-1">
                    {step.measurements.map(([ingredient, quantity], idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <input
                          aria-label={`Ingredient ${idx + 1}`}
                          type="text"
                          value={ingredient}
                          onChange={(e) => {
                            const updatedRecipe = { ...formData.recipe }
                            updatedRecipe[stepKey].measurements[idx][0] =
                              e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              recipe: updatedRecipe,
                            }))
                          }}
                          className={`flex-1 text-sm rounded ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        />
                        <input
                          value={quantity}
                          onChange={(e) => {
                            const updatedRecipe = { ...formData.recipe }
                            updatedRecipe[stepKey].measurements[idx][1] =
                              e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              recipe: updatedRecipe,
                            }))
                          }}
                          className={`w-24 text-sm rounded ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              placeholder="Add tags separated by commas (e.g., healthy, quick, vegetarian)"
              value={formData.tags.join(", ")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                }))
              }
              className={`mt-1 block w-full rounded-md shadow-sm ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300"
              } focus:ring-primary focus:border-primary`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Post Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewPost
