import { motion } from "framer-motion";
import Hero from "@/components/sections/hero";
import FeaturedCategories from "@/components/sections/featured-categories";
import FilterBar from "@/components/ui/filter-bar";
import PopularRecipes from "@/components/sections/popular-recipes";
import CTA from "@/components/sections/cta";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const Home: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("popularity");
  const [, navigate] = useLocation();

  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const filterOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "low-carb", label: "Low Carb" },
    { id: "quick-meals", label: "Quick Meals" }
  ];

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    out: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <Hero />
      <FeaturedCategories />
      
      <section className="container mx-auto px-4 py-6">
        <FilterBar 
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      </section>
      
      <PopularRecipes 
        initialLimit={4} 
        filters={selectedFilters}
        sortOption={sortOption}
      />
      <CTA />
    </motion.div>
  );
};

export default Home;
