import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Ingredient } from "@shared/schema";
import Confetti from "@/components/ui/confetti";

interface IngredientListProps {
  ingredients: Ingredient[];
  onAllChecked?: () => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ 
  ingredients, 
  onAllChecked 
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [confettiPos, setConfettiPos] = useState<{ x: number; y: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const handleCheck = (id: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    setCheckedIngredients(prev => {
      const newState = { ...prev, [id]: !prev[id] };
      
      // If ingredient was just checked (not unchecked)
      if (!prev[id]) {
        setConfettiPos({ 
          x: rect.x + rect.width / 2, 
          y: rect.y + rect.height / 2 
        });
        
        // Check if all ingredients are now checked
        const allChecked = ingredients.every(ingredient => 
          newState[ingredient.id] === true
        );
        
        if (allChecked && onAllChecked) {
          onAllChecked();
        }
      } else {
        setConfettiPos(null);
      }
      
      return newState;
    });
  };
  
  const checkAll = () => {
    const newState: Record<number, boolean> = {};
    ingredients.forEach(ingredient => {
      newState[ingredient.id] = true;
    });
    setCheckedIngredients(newState);
    
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect();
      setConfettiPos({ 
        x: rect.x + rect.width / 2, 
        y: rect.y + rect.height / 2 
      });
    }
    
    if (onAllChecked) {
      onAllChecked();
    }
  };

  return (
    <div className="bg-neutral-light rounded-xl p-5 mb-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <i className="fas fa-shopping-basket text-primary mr-2"></i>
        Ingredients
        <Button 
          variant="link" 
          size="sm"
          className="ml-auto text-sm text-primary hover:underline"
          onClick={checkAll}
        >
          Check All
        </Button>
      </h3>
      
      <ul className="space-y-3" ref={listRef}>
        {ingredients.map((ingredient) => (
          <motion.li 
            key={ingredient.id} 
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Checkbox 
              id={`ingredient-${ingredient.id}`}
              checked={checkedIngredients[ingredient.id]}
              onCheckedChange={(checked) => 
                setCheckedIngredients(prev => ({ ...prev, [ingredient.id]: !!checked }))
              }
              onClick={(e) => handleCheck(ingredient.id, e)}
              className="w-5 h-5 rounded text-primary focus:ring-primary mr-3"
            />
            <label 
              htmlFor={`ingredient-${ingredient.id}`}
              className={`cursor-pointer ${checkedIngredients[ingredient.id] ? 'line-through text-neutral-dark/70' : ''}`}
            >
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </label>
          </motion.li>
        ))}
      </ul>
      
      <div className="mt-4 text-center">
        <Button className="w-full bg-primary hover:bg-primary-dark text-white">
          <i className="fas fa-cart-plus mr-2"></i>
          Add All to Shopping List
        </Button>
      </div>
      
      {confettiPos && (
        <Confetti 
          x={confettiPos.x} 
          y={confettiPos.y} 
          amount={20}
          duration={1500}
        />
      )}
    </div>
  );
};

export default IngredientList;
