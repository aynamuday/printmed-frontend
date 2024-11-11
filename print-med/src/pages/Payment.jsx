import React, { useState, useEffect, useContext } from 'react';
import PaymentTable from '../components/PaymentTable';
import { PulseLoader } from 'react-spinners';
import AppContext from '../context/AppContext';
import { getFormattedDate } from '../utils/dateUtils';

const Payment = ({ forDashboard = false }) => {
  const { token } = useContext(AppContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateUntil: '',
    method: '',
    isPaid: '',
    departmentId: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const dateToday = getFormattedDate();

  // Fetch payments with applied filters
  const getPayments = async () => {
    setLoading(true);
    const { dateFrom, dateUntil, method, isPaid, departmentId } = filters;

    // Filter out empty filters
    const queryParams = new URLSearchParams();
    if (forDashboard) {
      // For the dashboard, only fetch today's payments
      queryParams.append('date_from', dateToday);
      queryParams.append('date_until', dateToday);
    } else {
      if (dateFrom) queryParams.append('date_from', dateFrom);
      if (dateUntil) queryParams.append('date_until', dateUntil);
      if (method) queryParams.append('method', method);
      if (isPaid) queryParams.append('is_paid', isPaid);
      if (departmentId) queryParams.append('department_id', departmentId);
    }

    const url = `/api/payments?page=${pagination.currentPage}&${queryParams.toString()}`;
    console.log(url)

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPayments(data.payments);
        setPagination({
          currentPage: data.payments.current_page,
          totalPages: data.payments.total_pages,
        });
        console.log(data)
      } else {
        console.error('API error:', data);
      }
    } catch (error) {
      console.error('Error connecting to API:', error);
    }
    setLoading(false);
  };

  // Execute the fetch when filters change or page is updated
  useEffect(() => {
    getPayments();
  }, [filters, pagination.currentPage]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      setPagination({
        ...pagination,
        currentPage: pagination.currentPage - 1,
      });
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination({
        ...pagination,
        currentPage: pagination.currentPage + 1,
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-end mb-6 mt-12">
        <h2 className="font-bold text-2xl">Payments | Today</h2>
        <div className="flex justify-end gap-4 items-end">
          {/* Filter dropdowns */}
          {!forDashboard && (
            <>
              <select
                className="px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                name="method"
                value={filters.method}
                onChange={handleFilterChange}
              >
                <option value="">Payment Method</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>

              <select
                className="px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                name="isPaid"
                value={filters.isPaid}
                onChange={handleFilterChange}
              >
                <option value="">Paid Status</option>
                <option value="true">Paid</option>
                <option value="false">Unpaid</option>
              </select>

              <div>
                <label htmlFor="dateFrom" className="text-xs block mb-1">Date From</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  max={dateToday}
                  className="block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="dateUntil" className="text-xs block mb-1">Date Until</label>
                <input
                  type="date"
                  name="dateUntil"
                  value={filters.dateUntil}
                  onChange={handleFilterChange}
                  min={filters.dateFrom !== "" ? filters.dateFrom : ''}
                  max={dateToday}
                  className="block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Pagination buttons */}
          <div>
            <button
              className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${pagination.currentPage === 1 ? 'bg-opacity-70' : ''} text-white text-sm`}
              disabled={pagination.currentPage <= 1}
              onClick={handlePreviousPage}
            >
              &lt;
            </button>
            <button className="px-4 h-8 border border-[#6CB6AD] text-sm" disabled>
              {pagination.currentPage} OF {pagination.totalPages}
            </button>
            <button
              className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${pagination.currentPage === pagination.totalPages ? 'bg-opacity-70' : ''} text-white text-sm`}
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={handleNextPage}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <PulseLoader color="#6CB6AD" loading={loading} size={15} />
        </div>
      ) : (
        <PaymentTable payments={payments.data} />
      )}
    </>
  );
};

export default Payment;
