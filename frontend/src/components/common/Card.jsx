import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#243541] border border-[#E5E8E5] dark:border-[#354651] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E8E5] dark:border-[#354651]">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-[#263238] dark:text-[#E7ECEB]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#77818A] dark:text-[#A2AFB5] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};

export default Card;
