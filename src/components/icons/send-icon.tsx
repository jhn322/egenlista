import * as React from 'react';

interface SendIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const SendIcon: React.FC<SendIconProps> = ({
  color = 'currentColor', // Default to currentColor to inherit text color
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    id="Send-Email-3--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5} // Increased strokeWidth for better visibility like FAQIcon
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Send Email 3 Streamline Icon: https://streamlinehq.com'}</desc>
    <title>{'send-email-3'}</title>
    <path d="M23.5 0.5 9 15" />
    <path d="M13.5 23.5 9 15 0.5 10.5l23 -10 -10 23z" />
  </svg>
);
