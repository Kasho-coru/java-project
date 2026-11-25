import React from 'react';
import Card from './Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  color = 'navy',
  className = '',
}) => {
  const iconBgClasses = {
    navy: 'bg-[#25364A]/10 text-[#25364A] dark:bg-[#426B72]/30 dark:text-[#8DAEAA]',
    teal: 'bg-[#426B72]/15 text-[#426B72] dark:bg-[#426B72]/30 dark:text-[#8DAEAA]',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#77818A] dark:text-[#A2AFB5]">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#263238] dark:text-[#E7ECEB]">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-[#77818A] dark:text-[#A2AFB5]">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`p-2.5 rounded-lg shrink-0 ${iconBgClasses[color] || iconBgClasses.navy}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
