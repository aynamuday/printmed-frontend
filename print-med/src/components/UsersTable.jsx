import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { getCapitalizedEachWord } from '../utils/wordUtils'
import { getFormattedDate } from '../utils/dateUtils'

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';

const UsersTable = ({ users }) => {
  const { token, user } = useContext(AppContext)
  const { setUsers } = useContext(AdminContext)

  const [ updatedUser, setUpdatedUser ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  // remove the current user, so it's not displayed on table
  users = users ? users.filter(item => item.id !== user.id) : users

  // toggle lock user account
  const handleToggleLockButton = async (userId) => {
    setLoading(true)

    const res = await fetch(`/api/users/${userId}/toggle-lock`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (res.ok) {
      setUpdatedUser(data)
    }
    
    setLoading(false)
  }

  // unrestrict user account
  const handleUnrestrictButton = async (userId) => {
    setLoading(true)
    
    const res = await fetch(`/api/users/${userId}/unrestrict`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (res.ok) {
      setUpdatedUser(data)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    if (users && updatedUser != null) {
      setUsers(prevUsers => {
        const updatedData = prevUsers.data.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        )

        return {
          ...prevUsers,
          data: updatedData
        }
      });

      setUpdatedUser(null)
    }
  }, [updatedUser])

  const getUserStatus = (user) => {
    let status = "Active"

    if (user.is_locked) {
        status = "Locked"
    } else if (user.failed_login_attempts > 2) {
        status = "Restricted"
    } else if (!user.email_verified_at) {
      status = "New"
    }

    return status
  }

  return (
    <div className='relative'>
        { loading && (
          <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white bg-opacity-50 z-10'>
            <PulseLoader color="#6CB6AD" loading={loading} size={15} />
          </div>
        )}
        <table className="min-w-full border border-spacing-0 border-gray-300">
            <thead>
              <tr>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Personnel Number</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Role</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[15%]">Name</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Department</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Date Registered</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Status</th>
                <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              { users && users.length > 0 ? (
                users.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2 border-[#828282] text-center">{item.personnel_number}</td>
                      <td className="border p-2 border-[#828282] text-center">{getCapitalizedEachWord(item.role)}</td>
                      <td className="border p-2 border-[#828282] text-center">{item.full_name}</td>
                      <td className="border p-2 border-[#828282] text-center">{item.department_name}</td>
                      <td className="border p-2 border-[#828282] text-center">{getFormattedDate(item.created_at)}</td>
                      <td className="border p-2 border-[#828282] text-center">{getUserStatus(item)}</td>
                      <td className="border p-2 border-[#828282] text-center">{
                        <div className='flex flex-row w-100 items-center justify-center gap-4'>
                          <Link to={`/view-user/${item.id}`} className={`py-1 w-24 rounded-lg bg-green-500 text-white`}>
                            View
                          </Link>

                          <button onClick={() => handleToggleLockButton(item.id)} className={`py-1 w-24 rounded-lg ${item.is_locked ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'}`}>
                            { item.is_locked ? 'Unlock' : 'Lock'}
                          </button>

                          { user.failed_login_attempts > 2 && (
                            <button onClick={() => handleUnrestrictButton(item.id)} className='py-1 w-28 rounded-lg bg-blue-500 text-white'>
                              Unrestrict
                            </button>
                          )}
                        </div>
                      }</td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-2 border-[#828282] text-center">No users</td>
                </tr>
              )}
            </tbody>
        </table> 
    </div>
  )
}

export default UsersTable