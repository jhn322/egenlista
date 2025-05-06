import * as React from 'react';

interface ServiceCompanyIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ServiceCompanyIcon: React.FC<ServiceCompanyIconProps> = ({
  color = '#004794',
  iconSize = 24,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Desktop-Computer-2--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>
      {'Desktop Computer 2 Streamline Icon: https://streamlinehq.com'}
    </desc>
    <path d="M8.5 0.5h7c0.2652 0 0.5196 0.105357 0.7071 0.292893 0.1875 0.187537 0.2929 0.441887 0.2929 0.707107v19h-9v-19c0 -0.26522 0.10536 -0.51957 0.29289 -0.707107C7.98043 0.605357 8.23478 0.5 8.5 0.5v0Z" />
    <path d="M10.5 0.5v20" />
    <path d="M10.5 3.5h6" />
    <path d="M10.5 6.5h6" />
    <path d="M10.5 9.5h6" />
    <path d="M19 22.5c0 0.2652 -0.1054 0.5196 -0.2929 0.7071S18.2652 23.5 18 23.5H6c-0.26522 0 -0.51957 -0.1054 -0.70711 -0.2929C5.10536 23.0196 5 22.7652 5 22.5c0 -0.5304 0.21071 -1.0391 0.58579 -1.4142C5.96086 20.7107 6.46957 20.5 7 20.5h10c0.5304 0 1.0391 0.2107 1.4142 0.5858S19 21.9696 19 22.5Z" />
    <path d="M13.5 16.75c-0.1381 0 -0.25 -0.1119 -0.25 -0.25s0.1119 -0.25 0.25 -0.25" />
    <path d="M13.5 16.75c0.1381 0 0.25 -0.1119 0.25 -0.25s-0.1119 -0.25 -0.25 -0.25" />
  </svg>
);
