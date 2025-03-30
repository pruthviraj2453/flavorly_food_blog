import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CTA: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <section className="bg-primary-light/10 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <motion.h2 
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            variants={item}
          >
            Ready to Level Up Your Cooking Skills?
          </motion.h2>
          
          <motion.p 
            className="text-neutral-dark text-lg mb-8"
            variants={item}
          >
            Join our community of food enthusiasts, share your favorite recipes, and track your culinary achievements.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            variants={container}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              variants={item}
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="fas fa-book text-2xl text-primary"></i>
              </div>
              <h3 className="font-semibold text-xl mb-2">700+ Recipes</h3>
              <p className="text-neutral-dark">Access our growing library of delicious recipes from around the world.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              variants={item}
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="fas fa-users text-2xl text-primary"></i>
              </div>
              <h3 className="font-semibold text-xl mb-2">Community Support</h3>
              <p className="text-neutral-dark">Get cooking tips and inspiration from our passionate food community.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              variants={item}
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="fas fa-medal text-2xl text-primary"></i>
              </div>
              <h3 className="font-semibold text-xl mb-2">Track Progress</h3>
              <p className="text-neutral-dark">Earn achievements and track your cooking journey with our gamified experience.</p>
            </motion.div>
          </motion.div>
          
          <motion.div variants={item}>
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg hover:shadow-xl"
              >
                Sign Up for Free
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
