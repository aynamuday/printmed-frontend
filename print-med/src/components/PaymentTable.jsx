import React from 'react';

const PaymentTable = ({ payments, onTogglePaymentStatus }) => {
  const handleTogglePayment = (payment) => {
    // Toggle the isPaid status and call the parent handler
    const updatedPayment = { ...payment, isPaid: !payment.isPaid };
    onTogglePaymentStatus(updatedPayment);
  };

  return (
    <table className="min-w-full border border-spacing-0 border-gray-300">
      <thead>
        <tr>
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
        {payments.length > 0 ? (
          payments.map((payment, index) => (
            <tr key={index}>
              <td className="border p-2 border-[#828282] text-center">{payment.patient_name}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.method}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.amount}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.hmo}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.is_paid ? 'Paid' : 'Unpaid'}</td>
              <td className="border p-2 border-[#828282] text-center">{payment.department}</td>
              <td className="border p-2 border-[#828282] text-center">
                <button
                  onClick={() => handleTogglePayment(payment)}
                  className={`px-4 py-2 rounded ${payment.isPaid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                >
                  {payment.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="border p-2 border-[#828282] text-center">No payments found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PaymentTable;
