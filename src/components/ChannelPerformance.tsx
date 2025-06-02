import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useAppContext } from '../context/AppContext';
import { ChannelStats } from '../types';
import CurrencyDisplay from './CurrencyDisplay';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChannelPerformanceProps {
  channelStats: ChannelStats[];
}

const ChannelPerformance = ({ channelStats }: ChannelPerformanceProps) => {
  useAppContext();
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });

  useEffect(() => {
    // Generate random colors for each channel
    const backgroundColors = channelStats.map(() => {
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);
      return `rgba(${r}, ${g}, ${b}, 0.7)`;
    });
    
    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));
    
    setChartData({
      labels: channelStats.map(stat => stat.channelName),
      datasets: [
        {
          label: 'Bookings',
          data: channelStats.map(stat => stat.bookingCount),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    });
  }, [channelStats]);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Bookings by Channel',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-80">
        <Doughnut data={chartData} options={options} />
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Channel Performance</h3>
        
        <div className="space-y-4">
          {channelStats.map((channel, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-gray-900">{channel.channelName}</h4>
                <p className="text-sm text-gray-500">{channel.bookingCount} bookings</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  <CurrencyDisplay amount={channel.totalRevenue} />
                </div>
                <div className="text-sm text-danger-700">
                  Fees: <CurrencyDisplay amount={channel.totalFees} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelPerformance;
