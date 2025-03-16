import React from 'react';
import ContestList from '../components/ContestList';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Programming Contests</h1>
      <p>Stay updated with all the upcoming programming contests from Codeforces, CodeChef, and LeetCode.</p>
      <ContestList />
    </div>
  );
};

export default HomePage;