import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  filterOptions: FilterOption[];
  onFilterChange: (selectedFilters: string[]) => void;
  onSortChange: (sortOption: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  onFilterChange,
  onSortChange
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];
      
      onFilterChange(newFilters);
      return newFilters;
    });
  };
  
  const clearFilters = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };
  
  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-1">
        <h3 className="font-semibold mb-2">Filter Recipes</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFilters.length === 0 ? "default" : "outline"}
            size="sm"
            className={`rounded-full text-sm font-medium ${
              selectedFilters.length === 0 
                ? "bg-primary text-white" 
                : "bg-neutral hover:bg-neutral-dark hover:text-white"
            }`}
            onClick={clearFilters}
          >
            All
            {selectedFilters.length === 0 && (
              <i className="fas fa-times ml-2"></i>
            )}
          </Button>
          
          {filterOptions.map(option => (
            <Button
              key={option.id}
              variant={selectedFilters.includes(option.id) ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm font-medium ${
                selectedFilters.includes(option.id) 
                  ? "bg-primary text-white" 
                  : "bg-neutral hover:bg-neutral-dark hover:text-white"
              }`}
              onClick={() => toggleFilter(option.id)}
            >
              {option.label}
              {selectedFilters.includes(option.id) && (
                <i className="fas fa-times ml-2"></i>
              )}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="border-t md:border-l md:border-t-0 pt-4 md:pt-0 md:pl-4 flex-shrink-0">
        <h3 className="font-semibold mb-2">Sort By</h3>
        <Select onValueChange={handleSortChange} defaultValue="popularity">
          <SelectTrigger className="bg-neutral rounded-lg w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="time-asc">Cooking Time (Low to High)</SelectItem>
            <SelectItem value="time-desc">Cooking Time (High to Low)</SelectItem>
            <SelectItem value="difficulty">Difficulty (Easy to Hard)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default FilterBar;
