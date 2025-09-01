import { useState, useEffect } from 'react';

export const useCounter = (end, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Parse the number from strings like "5K+", "200+", "15+"
    const parseNumber = (str) => {
      const num = str.replace(/[^\d]/g, '');
      const multiplier = str.includes('K') ? 1000 : 1;
      return parseInt(num) * multiplier;
    };

    const targetNumber = parseNumber(end);
    
    if (!isVisible) return;

    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (targetNumber - startValue) * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we end at the exact target number
        setCount(targetNumber);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay, isVisible]);

  const startAnimation = () => setIsVisible(true);

  // Format the number back to display format (e.g., 5000 -> "5K+")
  const formatNumber = (num) => {
    if (end.includes('K')) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return `${num}+`;
  };

  return {
    count: formatNumber(count),
    startAnimation,
    isVisible
  };
};
