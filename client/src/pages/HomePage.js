import React from 'react';
import ContestList from '../components/ContestList';

const HomePage = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Programming Contests
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Stay updated with all the upcoming programming contests from Codeforces, CodeChef, and LeetCode.
        </p>
      </div>
      <ContestList />
    </div>
  );
};

export default HomePage;