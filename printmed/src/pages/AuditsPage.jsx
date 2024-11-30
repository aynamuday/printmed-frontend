import React from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Audits from '../components/Audits';

const AuditsPage = () => {
  return (
    <>
      <Sidebar />
      <Header />       
      <div className="ml-20 mr-20 mt-20 mb-8 px-4 sm:px-6 md:px-8 pt-16 lg:pt-20">
        <Audits />
      </div>
    </>
  );
};

export default AuditsPage;
