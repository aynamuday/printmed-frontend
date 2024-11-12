import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import SecretaryPhysicianContext from '../context/SecretaryPhysicianContext';
import { PulseLoader } from 'react-spinners';
import { getFormattedDate } from '../utils/dateUtils';

import PaymentTable from '../components/PaymentTable';

const Payment = ({ forDashboard = false }) => {
  const { token } = useContext(AppContext);
  const {
    paymentsToday,
    setPaymentsToday,
    paymentsTodayResource,
    setPaymentsTodayResource,
    paymentsAll,
    setPaymentsAll,
    paymentsAllFilters,
    setPaymentsAllFilters,
  } = useContext(SecretaryPhysicianContext);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const payments = forDashboard ? paymentsToday : paymentsAll;
  const dateToday = getFormattedDate();

  // Fetch the payments
  const getPayments = async (page = 1, resource = '', dateFrom = '', dateUntil = '') => {
    let url = `/api/payments?page=${page}`;
  
    if (forDashboard) {
      url += `&date_from=${dateToday}`; // Default to today's date for the dashboard
  
      if (resource.trim()) {
        url += `&is_paid=${resource === 'paid' ? 1 : 0}`; // Assuming 'paid' and 'unpaid' values map to 1 and 0 for the API
      }
    } else {
      // Ensure date_from is not greater than date_until
      if (dateFrom && dateUntil && new Date(dateFrom) > new Date(dateUntil)) {
        alert('Date From cannot be greater than Date Until');
        return;
      }
  
      if (dateFrom) {
        url += `&date_from=${dateFrom}`;
      }
      if (dateUntil) {
        url += `&date_until=${dateUntil}`;
      }
      if (resource.trim()) {
        url += `&is_paid=${resource === 'paid' ? 1 : 0}`; // Map 'paid'/'unpaid' to 1/0 for API
      }
    }
  
    setLoadingPayments(true);
  
    // Fetch the payments from the API with the constructed URL
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      setLoadingPayments(false);
      alert('Failed to fetch payments. Please try again.');
      return;
    }
  
    const data = await res.json();
    if (forDashboard) {
      setPaymentsToday(data);
    } else {
      setPaymentsAll(data);
    }
  
    setLoadingPayments(false);
  };
  

  useEffect(() => {
    if (payments.length < 1) {
      setLoadingPayments(true);
    }

    if (forDashboard) {
      getPayments(1, paymentsTodayResource, undefined, undefined);
    } else {
      const dateFrom = paymentsAllFilters.dateFrom;
      const dateUntil = paymentsAllFilters.dateUntil;
      const resource = paymentsAllFilters.resource;

      getPayments(1, resource, dateFrom, dateUntil);
    }
  }, []);

  // Executes when user selects payment resource (Paid or Unpaid)
  const handlePaymentsResourceChange = (e) => {
    setLoadingPayments(true);
    if (forDashboard) {
      setPaymentsTodayResource(e.target.value);
      getPayments(1, e.target.value, undefined, undefined);
    } else {
      setPaymentsAllFilters({
        ...paymentsAllFilters,
        resource: e.target.value,
      });

      getPayments(1, e.target.value, paymentsAllFilters.dateFrom, paymentsAllFilters.dateUntil);
    }
  };

  // Executes when user selects date from
  const handlePaymentsDateFromChange = (e) => {
    if (!forDashboard) {
      setLoadingPayments(true);
      setPaymentsAllFilters({
        ...paymentsAllFilters,
        dateFrom: e.target.value,
      });

      getPayments(1, paymentsAllFilters.resource, e.target.value, paymentsAllFilters.dateUntil);
    }
  };

  // Executes when user selects date until
  const handlePaymentsDateUntilChange = (e) => {
    if (!forDashboard) {
      setLoadingPayments(true);
      setPaymentsAllFilters({
        ...paymentsAllFilters,
        dateUntil: e.target.value,
      });

      getPayments(1, paymentsAllFilters.resource, paymentsAllFilters.dateFrom, e.target.value);
    }
  };

  // Executes when user clicks previous button for payments
  const handlePreviousPayments = () => {
    setLoadingPayments(true);
    if (forDashboard) {
      getPayments(paymentsToday.current_page - 1, paymentsTodayResource, undefined, undefined);
    } else {
      getPayments(paymentsToday.current_page - 1, paymentsAllFilters.resource, paymentsAllFilters.dateFrom, paymentsAllFilters.dateUntil);
    }
  };

  // Executes when user clicks the next button for payments
  const handleNextPayments = () => {
    setLoadingPayments(true);
    if (forDashboard) {
      getPayments(paymentsToday.current_page + 1, paymentsTodayResource, undefined, undefined);
    } else {
      getPayments(paymentsToday.current_page + 1, paymentsAllFilters.resource, paymentsAllFilters.dateFrom, paymentsAllFilters.dateUntil);
    }
  };

  const resourceValue = forDashboard ? paymentsTodayResource : paymentsAllFilters.resource;

  return (
    <>
      {payments.payments ? (
        <>
          <div className={`flex justify-between items-end mb-6 ${!forDashboard ? `mt-12` : ``}`}>
            <h2 className={`font-bold ${forDashboard ? `text-lg` : `text-2xl`}`}>
              {forDashboard ? 'Payments | Today' : 'Payments'}
            </h2>
            <div className={`flex justify-end gap-4 items-end`}>
              {/* Select payments resource dropdown */}
              <select
                className="px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                name="resource"
                id="resource"
                value={resourceValue}
                onChange={handlePaymentsResourceChange}
              >
                <option value="">Select resource</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              {!forDashboard ? (
                <>
                  {/* Date from */}
                  <div>
                    <label htmlFor="dateFrom" className="text-xs block mb-1">
                      Date From
                    </label>
                    <input
                      type="date"
                      name="dateFrom"
                      value={paymentsAllFilters.dateFrom}
                      onChange={handlePaymentsDateFromChange}
                      max={dateToday}
                      className="block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                    />
                  </div>
                  {/* Date until */}
                  <div>
                    <label htmlFor="dateUntil" className="text-xs block mb-1">
                      Date Until
                    </label>
                    <input
                      type="date"
                      name="dateUntil"
                      value={paymentsAllFilters.dateUntil}
                      onChange={handlePaymentsDateUntilChange}
                      min={paymentsAllFilters.dateFrom !== '' ? paymentsAllFilters.dateFrom : ''}
                      max={dateToday}
                      className="block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* Pagination buttons */}
              <div>
                <button
                  className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${payments.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`}
                  disabled={payments.current_page <= 1}
                  onClick={handlePreviousPayments}
                >
                  &lt;
                </button>
                <button className="px-4 h-8 border border-[#6CB6AD] text-sm" disabled={true}>
                  {payments.current_page} OF {payments.last_page}
                </button>
                <button
                  className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${payments.current_page === payments.last_page ? 'bg-opacity-70' : ''} text-white text-sm`}
                  disabled={payments.current_page === payments.last_page}
                  onClick={handleNextPayments}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {loadingPayments ? (
            <div className="flex justify-center items-center mt-20">
              <PulseLoader color="#6CB6AD" loading={loadingPayments} size={15} />
            </div>
          ) : (
            // Payments table
            <PaymentTable forDashboard={forDashboard} payments={payments.payments.data} />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Payment;
