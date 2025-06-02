import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiHome, FiCalendar, FiPercent } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/StatCard';
import MonthlyChart from '../components/MonthlyChart';
import PropertyPerformance from '../components/PropertyPerformance';
import ChannelPerformance from '../components/ChannelPerformance';
import { MonthlyStats, PropertyStats, ChannelStats } from '../types';
import { calculateMonthlyStats, calculatePropertyStats, calculateChannelStats } from '../utils/statsCalculator';

const Dashboard = () => {
  const { bookings } = useAppContext();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [propertyStats, setPropertyStats] = useState<PropertyStats[]>([]);
  const [channelStats, setChannelStats] = useState<ChannelStats[]>([]);
  
  useEffect(() => {
    if (bookings.length > 0) {
      setMonthlyStats(calculateMonthlyStats(bookings));
      setPropertyStats(calculatePropertyStats(bookings));
      setChannelStats(calculateChannelStats(bookings));
    } else {
      setMonthlyStats([]);
      setPropertyStats([]);
      setChannelStats([]);
    }
  }, [bookings]);
  
  // Calculate summary stats
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalRevenue, 0);
  const totalProfit = bookings.reduce((sum, booking) => sum + booking.netProfit, 0);
  const totalBookings = bookings.length;
  const averageOccupancy = monthlyStats.length > 0
    ? Math.round(monthlyStats.reduce((sum, stat) => sum + stat.occupancyRate, 0) / monthlyStats.length)
    : 0;
  
  if (bookings.length === 0) {
    return (
      <div className="py-6">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome to Rental Profitability Calculator</h2>
          <p className="mt-2 text-gray-600">Track and analyze the profitability of your short-term rentals.</p>
          <p className="mt-1 text-gray-500">Get started by adding your first booking.</p>
          <div className="mt-6">
            <Link to="/bookings/add" className="btn btn-primary">
              Add Your First Booking
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/bookings/add" className="btn btn-primary">
          Add Booking
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          icon={<FiDollarSign className="h-6 w-6" />}
          isCurrency
          color="primary"
        />
        
        <StatCard
          title="Net Profit"
          value={totalProfit}
          icon={<FiDollarSign className="h-6 w-6" />}
          isCurrency
          color={totalProfit >= 0 ? 'success' : 'danger'}
        />
        
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={<FiCalendar className="h-6 w-6" />}
          color="warning"
        />
        
        <StatCard
          title="Average Occupancy"
          value={averageOccupancy}
          icon={<FiPercent className="h-6 w-6" />}
          color="primary"
        />
      </div>
      
      <div className="mb-8">
        <MonthlyChart monthlyStats={monthlyStats} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PropertyPerformance propertyStats={propertyStats} />
        <ChannelPerformance channelStats={channelStats} />
      </div>
    </div>
  );
};

export default Dashboard;
