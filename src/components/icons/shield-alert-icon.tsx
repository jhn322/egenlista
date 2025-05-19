import * as React from 'react';

interface ShieldAlertIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
  iconSize?: number;
}

export const ShieldAlertIcon: React.FC<ShieldAlertIconProps> = ({
  color = 'black',
  iconSize = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="Shield-Warning--Streamline-Ultimate"
    height={iconSize}
    width={iconSize}
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <desc>{'Shield Warning Streamline Icon: https://streamlinehq.com'}</desc>
    <path d="M12 13.5v-7" />
    <path d="M12.0002 15.9999c-0.1381 0 -0.25 -0.1119 -0.25 -0.25 0 -0.138 0.1119 -0.25 0.25 -0.25" />
    <path d="M12.0002 15.9999c0.138 0 0.25 -0.1119 0.25 -0.25 0 -0.138 -0.112 -0.25 -0.25 -0.25" />
    <path d="M1.5 3.775v7.637c0.02938 2.5235 0.83358 4.977 2.30368 7.0282 1.47011 2.0512 3.5351 3.6011 5.91532 4.4398l1.121 0.414c0.7489 0.275 1.5711 0.275 2.32 0l1.121 -0.414c2.3802 -0.8387 4.4452 -2.3886 5.9153 -4.4398 1.4701 -2.0512 2.2743 -4.5047 2.3037 -7.0282V3.775c-0.001 -0.30005 -0.09 -0.5932 -0.2561 -0.84313 -0.166 -0.24993 -0.4017 -0.44564 -0.6779 -0.56287C18.5368 1.10465 15.2823 0.468795 12 0.499996 8.71767 0.468795 5.46321 1.10465 2.434 2.369c-0.27619 0.11723 -0.51191 0.31294 -0.67794 0.56287 -0.16602 0.24993 -0.25506 0.54308 -0.25606 0.84313v0Z" />
  </svg>
);
