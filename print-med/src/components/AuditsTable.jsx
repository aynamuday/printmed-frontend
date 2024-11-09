import React from 'react'

const AuditsTable = ({ forDashboard, audits }) => {
  return (
    <>
        <table className="min-w-full border border-spacing-0 border-gray-300">
            <thead>
              <tr>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[15%]">Time</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[15%]">User Role</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[15%]">User No.</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[30%]">Action</th>
              </tr>
            </thead>
            <tbody>
              { audits && audits.length > 0 ? (
                audits.map((audit, index) => (
                  <tr key={index}>
                    <td className="border p-2 border-[#828282] text-center">{`${!forDashboard ? audit.date + '\u00A0' : ""} ${audit.time}`}</td>
                    <td className="border p-2 border-[#828282] text-center">{audit.user_role}</td>
                    <td className="border p-2 border-[#828282] text-center">{audit.user_personnel_number}</td>
                    <td className="border p-2 border-[#828282] text-center">{audit.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 border-[#828282] text-center">No audits</td>
                </tr>
              )}
            </tbody>
        </table> 
    </>
  )
}

export default AuditsTable