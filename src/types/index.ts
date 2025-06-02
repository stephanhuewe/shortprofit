export type Currency = 'USD' | 'EUR';

export interface AppSettings {
  currency: Currency;
  exchangeRate: number; // USD to EUR rate
  defaultTaxRate: number;
  defaultChannelFeePercentage: number;
  defaultCleaningFee: number;
}

export interface Booking {
  id: string;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  totalRevenue: number;
  channelName: string;
  channelFeePercentage: number;
  channelFee: number;
  cleaningFee: number;
  taxRate: number;
  taxAmount: number;
  otherCosts: number;
  otherCostsDescription: string;
  netProfit: number;
  notes: string;
  createdAt: Date;
}

export interface MonthlyStats {
  month: string;
  totalRevenue: number;
  totalChannelFees: number;
  totalCleaningFees: number;
  totalTaxes: number;
  totalOtherCosts: number;
  totalNetProfit: number;
  bookingCount: number;
  occupancyRate: number;
}

export interface PropertyStats {
  propertyName: string;
  totalRevenue: number;
  totalNetProfit: number;
  bookingCount: number;
}

export interface ChannelStats {
  channelName: string;
  totalRevenue: number;
  totalFees: number;
  bookingCount: number;
}
