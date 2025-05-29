import React from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Audits from '../components/Audits';

const AuditsPage = () => {
  return (
    <>
      <Sidebar />
      <div className="lg:pl-[250px] min-h-screen bg-white">
        <Header />       
        <div className="px-4 sm:px-6 mt-4">
          <Audits />
        </div>
      </div>
    </>
  );
};

export default AuditsPage;
