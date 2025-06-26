import React from 'react';
import './background-icons.css';

// 1. Picături de sânge pulsatile
function BloodDrops() {
  // poziții random, delay random
  const drops = Array.from({ length: 7 }).map((_, i) => {
    const top = Math.random() * 80 + 5;
    const left = Math.random() * 90;
    const delay = (Math.random() * 2.5).toFixed(2) + 's';
    return (
      <svg
        key={i}
        className="blood-drop"
        style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: 18 + Math.random()*10, height: 28 + Math.random()*10, animationDelay: delay }}
        viewBox="0 0 24 32"
        fill="none"
      >
        <path d="M12 2C12 2 21 15 21 22C21 27.5228 16.5228 32 11 32C5.47715 32 1 27.5228 1 22C1 15 12 2 12 2Z" fill="#e11d48" fillOpacity="0.7"/>
        <ellipse cx="12" cy="25" rx="5" ry="7" fill="#fff" fillOpacity="0.08"/>
      </svg>
    );
  });
  return <>{drops}</>;
}

// 2. Linie ECG animată
function ECGLine() {
  return (
    <svg className="ecg-line" style={{ position: 'absolute', top: '30%', left: 0, width: '60vw', height: 32 }} viewBox="0 0 600 32" fill="none">
      <path
        d="M0 16 H60 L80 8 L100 24 L120 16 L140 16 L160 4 L180 28 L200 16 H600"
        stroke="#eab308" strokeWidth="2.5" strokeLinejoin="round"
        strokeDasharray="20 10 30 10 40 10 50 10 60 10 70 10 80 10 90 10 100 10"
      />
    </svg>
  );
}

// 3. Glucometru pop-in
function Glucometers() {
  const meters = Array.from({ length: 3 }).map((_, i) => {
    const top = 10 + Math.random() * 70;
    const left = 10 + Math.random() * 80;
    const delay = (Math.random() * 3.5).toFixed(2) + 's';
    return (
      <svg
        key={i}
        className="glucometer"
        style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: 28, height: 28, animationDelay: delay }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <rect x="8" y="4" width="16" height="20" rx="5" fill="#334155" fillOpacity="0.18"/>
        <rect x="12" y="8" width="8" height="8" rx="2" fill="#fff" fillOpacity="0.18"/>
        <circle cx="16" cy="25" r="2" fill="#10b981" fillOpacity="0.25"/>
      </svg>
    );
  });
  return <>{meters}</>;
}

// 4. Molecule de glucoză animate
function GlucoseMolecules() {
  const molecules = Array.from({ length: 2 }).map((_, i) => {
    const top = 20 + Math.random() * 60;
    const left = 20 + Math.random() * 60;
    const delay = (Math.random() * 2.5).toFixed(2) + 's';
    return (
      <svg
        key={i}
        className="glucose-molecule"
        style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: 44, height: 44, animationDelay: delay }}
        viewBox="0 0 44 44"
        fill="none"
      >
        <circle cx="22" cy="22" r="10" fill="#fbbf24" fillOpacity="0.13"/>
        <circle cx="10" cy="22" r="4" fill="#fbbf24" fillOpacity="0.18"/>
        <circle cx="34" cy="22" r="4" fill="#fbbf24" fillOpacity="0.18"/>
        <circle cx="22" cy="10" r="4" fill="#fbbf24" fillOpacity="0.18"/>
        <circle cx="22" cy="34" r="4" fill="#fbbf24" fillOpacity="0.18"/>
        <line x1="14" y1="22" x2="30" y2="22" stroke="#fbbf24" strokeWidth="2" className="molecule-bond"/>
        <line x1="22" y1="14" x2="22" y2="30" stroke="#fbbf24" strokeWidth="2" className="molecule-bond"/>
      </svg>
    );
  });
  return <>{molecules}</>;
}

// 5. Iconițe de mâncare sănătoasă plutitoare
function HealthyFood() {
  const icons = [
    // SVG frunză
    <svg key="leaf" className="healthy-food" style={{ position: 'absolute', left: '15%', top: '70%', width: 22, height: 22, animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 20 8 20 16C20 20 16 22 12 22C8 22 4 20 4 16C4 8 12 2 12 2Z" fill="#22c55e" fillOpacity="0.12"/></svg>,
    // SVG măr
    <svg key="apple" className="healthy-food" style={{ position: 'absolute', left: '80%', top: '60%', width: 22, height: 22, animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="15" r="7" fill="#f87171" fillOpacity="0.10"/><rect x="11" y="6" width="2" height="4" rx="1" fill="#a3e635" fillOpacity="0.15"/></svg>,
    // SVG steluță
    <svg key="star" className="healthy-food" style={{ position: 'absolute', left: '60%', top: '80%', width: 18, height: 18, animationDelay: '2.1s' }} viewBox="0 0 24 24" fill="none"><polygon points="12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10" fill="#fde68a" fillOpacity="0.10"/></svg>
  ];
  return <>{icons}</>;
}

// 6. Cercuri concentrice biofeedback
function BiofeedbackCircles() {
  const circles = Array.from({ length: 3 }).map((_, i) => {
    const top = 30 + Math.random() * 40;
    const left = 30 + Math.random() * 40;
    const delay = (i * 1.2).toFixed(2) + 's';
    return (
      <svg
        key={i}
        className="biofeedback-circle"
        style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, width: 60, height: 60, animationDelay: delay }}
        viewBox="0 0 60 60"
        fill="none"
      >
        <circle cx="30" cy="30" r="12" stroke="#10b981" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="30" r="24" stroke="#10b981" strokeWidth="1" fill="none"/>
      </svg>
    );
  });
  return <>{circles}</>;
}

export default function BackgroundIcons() {
  return (
    <div className="background-icons-layer" aria-hidden>
      <BloodDrops />
      <ECGLine />
      <Glucometers />
      <GlucoseMolecules />
      <HealthyFood />
      <BiofeedbackCircles />
    </div>
  );
}
