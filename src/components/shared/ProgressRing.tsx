import type { CSSProperties, FC } from 'react';

interface ProgressRingProps {
  value: number;
  label: string;
  size?: number;
}

const clampProgress = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
};

export const ProgressRing: FC<ProgressRingProps> = ({ value, label, size = 112 }) => {
  const progress = clampProgress(value);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);
  const style = { '--progress-ring-size': `${size}px` } as CSSProperties;

  return (
    <div
      className="progress-ring"
      style={style}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <svg className="progress-ring__graphic" viewBox="0 0 100 100" aria-hidden="true">
        <circle className="progress-ring__track" cx="50" cy="50" r={radius} />
        <circle
          className="progress-ring__value"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="progress-ring__label">{progress}%</span>
    </div>
  );
};
