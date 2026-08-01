import React, { useState } from 'react';

interface FTFLogoProps {
  className?: string;
  size?: number;
}

/**
 * Official Fédération Tunisienne de Football (FTF) Logo Component
 * Displays the official Logo.jpg emblem with SVG vector fallback
 */
export const FTFLogo: React.FC<FTFLogoProps> = ({ className = '', size = 120 }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/Logo.jpg"
        alt="Logo Officiel FTF"
        width={size}
        height={size}
        className={`object-contain rounded-full ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Official FTF Fédération Tunisienne de Football"
    >
      <defs>
        {/* Top Text Path for Arabic "تونس" */}
        <path
          id="ftfTopArc"
          d="M 90,230 A 165,165 0 0,1 410,230"
          fill="none"
        />
        {/* Bottom Text Path for French "FÉDÉRATION TUNISIENNE DE FOOTBALL" */}
        <path
          id="ftfBottomArc"
          d="M 65,240 A 185,185 0 0,0 435,240"
          fill="none"
        />
      </defs>

      {/* 1. Outer White Circle & Red Border Ring */}
      <circle cx="250" cy="250" r="240" fill="#ffffff" stroke="#c8102e" strokeWidth="14" />

      {/* 2. Top Arched Text: تونس */}
      <text fill="#000000" fontWeight="bold" fontSize="48" fontFamily="'Segoe UI', Tahoma, 'Arial Arabic', sans-serif">
        <textPath href="#ftfTopArc" startOffset="50%" textAnchor="middle">
          تونس
        </textPath>
      </text>

      {/* 3. Central Red Field */}
      <circle cx="250" cy="265" r="160" fill="#c8102e" />

      {/* 4. Left Spread Wing Feathers */}
      <g stroke="#000000" strokeWidth="3" fill="#ffffff">
        <path d="M 230,170 C 170,120 100,125 45,130 C 52,150 65,180 85,200 C 120,210 170,220 225,215 Z" />
        <path d="M 225,185 C 160,155 105,160 55,165 C 62,185 75,210 100,230 C 135,235 180,240 220,235 Z" />
        <path d="M 220,205 C 165,185 115,190 70,195 C 78,215 90,235 115,255 C 150,255 190,255 220,245 Z" />
        <path d="M 220,225 C 175,210 130,215 90,220 C 100,235 115,250 135,268 C 165,265 195,260 220,250 Z" />
      </g>

      {/* 5. Right Spread Wing Feathers */}
      <g stroke="#000000" strokeWidth="3" fill="#ffffff">
        <path d="M 270,170 C 330,120 400,125 455,130 C 448,150 435,180 415,200 C 380,210 330,220 275,215 Z" />
        <path d="M 275,185 C 340,155 395,160 445,165 C 438,185 425,210 400,230 C 365,235 320,240 280,235 Z" />
        <path d="M 280,205 C 335,185 385,190 430,195 C 422,215 410,235 385,255 C 350,255 310,255 280,245 Z" />
        <path d="M 280,225 C 325,210 370,215 410,220 C 400,235 385,250 365,268 C 335,265 305,260 280,250 Z" />
      </g>

      {/* 6. Central Red Flag Shield with Crescent & Star */}
      <g>
        <circle cx="250" cy="295" r="105" fill="#ffffff" stroke="#000000" strokeWidth="4" />
        <circle cx="250" cy="295" r="98" fill="#c8102e" />
        <circle cx="250" cy="295" r="68" fill="#ffffff" />
        <circle cx="270" cy="290" r="56" fill="#c8102e" />
        <polygon
          points="235,270 241,288 259,288 244,299 250,317 235,306 220,317 226,299 211,288 229,288"
          fill="#c8102e"
        />
      </g>

      {/* 7. Eagle Head & Neck */}
      <g stroke="#000000" strokeWidth="3">
        <path d="M 220,180 C 230,140 270,140 280,180 Z" fill="#000000" />
        <path
          d="M 215,140 C 215,90 250,75 285,100 C 300,110 310,130 305,155 C 295,185 280,185 250,185 C 230,185 215,170 215,140 Z"
          fill="#ffffff"
        />
        <path
          d="M 215,115 C 190,115 185,135 190,155 C 200,155 212,145 215,135 Z"
          fill="#000000"
        />
        <circle cx="245" cy="118" r="10" fill="#ffffff" stroke="#000000" strokeWidth="2" />
        <circle cx="242" cy="118" r="5" fill="#000000" />
        <path d="M 235,108 C 245,105 255,108 258,112" fill="none" stroke="#000000" strokeWidth="3" />

        <path d="M 225,185 L 225,200 M 235,185 L 235,202 M 245,185 L 245,200" stroke="#000000" strokeWidth="4" />
        <path d="M 255,185 L 255,200 M 265,185 L 265,202 M 275,185 L 275,200" stroke="#000000" strokeWidth="4" />
      </g>

      {/* 8. Bottom Arched Text */}
      <text fill="#000000" fontWeight="bold" fontSize="28" fontFamily="'Arial Black', Arial, sans-serif" letterSpacing="1.5">
        <textPath href="#ftfBottomArc" startOffset="50%" textAnchor="middle">
          FÉDÉRATION TUNISIENNE DE FOOTBALL
        </textPath>
      </text>
    </svg>
  );
};

