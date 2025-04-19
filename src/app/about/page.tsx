'use client';

import { useState } from "react";

export default function About() {
  const [claps, setClaps] = useState<number[]>([]);

  const handleClick = () => {
    const id = Date.now();
    setClaps((prev) => [...prev, id]);

    setTimeout(() => {
      setClaps((prev) => prev.filter((clapId) => clapId !== id));
    }, 2000);
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden min-h-screen flex items-center justify-center">
      <div style={{ padding: "2rem" }}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-400 leading-tight mb-4 sm:mb-6">
          About us
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 break-words">
          At Future Project, we believe that fitness is more than just a goal—it's a journey. Our mission is to empower individuals to unlock their full potential by providing personalized fitness plans tailored to their unique needs. Whether you're a beginner just starting your fitness journey, an intermediate enthusiast looking to level up, or an advanced athlete pushing your limits, we’ve got you covered.

          Our platform offers a seamless experience, starting with a personalized consultation to understand your goals, fitness level, and lifestyle. Based on your input, we craft customized workout routines and nutrition plans designed to help you achieve your desired transformation. But it doesn't stop there—our platform connects you with expert coaches who are there to guide, motivate, and support you every step of the way.

          With an intuitive and engaging user interface, you’ll have access to daily motivational posts, client transformations, and a dashboard where you can track your progress. We also offer a free trial period so you can experience all the benefits before committing to a subscription.

          Whether you're looking to gain muscle, lose weight, or simply improve your overall health, Future Project is here to help you become the best version of yourself. Join our community today and start your transformation journey!
        </p>

        <button
          onClick={handleClick}
          className="py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-700 to-green-500 hover:from-emerald-800 hover:to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          Appreciate
        </button>

        {claps.map((id) => (
          <span
            key={id}
            className="absolute text-2xl animate-fly pointer-events-none select-none"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              bottom: '60px',
            }}
          >
            👏
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes fly {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) scale(1.4);
            opacity: 0;
          }
        }

        .animate-fly {
          animation: fly 2s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
