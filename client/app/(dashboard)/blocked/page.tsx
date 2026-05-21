"use client";

import { useState, useEffect } from "react";

export default function BlockedPage() {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const texts = [
    {
      type: "text",
      content: "Discipline over impulse",
    },
    {
      type: "text",
      content: "Take back your time",
    },
    {
      type: "video",
      content: "/logo.mp4",
    },
  ];

  useEffect(() => {
    // Start with first item visible
    setIsVisible(true);

    const interval = setInterval(() => {
      // Fade out current item
      setIsVisible(false);

      // After fade out, switch to next item and fade in
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 500); // Wait 500ms for fade out
    }, 2000);

    return () => clearInterval(interval);
  }, [texts.length]);

  const currentItem = texts[currentText];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div
        className={`transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentItem.type === "video" ? (
          <div className="flex justify-center items-center">
            <video
              src={currentItem.content}
              autoPlay
              muted
              loop={false}
              playsInline
              className="w-32 h-32 object-contain border-0 outline-none"
              style={{ border: "none", outline: "none" }}
            />
          </div>
        ) : (
          <h1 className="text-black text-4xl font-medium text-center">
            {currentItem.content}
          </h1>
        )}
      </div>
    </div>
  );
}
