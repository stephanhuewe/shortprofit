import { Link, useLocation } from 'react-router-dom';
import { FiX, FiHome, FiCalendar, FiSettings } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
        
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">RentalCalc</span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Close menu</span>
              <FiX className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${
                isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={onClose}
            >
              <FiHome className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/bookings"
              className={`flex items-center px-4 py-2 mt-2 text-base font-medium rounded-md ${
                isActive('/bookings') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={onClose}
            >
              <FiCalendar className="mr-3 h-5 w-5" />
              Bookings
            </Link>
            
            <Link
              to="/settings"
              className={`flex items-center px-4 py-2 mt-2 text-base font-medium rounded-md ${
                isActive('/settings') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={onClose}
            >
              <FiSettings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pt-16">
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center px-4 py-2 text-base font-medium rounded-md ${
              isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiHome className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          
          <Link
            to="/bookings"
            className={`flex items-center px-4 py-2 mt-2 text-base font-medium rounded-md ${
              isActive('/bookings') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiCalendar className="mr-3 h-5 w-5" />
            Bookings
          </Link>
          
          <Link
            to="/settings"
            className={`flex items-center px-4 py-2 mt-2 text-base font-medium rounded-md ${
              isActive('/settings') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
