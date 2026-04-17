import { IconPaths, ICON_SIZES, type IconName, type IconSize } from '../../types/ui/icons/iconPaths';

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
  fill?: string;
  stroke?: string;
}

export function Icon({
  name,
  size = 'sm',
  className,
  strokeWidth = 2,
  fill = 'none',
  stroke = 'currentColor',
}: Readonly<IconProps>) {
  const sizeValue = ICON_SIZES[size];
  const content = IconPaths[name];

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {content}
    </svg>
  );
}
