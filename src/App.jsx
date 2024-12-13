import React, { useRef, useEffect, useState } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const [hue, setHue] = useState(0); // Hue range 0-1 (normalized)

  useEffect(() => {
    drawPentagonColorPicker();
  }, [hue]);

  const drawPentagonColorPicker = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    // Define pentagon points
    const points = Array.from({ length: 5 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2; // Rotate by -90°
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Create gradient for pentagon
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, `hsl(${hue * 360}, 100%, 50%)`);
    gradient.addColorStop(1, "black");

    ctx.fillStyle = gradient;
    ctx.beginPath();

    points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.closePath();
    ctx.fill();
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imageData = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
    const [r, g, b] = imageData;

    alert(`Selected Color: rgb(${r}, ${g}, ${b})`);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Pentagon Color Picker</h1>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={hue}
        onChange={(e) => setHue(parseFloat(e.target.value))}
        className="mb-4"
      />
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onClick={handleCanvasClick}
        className="border border-gray-300"
      />
    </div>
  );
};

export default App;
