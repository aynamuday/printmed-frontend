import React, { useContext, useEffect, useState, useRef } from 'react';
import { BounceLoader } from 'react-spinners';
import { capitalizedWords } from '../utils/wordUtils';
import { getFormattedNumericDate } from '../utils/dateUtils';
import { globalSwalWithIcon } from '../utils/globalSwal';
import {showError} from "../utils/fetch/showError";

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const UsersTable = ({ users }) => {
  const { token, user } = useContext(AppContext)
  const { setUsers } = useContext(AdminContext)
  const navigate = useNavigate()

  const [updatedUser, setUpdatedUser] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const [loading, setLoading] = useState(false)

  const actionMenuRefs = useRef([]);
  const setActionMenuRef = (index, element) => {
    actionMenuRefs.current[index] = element;
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = actionMenuRefs.current.some(ref =>
        ref && ref.contains(event.target)
      );

      if (!isClickInside) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (users && updatedUser != null) {
      setUsers((prevUsers) => {
        const updatedData = prevUsers.data.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );

        return {
          ...prevUsers,
          data: updatedData,
        };
      });

      setUpdatedUser(null);
    }
  }, [updatedUser]);

  // remove the current user, so it's not displayed on the table
  users = users ? users.filter((item) => item.id !== user.id) : users;

  const viewUser = async (user) => {
    navigate(`/users/${user.id}`, {
      state: { user }
    });
  }

  const handleToggleLockButton = async (userId, isLocked, personnelNumber) => {
    setActionMenuOpen(null)

    globalSwalWithIcon.fire({
      icon: 'warning',
      title: `Are you sure you want to <span style='color: red;'>${isLocked ? "unlock" : "lock"}</span> user ${personnelNumber}?`,
      showCancelButton: true,
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
    
          const res = await fetch(`/api/users/${userId}/toggle-lock`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if(!res.ok) {
            throw new Error("Something went wrong. Please try again later.")
          }
    
          const data = await res.json();
          setUpdatedUser(data);  
          
          globalSwalWithIcon.fire({
            icon: 'success',
            title: `Account ${isLocked ? "unlocked" : "locked"} successfully!`,
            showConfirmButton: false,
            showCloseButton: true
          })
        }
        catch (err) {
          showError(err)
        }
        finally {
          setLoading(false)
        }
      }
    })
  };

  const handleUnrestrictButton = async (userId) => {
    setActionMenuOpen(null);

    try {
      setLoading(true)

      const res = await fetch(`/api/users/${userId}/unrestrict`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(!res.ok) {
        throw new Error("Something went wrong. Please try again later.")
      }

      const data = await res.json();
      setUpdatedUser(data);  
      
      globalSwalWithIcon.fire({
        icon: 'success',
        title: `Account unrestricted successfully!`,
        showConfirmButton: false,
          showCloseButton: true
      })
    }
    catch (err) {
      showError(err)
    }
    finally {
      setLoading(false)
    }
  }

  const getUserStatus = (user) => {
    let status = 'Active';

    if (user.is_locked) {
      status = 'Locked';
    } else if (user.failed_login_attempts > 2) {
      status = 'Restricted';
    } else if (!user.email_verified_at) {
      status = 'New';
    }

    return status;
  };

  return (
    <div className="w-full overflow-x-auto">
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white bg-opacity-30 z-50">
          <BounceLoader color="#6CB6AD" loading={loading} size={60} />
        </div>
      )}
      <table className="min-w-full border border-spacing-0 border-gray-300 text-sm sm:text-base">
        <thead>
          <tr>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Personnel No.</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Role</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Last Name</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">First Name</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Department</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Date Registered</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[10%]">Status</th>
            <th className="bg-[#D9D9D9] border border-[#828282] px-2 py-1 text-center whitespace-nowrap w-[5%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((item) => (
              <tr key={item.id}>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{item.personnel_number}</td>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{capitalizedWords(item.role)}</td>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{item.last_name}</td>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{item.first_name}</td>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{item.department_name}</td>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{getFormattedNumericDate(item.created_at)}</td>
                <td className="border p-0.5 border-[#828282] text-center whitespace-nowrap">{getUserStatus(item)}</td>
                <td className="border p-0.5 border-[#828282] text-center">
                  <div key={item.id} ref={(element) => setActionMenuRef(item.id, element)} className="ms-2 relative flex items-center justify-center gap-2">
                    <div>
                        <button onClick={() => {setActionMenuOpen(actionMenuOpen == item.id ? null : item.id)}}>
                          <i className='bi bi-three-dots text-xl text-[#248176] hover:text-gray-700 relative'></i>
                        </button>
                        {actionMenuOpen === item.id && (
                          <>
                          <div className="absolute right-0 min-w-40 w-max bg-white shadow-xl rounded-md py-0.5 border overflow-clip border-[#248176] z-10">
                            {/* {!item.is_locked && ( */}
                              <button onClick={() => {viewUser(item)}} className="block w-full hover:bg-gray-200 text-left px-3 pe-4 py-0.5">
                                <i className={`me-2 bi bi-pencil`}></i>Edit
                              </button>
                            {/* )} */}

                            {item.failed_login_attempts > 2 && (
                              <button onClick={() => handleUnrestrictButton(item.id)} className="block w-full text-left px-3 pe-4 py-0.5 text-green-600 hover:bg-gray-200">
                                <i className={`me-2 bi bi-unlock`}></i>Unrestrict
                              </button>
                            )}

                            {/* {!item.is_locked && (
                              <button className="block w-full text-left px-3 pe-4 py-0.5 text-blue-600 hover:bg-gray-200" onClick={() => handleSendResetLink(item.email, item.personnel_number)}>
                                <i className={`me-2 bi bi-send`}></i>Send Reset Link
                              </button>
                            )} */}

                            <button onClick={() => handleToggleLockButton(item.id, item.is_locked, item.personnel_number)} className="block w-full hover:bg-gray-200 text-left text-red-600 px-3 pe-4 py-0.5">
                              <i className={`me-2 bi ${item.is_locked ? "bi-unlock" : "bi-lock"}`}></i>{item.is_locked ? "Unlock" : "Lock"}
                            </button>
                          </div>
                          </>
                        )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="border p-2 border-[#828282] text-center">
                No users
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
