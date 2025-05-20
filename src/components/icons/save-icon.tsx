import * as React from 'react';

interface SaveIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const SaveIcon: React.FC<SaveIconProps> = ({
  color = 'currentColor',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Save-Floppy-Disk--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Save Floppy Disk Streamline Icon: https://streamlinehq.com'}</desc>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 3v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3" />
    <path d="M12 17v-4" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);
