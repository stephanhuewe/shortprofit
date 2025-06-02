import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { Booking } from '../types';
import CurrencyDisplay from './CurrencyDisplay';
import { format } from 'date-fns';

interface BookingListProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
}

const BookingList = ({ bookings, onDelete }: BookingListProps) => {
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedBookingId(expandedBookingId === id ? null : id);
  };
  
  if (bookings.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="mt-1 text-gray-500">Get started by adding your first booking.</p>
        <div className="mt-6">
          <Link to="/bookings/add" className="btn btn-primary">
            Add Booking
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Guest</th>
              <th>Dates</th>
              <th>Channel</th>
              <th>Revenue</th>
              <th>Net Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <>
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="font-medium text-gray-900">{booking.propertyName}</td>
                  <td>{booking.guestName}</td>
                  <td>
                    <div className="text-xs">
                      <div>{format(booking.checkIn, 'MMM d, yyyy')}</div>
                      <div className="text-gray-400">to</div>
                      <div>{format(booking.checkOut, 'MMM d, yyyy')}</div>
                    </div>
                  </td>
                  <td>{booking.channelName}</td>
                  <td className="font-medium">
                    <CurrencyDisplay amount={booking.totalRevenue} />
                  </td>
                  <td className={`font-medium ${booking.netProfit >= 0 ? 'text-success-700' : 'text-danger-700'}`}>
                    <CurrencyDisplay amount={booking.netProfit} />
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleExpand(booking.id)}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                        title="View details"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <Link
                        to={`/bookings/${booking.id}/edit`}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                        title="Edit booking"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => onDelete(booking.id)}
                        className="p-1 text-gray-500 hover:text-danger-600 rounded-full hover:bg-gray-100"
                        title="Delete booking"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedBookingId === booking.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Costs Breakdown</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Channel Fee:</span>
                              <span><CurrencyDisplay amount={booking.channelFee} /></span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cleaning Fee:</span>
                              <span><CurrencyDisplay amount={booking.cleaningFee} /></span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax:</span>
                              <span><CurrencyDisplay amount={booking.taxAmount} /></span>
                            </div>
                            {booking.otherCosts > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Other Costs:</span>
                                <span><CurrencyDisplay amount={booking.otherCosts} /></span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">Rates</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Channel Fee Rate:</span>
                              <span>{booking.channelFeePercentage}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax Rate:</span>
                              <span>{booking.taxRate}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">Additional Info</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            {booking.otherCostsDescription && (
                              <div>
                                <span className="text-gray-600">Other Costs Description:</span>
                                <p>{booking.otherCostsDescription}</p>
                              </div>
                            )}
                            {booking.notes && (
                              <div>
                                <span className="text-gray-600">Notes:</span>
                                <p>{booking.notes}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">Created:</span>
                              <p>{format(booking.createdAt, 'MMM d, yyyy')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
