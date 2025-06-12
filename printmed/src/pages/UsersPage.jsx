import React, { useState, useEffect, useContext } from 'react';
import { PulseLoader } from 'react-spinners';
import {showError} from "../utils/fetch/showError";

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UsersTable from '../components/UsersTable';

const UsersPage = () => {
    const { user, token } = useContext(AppContext)
    const { 
        users, setUsers, 
        searchUser, setSearchUser, 
        usersFilters, setUsersFilters
    } = useContext(AdminContext)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        if(users.length < 1) {
            setLoading(true)
        }

        const role = usersFilters.role
        const department_id = usersFilters.department_id
        const status = usersFilters.status

        getUsers(1, searchUser, role, department_id, status, usersFilters.sort_by, usersFilters.order_by)
    }, [])

    // fetch the users
    const getUsers = async (page = 1, search='', role='', department_id='', status='', sort_by='', order_by ='') => {
        let url = `/api/users?page=${page}`

        if (!(search.trim() === "")) {
            url += `&search=${search.trim()}`
        }
        if (!(role.trim() === "")) {
            url += `&role=${role}`
        }
        if (!(department_id.trim() === "")) {
            url += `&department_id=${department_id}`
        }
        if (!(status.trim() === "")) {
            url += `&status=${status}`
        }
        if (!(sort_by.trim() === "")) {
            url += `&sort_by=${sort_by}`
        }
        if (!(order_by.trim() === "")) {
            url += `&order_by=${order_by}`
        }

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
     
            if(!res.ok) {
                throw new Error("An error occured while fetching the users. Please try again later.")
            }
     
            const data = await res.json()
            setUsers(data)
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
        }
    }

    // executes when user selects role
    const handleRoleChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            role: e.target.value
        })
            
        getUsers(1, undefined, e.target.value, usersFilters.department_id, usersFilters.status, usersFilters.sort_by, usersFilters.order_by)
    };

    // executes when user selects department
    // const handleDepartmentIdChange = (e) => {
    //     setLoading(true)
        
    //     setUsersFilters({
    //         ...usersFilters,
    //         department_id: e.target.value
    //     })
            
    //     getUsers(1, undefined,  usersFilters.role, e.target.value, usersFilters.status)
    // };

    const handleStatusChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            status: e.target.value
        })
            
        getUsers(users.current_page, undefined, usersFilters.role, usersFilters.department_id, e.target.value, usersFilters.sort_by, usersFilters.order_by)
    };

    const handleSortByChange = (e) => {
        setLoading(true);
    
        const selectedOption = e.target.selectedOptions[0]
        const sortBy = selectedOption.getAttribute('data-sort-by')
        const orderBy = selectedOption.getAttribute('data-order-by')
    
        setUsersFilters((prevUsersFilters) => ({ ...prevUsersFilters, sort_by: sortBy, order_by: orderBy}))

        getUsers(1, searchUser, usersFilters.role, usersFilters.department_id, usersFilters.status, sortBy, orderBy)
      };

    // executes when user click previous button
    const handlePrevious = () => {
        setLoading(true)
        
        getUsers(users.current_page - 1, searchUser, usersFilters.role, usersFilters.department_id, usersFilters.status, usersFilters.status, usersFilters.sort_by, usersFilters.order_by)
    };

    // executes when user click next button
    const handleNext = () => {
        setLoading(true)
        
        getUsers(users.current_page + 1, searchUser, usersFilters.role, usersFilters.department_id, usersFilters.status, usersFilters.status, usersFilters.sort_by, usersFilters.order_by)
    };

    // executes when user click search
    const handleSearch = (e) => {
        e.preventDefault()

        setLoading(true)
    
        setUsersFilters({
            ...usersFilters,
            role: '',
            department_id: '',
            status: ''
        })
            
        getUsers(1, searchUser, undefined, undefined, undefined, usersFilters.sort_by, usersFilters.order_by)
    };

    const handleClear = () => {
        setLoading(true)
    
        setSearchUser('');
        setUsersFilters({
            ...usersFilters,
            role: '',
            department_id: '',
            status: ''
        })
    
        getUsers(1, undefined, undefined, undefined, undefined, usersFilters.sort_by, usersFilters.order_by)
    };

    return (
    <>
        <Sidebar />
        <div className="lg:pl-[250px] min-h-screen bg-white">
            <Header />
            <div className="px-4 sm:px-6 mt-4">
                {users && (
                <div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-6 mt-4">
                        <h2 className="font-bold text-2xl">Users</h2>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap w-full sm:w-auto">
                            {/* Search */}
                            <div className="flex flex-col w-full sm:w-auto">
                                <label className="text-xs mb-1">Name (FN LN or FN or LN) or Personnel No.</label>
                                <form
                                    onSubmit={handleSearch}
                                    className="flex border border-[#248176] rounded items-center px-4 py-1.5 h-8"
                                >
                                    <input
                                        type="text"
                                        name="search"
                                        className="flex-1 focus:outline-none text-sm"
                                        value={searchUser}
                                        onChange={(e) => setSearchUser(e.target.value)}
                                        placeholder="Search"
                                    />
                                    <button type="submit" className="text-[#374151]">
                                        <i className="bi bi-search text-lg"></i>
                                    </button>
                                </form>
                            </div>

                            <div className="flex flex-row sm:flex-row gap-4 sm:items-end w-full sm:w-auto">
                                {/* Role Filter */}
                                <div className="flex flex-col w-full sm:w-40">
                                    <label className="text-xs mb-1">Role</label>
                                    <select
                                        className="w-full sm:w-auto px-4 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none"
                                        name="resource"
                                        id="resource"
                                        value={usersFilters.role}
                                        onChange={handleRoleChange}
                                    >
                                        <option value="">Select role</option>
                                        {user.role === "super admin" && <option value="admin">Admin</option>}
                                        <option value="physician">Physician</option>
                                        <option value="secretary">Secretary</option>
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="flex flex-col w-full sm:w-40">
                                    <label className="text-xs mb-1">Status</label>
                                    <select
                                        className="w-full sm:w-auto px-4 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none"
                                        name="resource"
                                        id="resource"
                                        value={usersFilters.status}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="">Select status</option>
                                        <option value="active">Active</option>
                                        <option value="restricted">Restricted</option>
                                        <option value="locked">Locked</option>
                                        <option value="new">New</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div className="flex flex-col w-full sm:w-40">
                                    <label className="text-xs mb-1">Sort by</label>
                                    <select
                                        className="w-full sm:w-auto px-4 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none"
                                        value={usersFilters.sort_by + "_" + usersFilters.order_by}
                                        onChange={handleSortByChange}
                                    >
                                        <option 
                                            value="" 
                                            data-sort-by="" 
                                            data-order-by=""
                                        >
                                            Last updated
                                        </option>
                                        <option 
                                            value="personnel_number_asc"
                                            data-sort-by="personnel_number" 
                                            data-order-by="asc"
                                        >
                                            &uarr; &nbsp;Personnel No.
                                        </option>
                                        <option 
                                            value="personnel_number_desc"
                                            data-sort-by="personnel_number" 
                                            data-order-by="desc"
                                        >
                                            &darr; &nbsp;Personnel No.
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Pagination + Clear */}
                            {users.data != null && (
                                <div className="flex flex-row sm:flex-row gap-4 sm:items-end w-full sm:w-auto">
                                    {/* Pagination */}
                                    <div className="flex items-center text-xs sm:text-sm md:text-base">
                                        <button
                                            className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${users.current_page === 1 ? "bg-opacity-70" : ""} text-white rounded`}
                                            disabled={users.current_page <= 1}
                                            onClick={handlePrevious}
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            className="px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-white text-[#248176] font-medium rounded"
                                            disabled
                                        >
                                            {users.current_page} OF {users.last_page}
                                        </button>
                                        <button
                                            className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${users.current_page === users.last_page ? "bg-opacity-70" : ""} text-white rounded`}
                                            disabled={users.current_page === users.last_page}
                                            onClick={handleNext}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* Clear Button */}
                            <div className="flex items-center">
                            {/* <label className="text-xs mb-1">Clear</label> */}
                                <button
                                    onClick={handleClear}
                                    className="px-4 h-8 border border-[#248176] rounded bg-[#248176] text-white text-sm"
                                >
                                    <i className="bi bi-arrow-clockwise text-xl"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table or Loader */}
                    { loading ? (
                        <div className="flex justify-center items-center mt-20">
                            <PulseLoader color="#6cb6ad" loading={loading} size={15} />
                        </div>
                    ) : (
                        <UsersTable users={users.data} />
                    )}
                </div>
            )}
            </div>
        </div>
    </>
);

};

export default UsersPage;