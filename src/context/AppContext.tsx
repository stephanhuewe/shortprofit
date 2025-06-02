import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppSettings, Booking, Currency } from '../types';
import { toast } from 'react-toastify';

interface AppContextType {
  bookings: Booking[];
  settings: AppSettings;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBooking: (id: string, booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  deleteBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  convertCurrency: (amount: number, targetCurrency: Currency) => number;
}

const defaultSettings: AppSettings = {
  currency: 'USD',
  exchangeRate: 0.92, // 1 USD = 0.92 EUR (example rate)
  defaultTaxRate: 10,
  defaultChannelFeePercentage: 3,
  defaultCleaningFee: 50,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      try {
        // Convert string dates back to Date objects
        return JSON.parse(savedBookings, (key, value) => {
          if (key === 'checkIn' || key === 'checkOut' || key === 'createdAt') {
            return new Date(value);
          }
          return value;
        });
      } catch (error) {
        console.error('Error parsing bookings from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing settings from localStorage:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    setBookings([...bookings, newBooking]);
    toast.success('Booking added successfully!');
  };

  const updateBooking = (id: string, bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const existingBooking = bookings.find(booking => booking.id === id);
    
    if (!existingBooking) {
      toast.error('Booking not found!');
      return;
    }
    
    const updatedBooking: Booking = {
      ...bookingData,
      id,
      createdAt: existingBooking.createdAt,
    };
    
    setBookings(bookings.map(booking => 
      booking.id === id ? updatedBooking : booking
    ));
    
    toast.success('Booking updated successfully!');
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    toast.success('Booking deleted successfully!');
  };

  const getBooking = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
    toast.success('Settings updated successfully!');
  };

  const convertCurrency = (amount: number, targetCurrency: Currency) => {
    if (settings.currency === targetCurrency) {
      return amount;
    }
    
    if (targetCurrency === 'EUR') {
      return amount * settings.exchangeRate;
    } else {
      return amount / settings.exchangeRate;
    }
  };

  return (
    <AppContext.Provider value={{
      bookings,
      settings,
      addBooking,
      updateBooking,
      deleteBooking,
      getBooking,
      updateSettings,
      convertCurrency,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
