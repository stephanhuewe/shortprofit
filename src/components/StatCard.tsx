import { ReactNode } from 'react';
import CurrencyDisplay from './CurrencyDisplay';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const StatCard = ({ title, value, icon, isCurrency = false, trend, color = 'primary' }: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">
                {isCurrency ? <CurrencyDisplay amount={value} /> : value}
              </div>
            </dd>
          </dl>
        </div>
      </div>
      
      {trend && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-success-700' : 'text-danger-700'}`}>
            <span>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="ml-2 text-gray-500">from previous period</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
