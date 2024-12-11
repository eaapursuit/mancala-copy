import React, { useMemo } from 'react';
import { useSpring, animated } from 'react-spring';

function Marble() {
  // Generate a random color when the component mounts
  const randomColor = useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 40 + Math.floor(Math.random() * 20);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []); // Empty dependency array ensures color is set only once per marble

  const styles = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <animated.div
      style={{
        ...styles,
        width: 3,
        height: 3,
        borderRadius: '50%',
        backgroundColor: randomColor,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        background: `radial-gradient(circle at 30% 30%, white 5%, ${randomColor} 50%)`,
      }}
    />
  );
}

export default Marble;