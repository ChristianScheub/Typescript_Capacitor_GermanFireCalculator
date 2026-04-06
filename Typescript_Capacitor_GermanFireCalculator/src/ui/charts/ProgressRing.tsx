import './ProgressRing.css';

interface Props {
  percentage: number;
}

const R  = 82;
const CX = 100;
const CY = 100;
const SW = 13;

const START_X = CX - R;
const START_Y = CY;
// sweep=1 → clockwise in SVG screen-space → arc goes through the TOP (y < CY)
const BG_PATH = `M ${START_X},${START_Y} A ${R},${R} 0 0,1 ${CX + R},${START_Y}`;

export function ProgressRing({ percentage }: Props) {
  const pct   = Math.min(99.9, Math.max(0.1, percentage));
  // Parametrize along the top semicircle:
  // angle=π → left endpoint, angle=0 → right endpoint
  const angle = Math.PI - (pct / 100) * Math.PI;
  const px    = CX + R * Math.cos(angle);
  const py    = CY - R * Math.sin(angle);  // sin positive on 0..PI, so py stays above CY
  // Same sweep=1 so the progress follows the same clockwise top-arc as the track
  const progressPath = `M ${START_X},${START_Y} A ${R},${R} 0 0,1 ${px.toFixed(2)},${py.toFixed(2)}`;

  return (
    <svg viewBox="0 10 200 100" className="progress-ring">
      <path d={BG_PATH}       fill="none" strokeWidth={SW} strokeLinecap="round" className="ring-track" />
      {percentage > 0 && (
        <path d={progressPath} fill="none" strokeWidth={SW} strokeLinecap="round" className="ring-progress" />
      )}
      <text x={CX} y={CY - 4}  textAnchor="middle" fontSize="26" fontWeight="700" fontFamily="inherit" className="ring-value">
        {Math.round(percentage)}%
      </text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="8" letterSpacing="1.2" fontFamily="inherit" className="ring-sublabel">
        FORTSCHRITT
      </text>
    </svg>
  );
}
