import * as React from 'react';

interface FAQIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const FAQIcon: React.FC<FAQIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    id="Question-Circle--Streamline-Ultimate" 
    height={iconSize} 
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{"Question Circle Streamline Icon: https://streamlinehq.com"}</desc>
    <path d="M12 23.001c6.0751 0 11 -4.9249 11 -11 0 -6.07516 -4.9249 -11.00002 -11 -11.00002 -6.07513 0 -11 4.92486 -11 11.00002 0 6.0751 4.92487 11 11 11Z" />
    <path d="M9 10.005c0.00008 -0.54081 0.14637 -1.07158 0.4234 -1.5361 0.27702 -0.46452 0.6745 -0.84551 1.1503 -1.10265 0.4758 -0.25714 1.0123 -0.38087 1.5526 -0.35809 0.5404 0.02277 1.0646 0.19121 1.5171 0.48748 0.4524 0.29627 0.8164 0.70935 1.0534 1.19554 0.2369 0.48618 0.338 1.02737 0.2926 1.56632 -0.0454 0.5389 -0.2357 1.0556 -0.5507 1.4952 -0.315 0.4397 -0.743 0.786 -1.2387 1.0023 -0.3567 0.1557 -0.6602 0.412 -0.8733 0.7376 -0.2132 0.3256 -0.3267 0.7063 -0.3267 1.0954V15" />
    <path d="M12.0036 17.5c-0.1381 0 -0.25 -0.1119 -0.25 -0.25s0.1119 -0.25 0.25 -0.25" />
    <path d="M12.0036 17.5c0.1381 0 0.25 -0.1119 0.25 -0.25s-0.1119 -0.25 -0.25 -0.25" />
  </svg>
); 