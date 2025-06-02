import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Booking } from '../types';
import { useAppContext } from '../context/AppContext';
import CurrencyDisplay from './CurrencyDisplay';
import { differenceInDays } from 'date-fns';

interface BookingFormProps {
  booking?: Booking;
  onSubmit: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => void;
  isEditing?: boolean;
}

const BookingForm = ({ booking, onSubmit, isEditing = false }: BookingFormProps) => {
  const navigate = useNavigate();
  const { settings } = useAppContext();
  
  const [formData, setFormData] = useState<Omit<Booking, 'id' | 'createdAt'>>({
    propertyName: '',
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    guestName: '',
    totalRevenue: 0,
    channelName: '',
    channelFeePercentage: settings.defaultChannelFeePercentage,
    channelFee: 0,
    cleaningFee: settings.defaultCleaningFee,
    taxRate: settings.defaultTaxRate,
    taxAmount: 0,
    otherCosts: 0,
    otherCostsDescription: '',
    netProfit: 0,
    notes: '',
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        propertyName: booking.propertyName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guestName: booking.guestName,
        totalRevenue: booking.totalRevenue,
        channelName: booking.channelName,
        channelFeePercentage: booking.channelFeePercentage,
        channelFee: booking.channelFee,
        cleaningFee: booking.cleaningFee,
        taxRate: booking.taxRate,
        taxAmount: booking.taxAmount,
        otherCosts: booking.otherCosts,
        otherCostsDescription: booking.otherCostsDescription,
        netProfit: booking.netProfit,
        notes: booking.notes,
      });
    }
  }, [booking]);

  const calculateFees = (data: typeof formData) => {
    const channelFee = (data.totalRevenue * data.channelFeePercentage) / 100;
    const taxAmount = (data.totalRevenue * data.taxRate) / 100;
    const netProfit = data.totalRevenue - channelFee - data.cleaningFee - taxAmount - data.otherCosts;
    
    return {
      ...data,
      channelFee,
      taxAmount,
      netProfit,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newValue: string | number = value;
    if (name === 'totalRevenue' || name === 'channelFeePercentage' || name === 'cleaningFee' || name === 'taxRate' || name === 'otherCosts') {
      newValue = parseFloat(value) || 0;
    }
    
    const updatedData = {
      ...formData,
      [name]: newValue,
    };
    
    setFormData(calculateFees(updatedData));
  };

  const handleDateChange = (field: 'checkIn' | 'checkOut', date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const stayDuration = differenceInDays(formData.checkOut, formData.checkIn);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="propertyName" className="label">Property Name</label>
            <input
              type="text"
              id="propertyName"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="guestName" className="label">Guest Name</label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="checkIn" className="label">Check-in Date</label>
            <DatePicker
              id="checkIn"
              selected={formData.checkIn}
              onChange={(date) => handleDateChange('checkIn', date)}
              selectsStart
              startDate={formData.checkIn}
              endDate={formData.checkOut}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="checkOut" className="label">Check-out Date</label>
            <DatePicker
              id="checkOut"
              selected={formData.checkOut}
              onChange={(date) => handleDateChange('checkOut', date)}
              selectsEnd
              startDate={formData.checkIn}
              endDate={formData.checkOut}
              minDate={formData.checkIn}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="channelName" className="label">Booking Channel</label>
            <input
              type="text"
              id="channelName"
              name="channelName"
              value={formData.channelName}
              onChange={handleInputChange}
              className="input"
              placeholder="Airbnb, Booking.com, etc."
              required
            />
          </div>
          
          <div>
            <label htmlFor="totalRevenue" className="label">Total Revenue</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{settings.currency}</span>
              </div>
              <input
                type="number"
                id="totalRevenue"
                name="totalRevenue"
                value={formData.totalRevenue}
                onChange={handleInputChange}
                className="input pl-10"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Costs & Fees</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="channelFeePercentage" className="label">Channel Fee (%)</label>
            <input
              type="number"
              id="channelFeePercentage"
              name="channelFeePercentage"
              value={formData.channelFeePercentage}
              onChange={handleInputChange}
              className="input"
              min="0"
              step="0.1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="channelFee" className="label">Channel Fee Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{settings.currency}</span>
              </div>
              <input
                type="number"
                id="channelFee"
                name="channelFee"
                value={formData.channelFee.toFixed(2)}
                className="input pl-10"
                disabled
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="cleaningFee" className="label">Cleaning Fee</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{settings.currency}</span>
              </div>
              <input
                type="number"
                id="cleaningFee"
                name="cleaningFee"
                value={formData.cleaningFee}
                onChange={handleInputChange}
                className="input pl-10"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="taxRate" className="label">Tax Rate (%)</label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleInputChange}
              className="input"
              min="0"
              step="0.1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="taxAmount" className="label">Tax Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{settings.currency}</span>
              </div>
              <input
                type="number"
                id="taxAmount"
                name="taxAmount"
                value={formData.taxAmount.toFixed(2)}
                className="input pl-10"
                disabled
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="otherCosts" className="label">Other Costs</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{settings.currency}</span>
              </div>
              <input
                type="number"
                id="otherCosts"
                name="otherCosts"
                value={formData.otherCosts}
                onChange={handleInputChange}
                className="input pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="otherCostsDescription" className="label">Other Costs Description</label>
            <input
              type="text"
              id="otherCostsDescription"
              name="otherCostsDescription"
              value={formData.otherCostsDescription}
              onChange={handleInputChange}
              className="input"
              placeholder="Maintenance, supplies, etc."
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="label">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="input h-24"
              placeholder="Any additional notes about this booking..."
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Stay Duration:</span>
            <span className="font-medium">{stayDuration} {stayDuration === 1 ? 'night' : 'nights'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Total Revenue:</span>
            <span className="font-medium"><CurrencyDisplay amount={formData.totalRevenue} /></span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Channel Fee:</span>
            <span className="font-medium text-danger-500">-<CurrencyDisplay amount={formData.channelFee} /></span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Cleaning Fee:</span>
            <span className="font-medium text-danger-500">-<CurrencyDisplay amount={formData.cleaningFee} /></span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium text-danger-500">-<CurrencyDisplay amount={formData.taxAmount} /></span>
          </div>
          
          {formData.otherCosts > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Other Costs:</span>
              <span className="font-medium text-danger-500">-<CurrencyDisplay amount={formData.otherCosts} /></span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-gray-800 font-semibold">Net Profit:</span>
              <span className={`font-bold text-lg ${formData.netProfit >= 0 ? 'text-success-700' : 'text-danger-700'}`}>
                <CurrencyDisplay amount={formData.netProfit} />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className="btn btn-primary"
        >
          {isEditing ? 'Update Booking' : 'Add Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
