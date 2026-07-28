import { HTMLAttributes } from 'react';

interface StatusZoneProps extends HTMLAttributes<HTMLDivElement> {
  zone: 'green' | 'yellow' | 'red';
  title: string;
  description: string;
}

export const StatusZone = ({ zone, title, description, className = '', ...props }: StatusZoneProps) => {
  const zoneStyles = {
    green: 'bg-zone-green-bg border-zone-green',
    yellow: 'bg-zone-yellow-bg border-zone-yellow',
    red: 'bg-zone-red-bg border-zone-red',
  };

  const iconStyles = {
    green: '🟢',
    yellow: '🟡',
    red: '🔴',
  };

  return (
    <div
      className={`p-6 rounded-2xl border-2 ${zoneStyles[zone]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{iconStyles[zone]}</span>
        <div>
          <h3 className="text-xl font-bold text-text-main mb-1">{title}</h3>
          <p className="text-base text-text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
};
