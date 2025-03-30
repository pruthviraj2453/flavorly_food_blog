import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RecipeDetail from "@/pages/recipe-detail";
import AchievementBadge from "@/components/ui/achievement-badge";
import BasicPage from "./pages/basic-page";

// Load fonts
import "./lib/font-loader";

function Router() {
  const [location] = useLocation();
  
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/" component={Home} />
          <Route path="/recipes/:id" component={RecipeDetail} />
          <Route path="/recipes" component={() => <BasicPage title="All Recipes" />} />
          <Route path="/tutorials" component={() => <BasicPage title="Cooking Tutorials" />} />
          <Route path="/my-recipes" component={() => <BasicPage title="My Recipes" />} />
          <Route path="/meal-planner" component={() => <BasicPage title="Meal Planner" />} />
          <Route path="/community" component={() => <BasicPage title="Community" />} />
          <Route path="/categories" component={() => <BasicPage title="All Categories" />} />
          <Route path="/categories/:category">
            {(params: any) => {
              const category = params?.params?.category || '';
              return <BasicPage title={`${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')} Recipes`} />;
            }}
          </Route>
          <Route path="/search" component={() => <BasicPage title="Search Results" />} />
          <Route path="/signup" component={() => <BasicPage title="Sign Up" />} />
          <Route path="/about" component={() => <BasicPage title="About Us" />} />
          <Route path="/privacy" component={() => <BasicPage title="Privacy Policy" />} />
          <Route path="/terms" component={() => <BasicPage title="Terms of Service" />} />
          <Route path="/cookies" component={() => <BasicPage title="Cookie Policy" />} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <AchievementBadge />
    </QueryClientProvider>
  );
}

export default App;
