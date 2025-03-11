
import React, { useState, useEffect } from "react";
import { X, Edit, Check } from "lucide-react";
import type { Recipe } from "@/services/recipeService";

interface IngredientsPanelProps {
  recipe: Recipe;
  onClose: () => void;
  onUpdateIngredient: (ingredient: string, newQuantity: string) => void;
}

const IngredientsPanel: React.FC<IngredientsPanelProps> = ({
  recipe,
  onClose,
  onUpdateIngredient,
}) => {
  const [ingredients, setIngredients] = useState<[string, string][]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    const allIngredients = new Map<string, string>();
    
    Object.values(recipe).forEach((step) => {
      step.measurements.forEach(([ingredient, quantity]) => {
        allIngredients.set(ingredient, quantity);
      });
    });
    
    setIngredients(Array.from(allIngredients.entries()));
  }, [recipe]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(ingredients[index][1]);
  };

  const handleSave = (index: number) => {
    const ingredient = ingredients[index][0];
    const newQuantity = editValue;
    
    const newIngredients = [...ingredients];
    newIngredients[index] = [ingredient, newQuantity];
    setIngredients(newIngredients);
    
    onUpdateIngredient(ingredient, newQuantity);
    
    setEditingIndex(null);
    setEditValue("");
  };

  const capitalizeFirst = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full overflow-y-auto shadow-xl animate-slide-in-right">
        <div className="p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Precise Ingredients</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close panel"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>
        
        <div className="p-4">
          {ingredients.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">No ingredients listed for this recipe.</p>
          ) : (
            <ul className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <li 
                  key={index}
                  className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium dark:text-white">{capitalizeFirst(ingredient[0])}</span>
                    
                    {editingIndex === index ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1 w-24"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(index)}
                          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                          aria-label="Save"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-700 dark:text-gray-300">{ingredient[1]}</span>
                        <button
                          onClick={() => handleEdit(index)}
                          className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          aria-label="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsPanel;
