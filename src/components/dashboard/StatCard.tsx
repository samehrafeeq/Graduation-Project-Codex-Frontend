import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color?: 'primary' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'teal' | 'amber';
  className?: string;
}

const colorMap = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    value: 'text-primary',
    ring: 'ring-primary/20',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    value: 'text-emerald-600',
    ring: 'ring-emerald-500/20',
  },
  yellow: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    value: 'text-amber-600',
    ring: 'ring-amber-500/20',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    value: 'text-red-600',
    ring: 'ring-red-500/20',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    value: 'text-blue-600',
    ring: 'ring-blue-500/20',
  },
  purple: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
    value: 'text-violet-600',
    ring: 'ring-violet-500/20',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
    value: 'text-teal-600',
    ring: 'ring-teal-500/20',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    value: 'text-amber-600',
    ring: 'ring-amber-500/20',
  },
};

const StatCard = ({ label, value, icon: Icon, trend, color = 'primary', className = '' }: StatCardProps) => {
  const c = colorMap[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ${c.ring} transition-all hover:shadow-lg hover:shadow-black/5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`text-3xl font-bold tracking-tight ${c.value}`}>{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`rounded-xl ${c.bg} p-3`}>
          <Icon size={22} className={c.icon} />
        </div>
      </div>
      {/* Subtle decorative gradient */}
      <div className={`absolute -bottom-8 -left-8 h-24 w-24 rounded-full ${c.bg} opacity-50 blur-2xl`} />
    </div>
  );
};

export default StatCard;
