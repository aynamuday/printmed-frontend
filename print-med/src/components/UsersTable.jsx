import React from 'react'
import { getCapitalizedEachWord } from '../utils/wordUtils'
import { getFormattedDate } from '../utils/dateUtils'

const UsersTable = ({ users }) => {
    const getUserStatus = (user) => {
        let status = "Active"

        if (!user.email_verified_at) {
            status = "New"
        } else if (user.is_locked) {
            status = "Locked"
        } else if (user.failed_login_attempts > 2) {
            status = "Restricted"
        }

        return status
    }

  return (
    <>
        <table className="min-w-full border border-spacing-0 border-gray-300">
            <thead>
              <tr>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Personnel Number</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Role</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[15%]">Name</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Department</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[15%]">Date Registered</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Status</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[30%]">Action</th>
              </tr>
            </thead>
            <tbody>
              { users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td className="border p-2 border-[#828282] text-center">{user.personnel_number}</td>
                    <td className="border p-2 border-[#828282] text-center">{getCapitalizedEachWord(user.role)}</td>
                    <td className="border p-2 border-[#828282] text-center">{user.full_name}</td>
                    <td className="border p-2 border-[#828282] text-center">{user.department_name}</td>
                    <td className="border p-2 border-[#828282] text-center">{getFormattedDate(user.created_at)}</td>
                    <td className="border p-2 border-[#828282] text-center">{getUserStatus(user)}</td>
                    <td className="border p-2 border-[#828282] text-center">{}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-2 border-[#828282] text-center">No users</td>
                </tr>
              )}
            </tbody>
        </table> 
    </>
  )
}

export default UsersTable