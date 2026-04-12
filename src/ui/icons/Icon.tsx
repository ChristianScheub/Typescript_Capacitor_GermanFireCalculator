import { IconPaths, ICON_SIZES, type IconName, type IconSize } from '../../types/ui/icons/iconPaths';

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 'sm',
  className,
  strokeWidth = 2,
}: IconProps) {
  const sizeValue = ICON_SIZES[size];
  const path = IconPaths[name];

  if (!path) {
    console.warn(`Icon "${name}" not found in icon library`);
    return null;
  }

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}
