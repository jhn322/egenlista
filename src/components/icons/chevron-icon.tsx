import * as React from 'react';

interface ChevronIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ChevronIcon: React.FC<ChevronIconProps> = ({ 
  color = 'black', 
  iconSize = 24,
  ...props 
}) => (
  <svg 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    id="Arrow-Down-1--Streamline-Ultimate" 
    height={iconSize} 
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Arrow Down 1 Streamline Icon: https://streamlinehq.com"}</desc>
    <path d="M0.541 5.627 11.666 18.2a0.5 0.5 0 0 0 0.749 0L23.541 5.627" />
  </svg>
); 