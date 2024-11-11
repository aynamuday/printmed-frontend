import React from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Payment from './Payment';

const PaymentPage = () => {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-10">
        <Payment />
      </div>
    </>
  );
};

export default PaymentPage;
