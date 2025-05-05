import * as React from 'react';

interface MailIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const MailIcon: React.FC<MailIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    id="Email-Action-Send-2--Streamline-Ultimate"
    height={iconSize} 
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Email Action Send 2 Streamline Icon: https://streamlinehq.com"}</desc>
    <path d="M12.5 14.5H2A1.5 1.5 0 0 1 0.5 13V2A1.5 1.5 0 0 1 2 0.5h18A1.5 1.5 0 0 1 21.5 2v9.5" />
    <path d="M21.068 0.946 11 9 0.933 0.946" />
    <path d="M13.5 18.5a5 5 0 1 0 10 0 5 5 0 1 0 -10 0Z" />
    <path d="m20.5 18.5 -4 0" />
    <path d="m18.5 16.5 2 2 -2 2" />
  </svg>
); 