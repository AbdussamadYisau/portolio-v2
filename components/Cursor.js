import { useRef, useEffect } from "react";
import { useTheme } from "next-themes";

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const {theme} = useTheme();

    useEffect(() => {
        document.addEventListener("mousemove", (e) => {
            const {clientX, clientY} = e;

            const mouseX = clientX - cursorRef.current.clientWidth / 2;
            const mouseY = clientY - cursorRef.current.clientHeight;

            cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        })
    }, []);
    return (
      <div className={`hidden lg:block ${theme === 'dark' ? 'app-cursor-dark' : 'app-cursor'}`} ref={cursorRef}/>
    );
  }
  