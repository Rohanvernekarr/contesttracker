import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Contest Tracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/bookmarks"
                className="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
              >
                Bookmarks
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary focus:outline-none"
              onClick={() => {
                document.documentElement.classList.toggle('dark');
              }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;