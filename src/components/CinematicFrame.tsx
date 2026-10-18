import React from 'react';
import { Shot, AspectRatio } from '../types/storyboard';
import { Camera, Eye, Focus, MoveRight, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';

interface CinematicFrameProps {
  shot: Shot;
  aspectRatio: AspectRatio;
  showGuides?: boolean;
  className?: string;
  isInspecting?: boolean;
}

export const CinematicFrame: React.FC<CinematicFrameProps> = ({
  shot,
  aspectRatio,
  showGuides = false,
  className = '',
  isInspecting = false
}) => {
  const { visualColorTheme, compositionGuide, silhouetteType, cameraMovement, shotType } = shot;
  const primary = visualColorTheme?.primary || '#090d16';
  const secondary = visualColorTheme?.secondary || '#00f0ff';
  const accent = visualColorTheme?.accent || '#ff0055';

  // Compute aspect ratio CSS class or style
  const getAspectRatioPadding = () => {
    switch (aspectRatio) {
      case '2.39:1':
        return 'aspect-[21/9]';
      case '4:3':
        return 'aspect-[4/3]';
      case '9:16':
        return 'aspect-[9/16]';
      case '16:9':
      default:
        return 'aspect-video';
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl transition-all group ${getAspectRatioPadding()} ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 40%, ${secondary}15 0%, ${primary} 85%)`
      }}
    >
      {/* Background Cinematic Silhouette SVG Rendering */}
      <svg
        className="absolute inset-0 h-full w-full select-none"
        viewBox="0 0 600 340"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-sky-${shot.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="60%" stopColor={`${secondary}30`} />
            <stop offset="100%" stopColor={primary} />
          </linearGradient>

          <linearGradient id={`grad-glow-${shot.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id={`sun-glow-${shot.id}`} cx="50%" cy="35%" r="40%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
            <stop offset="50%" stopColor={secondary} stopOpacity="0.25" />
            <stop offset="100%" stopColor={primary} stopOpacity="0" />
          </radialGradient>

          <filter id={`blur-sm-${shot.id}`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Sky / Atmospheric backdrop */}
        <rect width="600" height="340" fill={`url(#grad-sky-${shot.id})`} />

        {/* Light flare or celestial body */}
        <circle cx="380" cy="110" r="140" fill={`url(#sun-glow-${shot.id})`} />

        {/* Anamorphic Horizontal Streak Flare */}
        <line
          x1="0"
          y1="110"
          x2="600"
          y2="110"
          stroke={secondary}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          filter={`url(#blur-sm-${shot.id})`}
        />
        <line
          x1="100"
          y1="110"
          x2="500"
          y2="110"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeOpacity="0.7"
        />

        {/* Silhouette Rendering Based on Silhouette Type */}
        {silhouetteType === 'cityscape' && (
          <g fill={primary} fillOpacity="0.95" stroke={`${secondary}40`} strokeWidth="0.5">
            {/* Background towers */}
            <rect x="40" y="80" width="45" height="260" opacity="0.6" />
            <rect x="95" y="110" width="30" height="230" opacity="0.7" />
            <rect x="135" y="60" width="60" height="280" opacity="0.8" />
            <rect x="220" y="90" width="40" height="250" opacity="0.7" />
            <rect x="330" y="50" width="75" height="290" opacity="0.85" />
            <rect x="420" y="100" width="50" height="240" opacity="0.7" />
            <rect x="480" y="70" width="65" height="270" opacity="0.8" />
            {/* Holographic billboard */}
            <rect x="145" y="75" width="40" height="30" fill={`${accent}40`} stroke={accent} strokeWidth="1" />
            <line x1="150" y1="90" x2="180" y2="90" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
            {/* Ground / Overpass */}
            <path d="M 0 280 Q 300 260 600 290 L 600 340 L 0 340 Z" fill="#04060a" />
            {/* Antenna with warning light */}
            <line x1="360" y1="50" x2="360" y2="20" stroke={secondary} strokeWidth="1.5" />
            <circle cx="360" cy="20" r="3" fill={accent} />
          </g>
        )}

        {silhouetteType === 'landscape' && (
          <g fill={primary} stroke={`${secondary}30`} strokeWidth="0.5">
            {/* Mountain ranges */}
            <path d="M 0 220 L 120 130 L 260 210 L 380 90 L 520 230 L 600 170 L 600 340 L 0 340 Z" opacity="0.7" />
            <path d="M 0 250 L 180 180 L 320 260 L 460 190 L 600 270 L 600 340 L 0 340 Z" fill="#04060a" opacity="0.95" />
            {/* Distant moon / sun crater */}
            <circle cx="200" cy="90" r="35" fill="none" stroke={secondary} strokeWidth="1" strokeDasharray="3 3" />
          </g>
        )}

        {silhouetteType === 'vehicle' && (
          <g>
            {/* Speed trails */}
            <line x1="40" y1="180" x2="280" y2="180" stroke={secondary} strokeWidth="2" strokeDasharray="12 8" opacity="0.6" />
            <line x1="20" y1="195" x2="240" y2="195" stroke={accent} strokeWidth="1.5" strokeDasharray="8 6" opacity="0.5" />
            {/* Futuristic transport / drone silhouette */}
            <path
              d="M 240 160 L 380 150 L 440 180 L 390 205 L 230 200 L 190 185 Z"
              fill="#060912"
              stroke={secondary}
              strokeWidth="1.5"
            />
            {/* Cockpit visor */}
            <path d="M 330 160 L 375 158 L 395 175 L 340 175 Z" fill={secondary} opacity="0.8" />
            {/* Jet thruster exhaust */}
            <ellipse cx="200" cy="190" rx="18" ry="6" fill={accent} />
          </g>
        )}

        {silhouetteType === 'lone-figure' && (
          <g>
            {/* Ground surface */}
            <path d="M 0 290 Q 300 280 600 295 L 600 340 L 0 340 Z" fill="#03050a" />
            {/* Lone figure silhouette */}
            <g transform="translate(300, 180)">
              {/* Head */}
              <circle cx="0" cy="0" r="13" fill="#020408" stroke={`${secondary}80`} strokeWidth="1" />
              {/* Shoulders & Body / Trench coat */}
              <path
                d="M -22 25 Q -10 12 0 12 Q 10 12 22 25 L 32 110 L -32 110 Z"
                fill="#020408"
                stroke={`${secondary}40`}
                strokeWidth="1"
              />
              {/* Edge rim light on silhouette */}
              <path d="M 12 15 Q 18 35 24 95" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.8" />
            </g>
          </g>
        )}

        {silhouetteType === 'two-characters' && (
          <g>
            {/* Ground surface */}
            <path d="M 0 290 L 600 290 L 600 340 L 0 340 Z" fill="#03050a" />
            {/* Character Left */}
            <g transform="translate(230, 180)">
              <circle cx="0" cy="0" r="12" fill="#020408" stroke={`${secondary}60`} strokeWidth="1" />
              <path d="M -18 22 Q -8 12 0 12 Q 8 12 18 22 L 24 110 L -24 110 Z" fill="#020408" />
              <line x1="8" y1="18" x2="16" y2="80" stroke={secondary} strokeWidth="1.2" opacity="0.7" />
            </g>
            {/* Character Right */}
            <g transform="translate(370, 180)">
              <circle cx="0" cy="0" r="12" fill="#020408" stroke={`${accent}60`} strokeWidth="1" />
              <path d="M -18 22 Q -8 12 0 12 Q 8 12 18 22 L 24 110 L -24 110 Z" fill="#020408" />
              <line x1="-8" y1="18" x2="-16" y2="80" stroke={accent} strokeWidth="1.2" opacity="0.7" />
            </g>
          </g>
        )}

        {silhouetteType === 'macro-detail' && (
          <g>
            {/* Stylized aperture / eye iris or focal element */}
            <circle cx="300" cy="170" r="100" fill="none" stroke={`${secondary}40`} strokeWidth="1.5" />
            <circle cx="300" cy="170" r="60" fill="none" stroke={secondary} strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="300" cy="170" r="30" fill={accent} opacity="0.7" />
            <circle cx="310" cy="160" r="8" fill="#ffffff" opacity="0.85" />
            {/* Focus reticle ticks */}
            <line x1="300" y1="50" x2="300" y2="80" stroke={secondary} strokeWidth="1.5" />
            <line x1="300" y1="260" x2="300" y2="290" stroke={secondary} strokeWidth="1.5" />
            <line x1="180" y1="170" x2="210" y2="170" stroke={secondary} strokeWidth="1.5" />
            <line x1="390" y1="170" x2="420" y2="170" stroke={secondary} strokeWidth="1.5" />
          </g>
        )}

        {silhouetteType === 'crowd' && (
          <g fill="#020408" stroke={`${secondary}40`} strokeWidth="0.8">
            <path d="M 0 300 L 600 300 L 600 340 L 0 340 Z" fill="#010204" />
            {/* Multitude heads and shoulders */}
            {[70, 120, 180, 240, 310, 370, 430, 490, 540].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${230 + (i % 3) * 12})`}>
                <circle cx="0" cy="0" r="10" />
                <path d="M -14 18 Q 0 10 14 18 L 18 70 L -18 70 Z" />
              </g>
            ))}
          </g>
        )}

        {/* Dynamic Camera Movement Directional Arrows */}
        {cameraMovement !== 'Static' && (
          <g opacity="0.85">
            {cameraMovement === 'Pan Right' && (
              <path
                d="M 460 170 L 520 170 M 505 155 L 520 170 L 505 185"
                stroke={secondary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
            {cameraMovement === 'Pan Left' && (
              <path
                d="M 140 170 L 80 170 M 95 155 L 80 170 L 95 185"
                stroke={secondary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
            {cameraMovement === 'Steadicam Push' && (
              <g transform="translate(300, 260)">
                <path
                  d="M 0 15 L 0 -15 M -12 -3 L 0 -15 L 12 -3"
                  stroke={accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            )}
            {cameraMovement === 'Dolly Zoom' && (
              <g transform="translate(300, 170)">
                <circle cx="0" cy="0" r="45" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="5 5" />
                <path d="M -30 -30 L -45 -45 M 30 -30 L 45 -45 M -30 30 L -45 45 M 30 30 L 45 45" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
            {cameraMovement === 'Tilt Down' && (
              <path
                d="M 300 80 L 300 130 M 290 115 L 300 130 L 310 115"
                stroke={secondary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
            {cameraMovement === 'Crane / Jib' && (
              <path
                d="M 120 220 L 180 150 M 160 150 L 180 150 L 180 170"
                stroke={secondary}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </g>
        )}

        {/* Cinematography Composition Guides Overlay (Toggleable or in inspector) */}
        {showGuides && (
          <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" strokeDasharray="4 4" pointerEvents="none">
            {compositionGuide === 'rule-of-thirds' && (
              <>
                <line x1="200" y1="0" x2="200" y2="340" />
                <line x1="400" y1="0" x2="400" y2="340" />
                <line x1="0" y1="113" x2="600" y2="113" />
                <line x1="0" y1="226" x2="600" y2="226" />
                {/* Intersection power points */}
                <circle cx="200" cy="113" r="4" fill="none" stroke={secondary} strokeWidth="1.5" />
                <circle cx="400" cy="113" r="4" fill="none" stroke={secondary} strokeWidth="1.5" />
                <circle cx="200" cy="226" r="4" fill="none" stroke={secondary} strokeWidth="1.5" />
                <circle cx="400" cy="226" r="4" fill="none" stroke={secondary} strokeWidth="1.5" />
              </>
            )}

            {compositionGuide === 'center-framed' && (
              <>
                <line x1="300" y1="0" x2="300" y2="340" stroke="rgba(255, 255, 255, 0.35)" />
                <line x1="0" y1="170" x2="600" y2="170" stroke="rgba(255, 255, 255, 0.35)" />
                <rect x="220" y="110" width="160" height="120" fill="none" stroke={secondary} strokeWidth="1" />
              </>
            )}

            {compositionGuide === 'diagonal-lead' && (
              <>
                <line x1="0" y1="340" x2="600" y2="0" stroke="rgba(255, 255, 255, 0.35)" />
                <line x1="0" y1="0" x2="600" y2="340" stroke="rgba(255, 255, 255, 0.2)" />
              </>
            )}

            {compositionGuide === 'symmetric' && (
              <>
                <line x1="300" y1="0" x2="300" y2="340" stroke={secondary} strokeWidth="1.5" />
                <rect x="100" y="40" width="400" height="260" fill="none" stroke="rgba(255,255,255,0.2)" />
              </>
            )}

            {compositionGuide === 'golden-spiral' && (
              <path
                d="M 600 340 A 340 340 0 0 0 260 0 A 210 210 0 0 0 50 210 A 130 130 0 0 0 180 340 A 80 80 0 0 0 260 260"
                fill="none"
                stroke={secondary}
                strokeWidth="1.5"
              />
            )}
          </g>
        )}
      </svg>

      {/* Film Safe Area Border Guidelines */}
      <div className="pointer-events-none absolute inset-2.5 rounded border border-white/10" />
    </div>
  );
};
