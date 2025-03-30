import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global styles for 3D card flipping
const style = document.createElement('style');
style.textContent = `
  .perspective {
    perspective: 1000px;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .preserveBack {
    transform-style: preserve-3d;
  }
  
  .rotateY180 {
    transform: rotateY(180deg);
  }
  
  :root {
    scroll-behavior: smooth;
  }
  
  .shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% {background-position: -200% 0;}
    100% {background-position: 200% 0;}
  }
  
  .timer-circle {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 1s linear;
  }
  
  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    opacity: 0;
  }
`;

document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
