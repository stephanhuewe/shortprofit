import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useAppContext } from '../context/AppContext';
import { PropertyStats } from '../types';
import CurrencyDisplay from './CurrencyDisplay';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PropertyPerformanceProps {
  propertyStats: PropertyStats[];
}

const PropertyPerformance = ({ propertyStats }: PropertyPerformanceProps) => {
  const { settings } = useAppContext();
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });

  useEffect(() => {
    // Generate random colors for each property
    const backgroundColors = propertyStats.map(() => {
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);
      return `rgba(${r}, ${g}, ${b}, 0.7)`;
    });
    
    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
    
    setChartData({
      labels: propertyStats.map(stat => stat.propertyName),
      datasets: [
        {
          label: 'Revenue',
          data: propertyStats.map(stat => stat.totalRevenue),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    });
  }, [propertyStats]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Revenue by Property',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: settings.currency,
              }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Property Performance</h3>
        
        <div className="space-y-4">
          {propertyStats.map((property, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-900">{property.propertyName}</h4>
                <p className="text-sm text-gray-500">{property.bookingCount} bookings</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  <CurrencyDisplay amount={property.totalRevenue} />
                </div>
                <div className={`text-sm ${property.totalNetProfit >= 0 ? 'text-success-700' : 'text-danger-700'}`}>
                  Net: <CurrencyDisplay amount={property.totalNetProfit} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyPerformance;
