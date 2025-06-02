import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import BookingForm from '../components/BookingForm';
import { Booking } from '../types';
import { useEffect, useState } from 'react';

const EditBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBooking, updateBooking } = useAppContext();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const bookingData = getBooking(id);
      if (bookingData) {
        setBooking(bookingData);
      } else {
        navigate('/bookings', { replace: true });
      }
    }
    setLoading(false);
  }, [id, getBooking, navigate]);
  
  const handleSubmit = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    if (id) {
      updateBooking(id, bookingData);
      navigate('/bookings');
    }
  };
  
  if (loading) {
    return (
      <div className="py-6">
        <div className="text-center">
          <p className="text-gray-600">Loading booking data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Booking</h1>
        <p className="text-gray-600 mt-1">Update the details of your booking below.</p>
      </div>
      
      {booking && (
        <BookingForm booking={booking} onSubmit={handleSubmit} isEditing />
      )}
    </div>
  );
};

export default EditBooking;
