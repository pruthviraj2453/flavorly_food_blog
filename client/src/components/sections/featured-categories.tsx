import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "@/components/ui/category-card";
import { Category } from "@shared/schema";

const FeaturedCategories: React.FC = () => {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold">Popular Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl bg-neutral-light animate-pulse h-32"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500">Failed to load categories. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          className="font-display text-2xl md:text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Popular Categories
        </motion.h2>
        <Link href="/categories">
          <motion.a 
            className="text-primary font-semibold hover:underline flex items-center cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ x: 5 }}
          >
            View All
            <i className="fas fa-chevron-right ml-2 text-sm"></i>
          </motion.a>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories?.map((category, index) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            delay={index}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
