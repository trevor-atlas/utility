import { useEffect, useRef } from 'react';

function updateMousePosition(positionState: {
  x: number;
  y: number;
}): (ev: MouseEvent) => void {
  return (ev: MouseEvent) => {
    positionState.x = ev.clientX ?? 0;
    positionState.y = ev.clientY ?? 0;
  };
}

const useMouse = () => {
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition(mouse.current));
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return mouse;
};

export default useMouse;
