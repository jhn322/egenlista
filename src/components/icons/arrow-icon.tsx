import * as React from 'react';

interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    id="Direction-Right--Streamline-Ultimate" 
    height={iconSize} 
    width={iconSize}
    stroke={color}
    strokeWidth={1.5} 
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Direction Right Streamline Icon: https://streamlinehq.com"}</desc>
    <title>{"direction-right"}</title>
    <path d="m0.5 12 23 0" />
    <path d="M16.75 5.5 23.5 12l-6.75 6.5" />
  </svg>
); 