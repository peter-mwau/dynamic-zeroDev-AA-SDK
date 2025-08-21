import React, { useRef, useEffect } from "react";

// Vanta Globe background using Three.js and Vanta.js
// Loads Vanta and Three.js dynamically to avoid global script tags
const VantaDotsBG = ({ darkMode }) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    let mounted = true;
    let vantaCleanup = null;
    let threeScript, vantaScript;

    // Dynamically load Three.js and Vanta Globe
    const loadScripts = async () => {
      if (window.THREE && window.VANTA && window.VANTA.DOTS) return true;
      // Load Three.js
      if (!window.THREE) {
        threeScript = document.createElement("script");
        threeScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
        threeScript.async = true;
        document.body.appendChild(threeScript);
        await new Promise((res) => {
          threeScript.onload = res;
        });
      }
      // Load Vanta Globe
      if (!window.VANTA || !window.VANTA.DOTS) {
        vantaScript = document.createElement("script");
        vantaScript.src =
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js";
        vantaScript.async = true;
        document.body.appendChild(vantaScript);
        await new Promise((res) => {
          vantaScript.onload = res;
        });
      }
      return true;
    };

    loadScripts().then(() => {
      if (!mounted || !window.VANTA || !window.VANTA.DOTS) return;
      if (vantaEffect.current) vantaEffect.current.destroy();
      vantaEffect.current = window.VANTA.DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        size: 3.0,
        color: darkMode ? 0x20ff88 : 0xf2b705, // globe color
        color2: darkMode ? 0x20ff96 : 0xf2b705,
        backgroundColor: darkMode ? 0x222222 : 0xf7f7f7,
        points: 8.0,
        maxDistance: 22.0,
        spacing: 32.0,
        showLines: true,
        lineColor: 0xf2b705, // bright gold for visibility
        lineAlpha: 0.85,
      });
      vantaCleanup = () => {
        if (vantaEffect.current) vantaEffect.current.destroy();
        vantaEffect.current = null;
      };
    });
    return () => {
      mounted = false;
      if (vantaCleanup) vantaCleanup();
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
    // eslint-disable-next-line
  }, [darkMode]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        zIndex: 0,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        transition: "background 0.5s",
      }}
      aria-hidden="true"
    />
  );
};

export default VantaDotsBG;
