import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-text text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer">
                <UtensilsCrossed className="text-primary text-2xl" />
                <h2 className="font-display text-2xl font-bold text-primary">Flavorly</h2>
              </div>
            </Link>
            <p className="text-white/70 mb-4">Discover delicious recipes, cooking tips, and connect with food lovers from around the world.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-pinterest text-xl"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Home</div></Link></li>
              <li><Link href="/recipes"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Recipes</div></Link></li>
              <li><Link href="/categories"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Categories</div></Link></li>
              <li><Link href="/meal-planner"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Meal Planner</div></Link></li>
              <li><Link href="/community"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Community</div></Link></li>
              <li><Link href="/about"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">About Us</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/categories/breakfast"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Breakfast</div></Link></li>
              <li><Link href="/categories/lunch"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Lunch</div></Link></li>
              <li><Link href="/categories/dinner"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Dinner</div></Link></li>
              <li><Link href="/categories/desserts"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Desserts</div></Link></li>
              <li><Link href="/categories/vegetarian"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Vegetarian</div></Link></li>
              <li><Link href="/categories/quick-easy"><div className="text-white/70 hover:text-primary transition-colors cursor-pointer">Quick & Easy</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-white/70 mb-4">Get the latest recipes and cooking tips delivered to your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative mb-3">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/10 text-white placeholder-white/50 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Flavorly. All rights reserved.
          </div>
          <div className="flex space-x-4 text-white/50 text-sm">
            <Link href="/privacy"><div className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</div></Link>
            <Link href="/terms"><div className="hover:text-primary transition-colors cursor-pointer">Terms of Service</div></Link>
            <Link href="/cookies"><div className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</div></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
