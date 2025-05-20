import * as React from 'react';

interface DownloadIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const DownloadIcon: React.FC<DownloadIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Download-Bottom--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    {...props}
  >
    <desc>{'Download Bottom Streamline Icon: https://streamlinehq.com'}</desc>
    <path
      d="M23 18.218v1.913A2.87 2.87 0 0 1 20.131 23H3.869A2.869 2.869 0 0 1 1 20.131v-1.913"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="M12 18.108 12 1"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      d="m19 11.108 -7 7 -7 -7"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);
