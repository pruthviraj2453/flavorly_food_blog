import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from '@assets/a-hero-image-for-my-food-blog-web-app-na_tPAEcUQnSM2CDvtqQaF4zw_Ix-JK1QyTouG02NIzHyraQ.jpeg';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 z-10"></div>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-20">
        <div className="max-w-2xl">
          <motion.span 
            className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Trending Now
          </motion.span>
          
          <motion.h1 
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover Delicious <span className="text-primary-light">Homemade</span> Recipes
          </motion.h1>
          
          <motion.p 
            className="text-white text-lg md:text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore interactive recipes, track your cooking progress, and share your culinary creations with our vibrant community.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/recipes">
              <motion.div 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors shadow-lg hover:shadow-xl flex items-center justify-center group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span>Start Cooking</span>
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </motion.div>
            </Link>
            
            <Link href="/tutorials">
              <motion.div 
                className="bg-white hover:bg-neutral-light text-primary font-bold py-3 px-6 rounded-full transition-colors shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <i className="fas fa-play mr-2"></i>
                <span>Watch Tutorials</span>
              </motion.div>
            </Link>
          </div>
          
          <motion.div 
            className="flex items-center mt-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex -space-x-4 mr-4">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User avatar" />
              <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User avatar" />
              <img src="https://randomuser.me/api/portraits/women/22.jpg" className="w-10 h-10 rounded-full border-2 border-white" alt="User avatar" />
            </div>
            <div>
              <div className="text-sm font-semibold">Join 10,000+ food enthusiasts</div>
              <div className="text-xs text-neutral-dark">Share recipes and cooking tips</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
