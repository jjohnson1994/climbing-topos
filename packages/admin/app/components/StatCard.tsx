type Color = 'blue' | 'green' | 'purple' | 'orange' | 'red';

const colorMap: Record<Color, { bg: string; color: string }> = {
  blue: { bg: '#eef6ff', color: '#1d6fa4' },
  green: { bg: '#ebf9f3', color: '#257953' },
  purple: { bg: '#f3eeff', color: '#6941c6' },
  orange: { bg: '#fffbeb', color: '#946c00' },
  red: { bg: '#fff0f0', color: '#c0392b' },
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color?: Color;
}

export default function StatCard({
  title,
  value,
  icon,
  color = 'blue',
}: StatCardProps) {
  const { bg, color: iconColor } = colorMap[color];

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg, color: iconColor }}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value.toLocaleString()}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}
