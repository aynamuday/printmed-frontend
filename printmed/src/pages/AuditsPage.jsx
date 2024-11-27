import React from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Audits from '../components/Audits';

const AuditsPage = () => {
  return (
    <>
      <Sidebar />
      <Header />       
      <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-10">
        <Audits />
      </div>
    </>
  );
};

export default AuditsPage;
