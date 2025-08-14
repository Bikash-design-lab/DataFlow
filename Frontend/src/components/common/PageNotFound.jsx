import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <h1 className="text-7xl font-extrabold tracking-wider">404</h1>
      <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
      <p className="mt-2 text-gray-700">Sorry, the page you were looking for doesn’t exist.</p>
      <Link
        to="/home"
        className="mt-6 px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition duration-300 rounded-lg"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default PageNotFound;
