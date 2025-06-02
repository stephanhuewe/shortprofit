import { Booking, MonthlyStats, PropertyStats, ChannelStats } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

export const calculateMonthlyStats = (bookings: Booking[]): MonthlyStats[] => {
  const monthlyData: { [key: string]: MonthlyStats } = {};
  
  // Initialize with empty data for the last 6 months
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMM yyyy');
    
    monthlyData[monthKey] = {
      month: monthLabel,
      totalRevenue: 0,
      totalChannelFees: 0,
      totalCleaningFees: 0,
      totalTaxes: 0,
      totalOtherCosts: 0,
      totalNetProfit: 0,
      bookingCount: 0,
      occupancyRate: 0,
    };
  }
  
  // Calculate stats for each booking
  bookings.forEach(booking => {
    const checkInMonth = format(booking.checkIn, 'yyyy-MM');
    
    // Only include bookings from the last 6 months
    if (monthlyData[checkInMonth]) {
      monthlyData[checkInMonth].totalRevenue += booking.totalRevenue;
      monthlyData[checkInMonth].totalChannelFees += booking.channelFee;
      monthlyData[checkInMonth].totalCleaningFees += booking.cleaningFee;
      monthlyData[checkInMonth].totalTaxes += booking.taxAmount;
      monthlyData[checkInMonth].totalOtherCosts += booking.otherCosts;
      monthlyData[checkInMonth].totalNetProfit += booking.netProfit;
      monthlyData[checkInMonth].bookingCount += 1;
    }
  });
  
  // Calculate occupancy rates (simplified)
  Object.keys(monthlyData).forEach(monthKey => {
    const date = parseISO(`${monthKey}-01`);
    const firstDay = startOfMonth(date);
    const lastDay = endOfMonth(date);
    const daysInMonth = differenceInDays(lastDay, firstDay) + 1;
    
    // Assuming each booking is for a different property
    // In a real app, you'd need to track occupancy per property
    const occupiedDays = monthlyData[monthKey].bookingCount;
    monthlyData[monthKey].occupancyRate = Math.min(100, Math.round((occupiedDays / daysInMonth) * 100));
  });
  
  // Convert to array and sort by date
  return Object.values(monthlyData).reverse();
};

export const calculatePropertyStats = (bookings: Booking[]): PropertyStats[] => {
  const propertyData: { [key: string]: PropertyStats } = {};
  
  bookings.forEach(booking => {
    if (!propertyData[booking.propertyName]) {
      propertyData[booking.propertyName] = {
        propertyName: booking.propertyName,
        totalRevenue: 0,
        totalNetProfit: 0,
        bookingCount: 0,
      };
    }
    
    propertyData[booking.propertyName].totalRevenue += booking.totalRevenue;
    propertyData[booking.propertyName].totalNetProfit += booking.netProfit;
    propertyData[booking.propertyName].bookingCount += 1;
  });
  
  // Convert to array and sort by revenue
  return Object.values(propertyData).sort((a, b) => b.totalRevenue - a.totalRevenue);
};

export const calculateChannelStats = (bookings: Booking[]): ChannelStats[] => {
  const channelData: { [key: string]: ChannelStats } = {};
  
  bookings.forEach(booking => {
    if (!channelData[booking.channelName]) {
      channelData[booking.channelName] = {
        channelName: booking.channelName,
        totalRevenue: 0,
        totalFees: 0,
        bookingCount: 0,
      };
    }
    
    channelData[booking.channelName].totalRevenue += booking.totalRevenue;
    channelData[booking.channelName].totalFees += booking.channelFee;
    channelData[booking.channelName].bookingCount += 1;
  });
  
  // Convert to array and sort by booking count
  return Object.values(channelData).sort((a, b) => b.bookingCount - a.bookingCount);
};
