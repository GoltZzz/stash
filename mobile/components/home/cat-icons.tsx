import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

// Sleek, premium Yarn Ball Icon
export function YarnIcon({ size = 24, color = '#ea580c' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer bounding yarn ball */}
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.75" />
      {/* Symmetrical wraps */}
      <Path
        d="M12 2C8.5 6 8.5 18 12 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M12 2C15.5 6 15.5 18 12 22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M2 12C6 8.5 18 8.5 22 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M2 12C6 15.5 18 15.5 22 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M4.5 4.5C8 8 16 16 19.5 19.5"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <Path
        d="M4.5 19.5C8 16 16 8 19.5 4.5"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </Svg>
  );
}


// Sleek, premium Paw Print Icon
export function PawIcon({ size = 24, color = '#ea580c' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main pad */}
      <Path
        d="M7.5 15.5C7.5 13.5 9.5 12 12 12C14.5 12 16.5 13.5 16.5 15.5C16.5 18 14.5 19.5 12 19.5C9.5 19.5 7.5 18 7.5 15.5Z"
        fill={color}
      />
      {/* Toes (4 dots at the top) */}
      <Circle cx="6.5" cy="9.5" r="2.2" fill={color} />
      <Circle cx="10" cy="7.5" r="2.3" fill={color} />
      <Circle cx="14" cy="7.5" r="2.3" fill={color} />
      <Circle cx="17.5" cy="9.5" r="2.2" fill={color} />
    </Svg>
  );
}

// Plus icon for action
export function PlusIcon({ size = 20, color = '#291c12' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Trend icon for Review spending
export function TrendIcon({ size = 20, color = '#291c12' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 20H21M3 16L9 10L14 14L21 6M21 6H16.5M21 6V10.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Treat jar icon for budget quick actions
export function TreatJarIcon({ size = 24, color = '#ea580c' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 4H17C17.55 4 18 4.45 18 5V6H6V5C6 4.45 6.45 4 7 4Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Path
        d="M6 6H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V6Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <Path
        d="M9 10H15"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity={0.5}
      />
      <Circle cx="10" cy="15" r="1.2" fill={color} opacity={0.7} />
      <Circle cx="14" cy="16.5" r="1" fill={color} opacity={0.55} />
      <Circle cx="12" cy="13.5" r="0.9" fill={color} opacity={0.65} />
    </Svg>
  );
}

// Adjust/Settings dial icon
export function AdjustIcon({ size = 20, color = '#291c12' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left dial slider */}
      <Path d="M4 14H10M14 14H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="14" r="2.5" stroke={color} strokeWidth="2" />
      
      {/* Right dial slider */}
      <Path d="M4 7H6M10 7H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="8" cy="7" r="2.5" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// Star icon for XP badges
export function StarIcon({ size = 20, color = '#ea580c' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Check Circle icon for completed quests
export function CheckCircleIcon({ size = 20, color = '#22c55e' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path
        d="M8.5 12.5L10.5 14.5L15.5 9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Flame icon for streaks/weekly
export function FlameIcon({ size = 20, color = '#f97316' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.5 10.5C17.5 7.5 15.5 5.5 14 3.5C14 3.5 13 5.5 12.5 6.5C12 7.5 11 8 9.5 9.5C8 11 7 13 7 15.5C7 18.5 9.24 21 12 21C14.76 21 17 18.5 17 15.5C17 14.5 16.5 13.5 16 12.5C16.83 12.5 17.5 11.67 17.5 10.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

