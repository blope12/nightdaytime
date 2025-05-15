import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./DayNightClock.css";
import "./StarsBackground.css";

export default function DayNightClock() {
  const [time, setTime] = useState(new Date());
  const [meteorites, setMeteorites] = useState([]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const updateParallax = (xPercent, yPercent) => {
    ["stars", "stars2", "stars3"].forEach((id, index) => {
      const speed = 30 - index * 10;
      const element = document.getElementById(id);
      if (element) {
        element.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
      }
    });
  };

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const percentX = e.clientX / innerWidth - 0.5;
    const percentY = e.clientY / innerHeight - 0.5;
    updateParallax(percentX, percentY);
  };

  const handleOrientation = (e) => {
    const percentX = e.gamma / 45; // gamma: left to right [-90,90]
    const percentY = e.beta / 90;  // beta: front to back [-180,180]
    updateParallax(percentX, percentY);
  };

  if (window.DeviceOrientationEvent && /Mobi|Android/i.test(navigator.userAgent)) {
    window.addEventListener("deviceorientation", handleOrientation);
  } else {
    window.addEventListener("mousemove", handleMouseMove);
  }

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("deviceorientation", handleOrientation);
  };
}, []);


  // Meteorite spawning logic
  useEffect(() => {
    const spawnMeteorites = () => {
      const newMeteorites = Array.from({ length: 5 }).map(() => {
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const speed = Math.random() * 4 + 2;
        return {
          id: Math.random(),
          style: {
            width: `${size}px`,
            height: `${size}px`,
            top: `${startY}vh`,
            left: `${startX}vw`,
            animationDuration: `${speed}s`,
          },
        };
      });
      setMeteorites(newMeteorites);
    };

    const meteoriteInterval = setInterval(spawnMeteorites, 3000);
    return () => clearInterval(meteoriteInterval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const isDay = hours >= 6 && hours < 18;
  const angle = (hours * 30 + minutes * 0.5 + seconds * (0.5 / 60)) % 360;

  const formatUnit = (value) => value.toString().padStart(2, "0");

  return (
    <div className={`clock-container ${isDay ? "day" : "night"}`}>
      {/* Show stars and meteorites only at night */}
      {!isDay && (
        <>
          <div id="stars" />
          <div id="stars2" />
          <div id="stars3" />
          {meteorites.map((meteorite) => (
            <div key={meteorite.id} className="meteorite" style={meteorite.style} />
          ))}
        </>
      )}

      <div className="clock-wrapper">
        {/* Night orbit wobble */}
        <motion.div
          className="orbit"
          animate={{ rotate: isDay ? 0 : 10 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />

        {/* Orbital rotation */}
        <motion.div
          className="rotating"
          animate={{ rotate: angle }}
          transition={{ type: "tween", duration: 1, ease: "linear" }}
        >
          <motion.div
            className={`orb ${isDay ? "sun" : "moon"}`}
            animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        {/* Digital clock */}
        <div className="clock-time flex">
          {[hours, minutes, seconds].map((unit, i) => (
            <div key={i} className="time-unit">
              <motion.div
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  repeat: 1,
                  repeatType: "reverse",
                  delay: 0.1 * i,
                }}
              >
                {formatUnit(unit)}
              </motion.div>
              {i < 2 && <span className="colon">:</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
