import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';
import BookingList from '../components/BookingList';

const Bookings = () => {
  const { bookings, deleteBooking } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredBookings = bookings.filter(booking => 
    booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.channelName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(id);
    }
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search bookings..."
              className="input pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <Link to="/bookings/add" className="btn btn-primary flex items-center justify-center">
            <FiPlus className="mr-2" />
            Add Booking
          </Link>
        </div>
      </div>
      
      <BookingList bookings={filteredBookings} onDelete={handleDelete} />
    </div>
  );
};

export default Bookings;
