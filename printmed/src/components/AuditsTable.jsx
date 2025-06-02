import React from 'react'
import { capitalizedWords } from '../utils/wordUtils'

const AuditsTable = ({ forDashboard, audits }) => {
  return (
    <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-spacing-0 border-gray-300 text-sm sm:text-base mb-10">
            <thead>
              <tr>
                <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">{forDashboard ? "Time" : "Date"}</th>
                <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">User Role</th>
                <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">User No.</th>
                <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[30%]">Action</th>
                <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[15%]">Entity</th>
              </tr>
            </thead>
            <tbody>
              { audits && audits.length > 0 ? (
                audits.map((audit, index) => (
                  <tr key={index}>
                    <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{`${!forDashboard ? audit.date + '\u00A0' : ""} ${audit.time}`}</td>
                    <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{capitalizedWords(audit.user_role)}</td>
                    <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{audit.user_personnel_number}</td>
                    <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{audit.message}</td>
                    <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{audit.resource_entity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-2 py-2 border-[#828282] text-center">No audits</td>
                </tr>
              )}
            </tbody>
        </table> 
    </div>
  )
}

export default AuditsTable