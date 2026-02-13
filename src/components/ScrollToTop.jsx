import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll window
    window.scrollTo(0, 0);
    
    // Scroll all elements with overflow-auto class
    const scrollContainers = document.querySelectorAll('.overflow-auto');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
