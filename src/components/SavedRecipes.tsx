
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { Recipe } from '@/services/recipeService';
import RecipeTimeline from './RecipeTimeline';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<{ recipe: Recipe; savedAt: string; name: string }[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('saved_recipes');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.lastRecipe) {
          setSavedRecipes([
            {
              recipe: parsed.lastRecipe,
              savedAt: parsed.savedAt || new Date().toISOString(),
              name: parsed.recipeName || 'Unnamed Recipe'
            }
          ]);
        }
      } catch (e) {
        console.error('Failed to load saved recipes', e);
      }
    }
  }, []);

  const handleDeleteRecipe = (index: number) => {
    setSavedRecipes(prev => {
      const newRecipes = [...prev];
      newRecipes.splice(index, 1);
      localStorage.setItem('saved_recipes', JSON.stringify({}));
      return newRecipes;
    });
    setSelectedRecipe(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Saved Recipes</h2>
      {savedRecipes.length === 0 ? (
        <div className="text-center py-8">
          No saved recipes yet. Save a recipe to see it here!
        </div>
      ) : (
        <div className="grid gap-6">
          {savedRecipes.map((saved, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setSelectedRecipe(selectedRecipe === saved.recipe ? null : saved.recipe)}
                  className="text-left hover:text-primary dark:hover:text-primary-hover transition-colors"
                >
                  <h3 className="text-lg font-semibold">{saved.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Saved on: {new Date(saved.savedAt).toLocaleDateString()}
                  </p>
                </button>
                <button
                  onClick={() => handleDeleteRecipe(index)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label="Delete recipe"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {selectedRecipe === saved.recipe && (
                <div className="mt-4">
                  <RecipeTimeline
                    recipe={saved.recipe}
                    currentStep={0}
                    onNextStep={() => {}}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
