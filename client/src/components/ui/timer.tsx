import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XIcon, PauseIcon, PlayIcon, CheckIcon } from "lucide-react";

interface TimerProps {
  minutes: number;
  stepTitle: string;
  onComplete?: () => void;
  onClose?: () => void;
}

const Timer: React.FC<TimerProps> = ({
  minutes,
  stepTitle,
  onComplete,
  onClose
}) => {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      onComplete?.();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [seconds, isPaused, onComplete]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleComplete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onComplete?.();
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentComplete = 100 - (seconds / (minutes * 60)) * 100;
  const strokeDashoffset = 283 - (283 * percentComplete) / 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-full max-w-md mx-4 shadow-xl">
              <CardHeader className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2"
                  onClick={handleClose}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
                <CardTitle className="font-display text-2xl text-center">Cooking Timer</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-2 pb-6">
                <p className="text-neutral-dark mb-6">Time remaining for: {stepTitle}</p>
                
                <div className="w-48 h-48 mx-auto relative mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E7E2D9" strokeWidth="8"></circle>
                    <motion.circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#FF7D00" 
                      strokeWidth="8" 
                      strokeDasharray="283" 
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: "linear" }}
                      className="timer-circle"
                    ></motion.circle>
                    <text 
                      x="50" 
                      y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fill="#2A2118" 
                      fontSize="20" 
                      fontWeight="bold" 
                      className="timer-text"
                    >
                      {formatTime(seconds)}
                    </text>
                  </svg>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="bg-neutral text-neutral-dark hover:bg-neutral-dark hover:text-white transition-colors"
                    onClick={handlePauseResume}
                  >
                    {isPaused ? (
                      <>
                        <PlayIcon className="mr-2 h-4 w-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <PauseIcon className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    className="bg-primary text-white hover:bg-primary-dark transition-colors"
                    onClick={handleComplete}
                  >
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Timer;
