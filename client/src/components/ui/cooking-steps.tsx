import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Step } from "@shared/schema";
import Timer from "@/components/ui/timer";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/ui/confetti";

interface CookingStepsProps {
  steps: Step[];
  onAllStepsCompleted?: () => void;
}

const CookingSteps: React.FC<CookingStepsProps> = ({ 
  steps,
  onAllStepsCompleted
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeTimer, setActiveTimer] = useState<{ stepId: number, title: string, minutes: number } | null>(null);
  const [confettiPosition, setConfettiPosition] = useState<{ x: number, y: number } | null>(null);
  const { toast } = useToast();

  const handleMarkComplete = (stepId: number, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    setCompletedSteps(prev => {
      const newState = { ...prev, [stepId]: true };
      
      // Check if all steps are completed
      const allCompleted = steps.every(step => newState[step.id] === true);
      if (allCompleted && onAllStepsCompleted) {
        onAllStepsCompleted();
        setConfettiPosition({
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        });
        
        toast({
          title: "All steps completed!",
          description: "You've successfully completed all cooking steps.",
        });
      }
      
      return newState;
    });
  };

  const startTimer = (stepId: number, title: string, minutes: number | null | undefined) => {
    if (!minutes) return;
    
    setActiveTimer({
      stepId,
      title,
      minutes
    });
  };

  const handleTimerComplete = () => {
    if (!activeTimer) return;
    
    toast({
      title: "Timer completed!",
      description: `Time's up for step: ${activeTimer.title}`,
    });
    
    // Mark step as completed
    setCompletedSteps(prev => ({
      ...prev,
      [activeTimer.stepId]: true
    }));
    
    setActiveTimer(null);
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <i className="fas fa-list-ol text-primary mr-2"></i>
        Cooking Instructions
      </h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            className={`bg-neutral-light rounded-xl p-5 relative ${completedSteps[step.id] ? 'opacity-70' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="absolute -left-2 -top-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
              {step.stepNumber}
            </div>
            
            <h4 className="font-semibold mb-2 pl-6">
              {completedSteps[step.id] && <i className="fas fa-check-circle text-secondary mr-2"></i>}
              Step {step.stepNumber}
            </h4>
            <p className="text-neutral-dark mb-3">{step.instruction}</p>
            
            <div className="flex flex-wrap gap-3 mt-4">
              {step.timerMinutes && (
                <Button 
                  variant="outline"
                  className="bg-white text-primary font-medium hover:bg-primary hover:text-white transition-colors"
                  onClick={() => startTimer(step.id, `Step ${step.stepNumber}`, step.timerMinutes)}
                  disabled={completedSteps[step.id]}
                >
                  <i className="fas fa-clock mr-2"></i>
                  Start {step.timerMinutes} min Timer
                </Button>
              )}
              <Button 
                variant="outline"
                className={`
                  font-medium
                  ${completedSteps[step.id] 
                    ? 'bg-secondary text-white hover:bg-secondary-dark' 
                    : 'bg-white text-neutral-dark hover:bg-neutral-dark hover:text-white'}
                  transition-colors
                `}
                onClick={(e) => handleMarkComplete(step.id, e)}
                disabled={completedSteps[step.id]}
              >
                <i className="fas fa-check mr-2"></i>
                Mark as Complete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {activeTimer && (
        <Timer
          minutes={activeTimer.minutes}
          stepTitle={activeTimer.title}
          onComplete={handleTimerComplete}
          onClose={() => setActiveTimer(null)}
        />
      )}
      
      {confettiPosition && (
        <Confetti
          x={confettiPosition.x}
          y={confettiPosition.y}
          amount={50}
          duration={2000}
        />
      )}
    </div>
  );
};

export default CookingSteps;
