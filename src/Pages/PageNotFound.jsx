import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center px-6 py-10 bg-white shadow-2xl rounded-2xl max-w-md">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl mt-4 font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500 mt-2">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
