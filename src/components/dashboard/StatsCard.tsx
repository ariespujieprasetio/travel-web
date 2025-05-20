import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  change: number;
  changeTimeframe?: string;
  bgColor: string;
  textColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeTimeframe = 'month',
  bgColor,
  textColor
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-gray-500 text-sm">{title}</h2>
          <p className="text-2xl font-semibold text-gray-800">{value.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-green-500">
        <span className="font-medium">+{change}%</span> from last {changeTimeframe}
      </div>
    </div>
  );
};

export default StatsCard;