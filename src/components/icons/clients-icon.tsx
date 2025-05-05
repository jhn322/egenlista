import * as React from 'react';

interface ClientsIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ClientsIcon: React.FC<ClientsIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    id="Multiple-Neutral-1--Streamline-Ultimate"
    height={iconSize} 
    width={iconSize}
    stroke={color}
    strokeWidth={1.5} 
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Multiple Neutral 1 Streamline Icon: https://streamlinehq.com"}</desc>
    <g>
      <path d="M3.25 7.75a4.25 4.25 0 1 0 8.5 0 4.25 4.25 0 1 0 -8.5 0" />
      <path d="M0.5 20.5a7 7 0 0 1 14 0Z" />
      <g>
        <path d="M13.26 5a4.25 4.25 0 1 1 0.24 5.76" />
        <path d="M14.5 13.79a6.91 6.91 0 0 1 2 -0.29 7 7 0 0 1 7 7H17" />
      </g>
    </g>
  </svg>
); 