import React from 'react';

const PaymentTable = ({ payments }) => {
  return (
    <>
        <table className="min-w-full border border-spacing-0 border-gray-300">
            <thead>
                <tr>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Patient Name</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Patient Number</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Amount</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Paid</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center">Department</th>
                </tr>
            </thead>
            <tbody>
                {payments.length > 0 ? (
                payments.map((payment, index) => (
                    <tr key={index}>
                    <td className="border p-2 border-[#828282] text-center">{payment.date}</td>
                    <td className="border p-2 border-[#828282] text-center">{payment.method}</td>
                    <td className="border p-2 border-[#828282] text-center">{payment.amount}</td>
                    <td className="border p-2 border-[#828282] text-center">{payment.isPaid ? 'Paid' : 'Unpaid'}</td>
                    <td className="border p-2 border-[#828282] text-center">{payment.department}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="5" className="border p-2 border-[#828282] text-center">No payments found</td>
                </tr>
                )}
            </tbody>
        </table>
    </>
  );
};

export default PaymentTable;
