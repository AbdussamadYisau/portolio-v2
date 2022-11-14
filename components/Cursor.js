import {  useEffect, useState } from "react";
import { useTheme } from "next-themes";

const  useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  
    useEffect(() => {
      const mouseMoveHandler = (event) => {
        const { clientX, clientY } = event;
        setMousePosition({ x: clientX, y: clientY });
      };
      document.addEventListener("mousemove", mouseMoveHandler);
  
      return () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
      };
    }, []);
  
    return mousePosition;
}

export default function CustomCursor(){
    const { x, y } = useMousePosition();
    const {theme} = useTheme();
    return (
      <>
        <div style={{ left: `${x}px`, top: `${y}px` }} className={`hidden lg:block ${theme === 'dark' ? 'ring' : 'ring-dark'}`}></div>
        <div className={`hidden lg:block ${theme === 'dark' ? 'dot' : 'dot-dark'}`} style={{ left: `${x}px`, top: `${y}px` }}></div>
      </>
    );
  };

  