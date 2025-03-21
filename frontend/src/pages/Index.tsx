import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Save, List, Moon, Sun } from "lucide-react"
import RecipeSearch from "@/components/RecipeSearch"
import RecipeTimeline from "@/components/RecipeTimeline"
import IngredientsPanel from "@/components/IngredientsPanel"
import SavedRecipes from "@/components/SavedRecipes"
import { fetchRecipe } from "@/services/recipeService"
import type { Recipe } from "@/services/recipeService"
import { Send } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { useDarkMode } from "@/contexts/DarkModeContext"
import { useAuth } from "../contexts/AuthContext"

const STORAGE_KEY = "saved_recipes"

const Index = () => {
  const [user, setUser] = useState(null);
  const { darkMode, setDarkMode } = useDarkMode()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showIngredients, setShowIngredients] = useState(false)
  const [recipeName, setRecipeName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

    const savedRecipes = localStorage.getItem(STORAGE_KEY)
    if (savedRecipes) {
      try {
        const parsed = JSON.parse(savedRecipes)
        if (parsed.lastRecipe) {
          setRecipe(parsed.lastRecipe)
          setRecipeName(parsed.recipeName || "")
          toast.success("Loaded your last recipe")
        }
      } catch (e) {
        console.error("Failed to load saved recipe", e)
      }
    }
  }, [darkMode])

  const handleSearch = async (query: string) => {
    setLoading(true)
    setError(null)
    setCurrentStep(0)
    setRecipeName(query)
    try {
      const data = await fetchRecipe(query)
      const dataArray = Object.values(data) // Convert object to array
      const sortedData = dataArray.sort(
        (a, b) => Number(a.time) - Number(b.time)
      ) // Sort by time
      const newData: Recipe = sortedData.reduce((acc, step, index) => {
        acc[`step${index + 1}`] = step
        return acc
      }, {} as Recipe)

      setRecipe(newData)

      if (Object.keys(data).length > 0) {
        const firstStep = data[Object.keys(data)[0]]
        const speech = new SpeechSynthesisUtterance(firstStep.procedure)
        window.speechSynthesis.speak(speech)
      }

      toast.success("Recipe found successfully!")
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred"
      console.error("Error:", error)
      setError(errorMessage)
      toast.error(`Failed to get recipe: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = () => {
    if (!recipe) return

    const steps = Object.keys(recipe)
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      const stepData = recipe[steps[nextStep]]
      const speech = new SpeechSynthesisUtterance(stepData.procedure)
      window.speechSynthesis.speak(speech)
    }
  }

  const handleSaveRecipe = () => {
    if (!recipe) return

    if (!recipeName.trim()) {
      toast.error("Please enter a recipe name before saving")
      return
    }

    try {
      const savedData = {
        lastRecipe: recipe,
        savedAt: new Date().toISOString(),
        recipeName: recipeName || "Unnamed Recipe",
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData))
      toast.success("Recipe saved successfully!")
    } catch (e) {
      console.error("Failed to save recipe", e)
      toast.error("Failed to save recipe")
    }
  }

  const handleUpdateIngredient = (ingredient: string, newQuantity: string) => {
    if (!recipe) return

    const updatedRecipe = JSON.parse(JSON.stringify(recipe)) as Recipe

    Object.keys(updatedRecipe).forEach((stepKey) => {
      const step = updatedRecipe[stepKey]
      step.measurements = step.measurements.map(([ing, qty]) =>
        ing === ingredient ? [ing, newQuantity] : [ing, qty]
      )
    })

    setRecipe(updatedRecipe)
    toast.success(`Updated ${ingredient} to ${newQuantity}`)
  }

  const handlePost = () => {
    if (!recipe) return

    navigate("/review-post", {
      state: {
        recipe,
        recipeName,
      },
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const image = params.get("image");
    const id=params.get("id");

    if (name && email && image && id) {
      const userData = { name, email, image,id };
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store in localStorage
      setUser(userData);
      console.log(userData);
    }
    else{
      console.log("eroor");
    }
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name}
        image={user?.image}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <RecipeSearch onSearch={handleSearch} darkMode={darkMode} />

            {recipe && !loading && (
              <div className="mt-4 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-grow max-w-xs">
                    <label
                      htmlFor="recipe-name"
                      className="block text-sm font-medium mb-1"
                    >
                      Recipe Name
                    </label>
                    <input
                      type="text"
                      id="recipe-name"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="Enter recipe name"
                      className="recipe-name-input"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowIngredients(true)}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      } transition-colors`}
                      aria-label="View precise ingredients"
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span className="text-sm">Ingredients</span>
                    </button>

                    <button
                      onClick={handleSaveRecipe}
                      className="btn-primary flex items-center"
                      aria-label="Save recipe"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      <span className="text-sm">Save</span>
                    </button>

                    <button
                      onClick={handlePost}
                      className="flex items-center btn-primary"
                      aria-label="Post recipe"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      <span className="text-sm">Post</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Finding your recipe...</p>
              </div>
            )}

            {error && !loading && (
              <div
                className={`${
                  darkMode
                    ? "bg-red-900/20 border-red-900/30 text-red-300"
                    : "bg-red-50 border-red-200 text-red-600"
                } border rounded-lg p-4 text-center`}
              >
                <p>{error}</p>
                <p className="text-sm mt-2">
                  Try a different recipe or check your connection.
                </p>
              </div>
            )}

            {recipe && !loading && (
              <RecipeTimeline
                recipe={recipe}
                onNextStep={handleNextStep}
                currentStep={currentStep}
                darkMode={darkMode}
              />
            )}
          </div>

          <div className="border-t pt-8">
            <SavedRecipes darkMode={darkMode} />
          </div>
        </div>
      </main>

      {showIngredients && recipe && (
        <IngredientsPanel
          recipe={recipe}
          onClose={() => setShowIngredients(false)}
          onUpdateIngredient={handleUpdateIngredient}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default Index
