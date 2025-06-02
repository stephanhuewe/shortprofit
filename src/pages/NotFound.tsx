import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="py-16 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-2 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
      <div className="mt-6">
        <Link to="/" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
