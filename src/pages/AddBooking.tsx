import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import BookingForm from '../components/BookingForm';
import { Booking } from '../types';

const AddBooking = () => {
  const navigate = useNavigate();
  const { addBooking } = useAppContext();
  
  const handleSubmit = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    addBooking(bookingData);
    navigate('/bookings');
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Booking</h1>
        <p className="text-gray-600 mt-1">Enter the details of your new booking below.</p>
      </div>
      
      <BookingForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddBooking;
