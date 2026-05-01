"use client";
import { useState, useEffect } from "react";

const Carousel = () => {
  const images = [
    {path: "/dhurandar-title.jpg", id: 2},
    {path: "/breaking-bad.jpg", id: 4},
    {path: "/planet-earth.jpg", id: 5}
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

    function handleRouting(id: number){
      window.location.href = `/video/play/${id}`;
  }


  return (
    <div className="relative w-full h-[200px] sm:h-[600px] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} 
          onClick={() => handleRouting(src.id!)}
          className="w-full flex-shrink-0 relative hover:cursor-pointer" 
          
          >
            <img
              src={src.path}
              className="w-full h-full object-contain"
              alt={`slide-${i}`}
            />
            {/* Optional fade overlay for polish */}
            <div  className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              current === i ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;


