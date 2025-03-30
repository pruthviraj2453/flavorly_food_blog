import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <motion.nav 
      className={`sticky top-0 bg-white ${isScrolled ? 'bg-opacity-95 backdrop-blur-sm shadow-md' : 'bg-opacity-100'} z-50 transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <UtensilsCrossed className="text-primary text-2xl" />
            <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Flavorly</h1>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {["Healthy", "Desserts", "Vegetarian", "Quick & Easy", "Italian", "Breakfast"].map((category) => (
                    <li key={category}>
                      <Link href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{category}</div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/my-recipes">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  My Recipes
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/meal-planner">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Meal Planner
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/community">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Community
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Input 
              type="text" 
              placeholder="Search recipes..." 
              className="pl-10 pr-4 py-2 rounded-full border border-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-30 w-full md:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-3 top-3 text-neutral-dark"></i>
          </form>
          
          <Button variant="ghost" size="icon" className="relative group">
            <i className="fas fa-bookmark text-neutral-dark hover:text-primary transition-colors text-xl"></i>
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-neutral-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Saved Recipes</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative group">
            <i className="fas fa-trophy text-neutral-dark hover:text-primary transition-colors text-xl"></i>
            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">5</span>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-neutral-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">Achievements</span>
          </Button>
          
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary-dark text-white font-semibold transition-colors">
              Sign In
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="md:hidden text-neutral-dark hover:text-primary transition-colors">
            <i className="fas fa-bars text-xl"></i>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
