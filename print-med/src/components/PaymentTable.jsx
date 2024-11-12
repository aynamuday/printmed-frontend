import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import AppContext from '../context/AppContext';

const PaymentTable = ({ forDashboard, payments: initialPayments }) => {
  const { token } = useContext(AppContext);
  const [payments, setPayments] = useState(initialPayments);

  const handleTogglePayment = (payment) => {
    Swal.fire({
      title: `Confirm Payment Status Change`,
      text: `Are you sure you want to mark this patient as ${payment.is_paid ? 'Unpaid' : 'Paid'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, mark as ${payment.is_paid ? 'Unpaid' : 'Paid'}`,
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistic UI update: immediately update the state
        const updatedPayments = payments.map((p) =>
          p === payment ? { ...p, is_paid: !payment.is_paid } : p
        );
        setPayments(updatedPayments);
  
        fetch(`/api/payments/${payment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ is_paid: payment.is_paid ? 0 : 1 }), // Sending 1 or 0 instead of boolean
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire(
                'Updated!',
                `The payment has been marked as ${!payment.is_paid ? 'Paid' : 'Unpaid'}.`,
                'success'
              );
            } else {
              throw new Error('Failed to update payment status');
            }
          })
          .catch((error) => {
            // Revert the state update if the request fails
            Swal.fire('Error', error.message, 'error');
            // Revert to previous state (before optimistic update)
            setPayments((prevPayments) =>
              prevPayments.map((p) =>
                p === payment ? { ...p, is_paid: payment.is_paid } : p
              )
            );
          });
      }
    });
  };

  return (
    <table className="min-w-full border border-spacing-0 border-gray-300">
      <thead>
        <tr>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Time</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Patient Name</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Method</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">HMO</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Amount</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Paid</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Department</th>
          <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {payments && payments.length > 0 ? (
          payments.map((payment, index) => (
            <tr key={index}>
              <td className="border p-2 border-[#828282] text-center">
                {`${!forDashboard ? payment.date + '\u00A0' : ""} ${payment.time}`}
              </td>
              <td className="border p-2 border-[#828282] text-center">{payment.patient_name}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.method}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.hmo}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.amount}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.is_paid ? 'Paid' : 'Unpaid'}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.department}</td>
              <td className="border p-2 border-[#828282] text-center">
                <button
                  onClick={() => handleTogglePayment(payment)}
                  className={`px-4 py-2 rounded ${
                    payment.is_paid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {payment.is_paid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="border p-2 border-[#828282] text-center">
              No payments found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PaymentTable;
