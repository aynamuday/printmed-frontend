import React, { useState, useEffect, useContext } from 'react';
import { PulseLoader } from 'react-spinners';

import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UsersTable from '../components/UsersTable';

const UsersPage = () => {
    const { token, departments } = useContext(AppContext)
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

        getUsers(1, undefined, role, department_id, status)
    }, [])

    // fetch the users
    const getUsers = async (page = 1, search='', role='', department_id='', status='') => {
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

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        setUsers(data)

        setLoading(false)
    }

    // executes when user selects audit resource
    const handleRoleChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            role: e.target.value
        })
            
        getUsers(1, undefined, e.target.value, usersFilters.department_id, usersFilters.status)
    };

    // executes when user selects audit resource
    const handleDepartmentIdChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            department_id: e.target.value
        })
            
        getUsers(1, undefined,  usersFilters.role, e.target.value, usersFilters.status)
    };

    // executes when user selects audit resource
    const handleStatusChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            status: e.target.value
        })
            
        getUsers(users.current_page, undefined, usersFilters.role, usersFilters.department_id, e.target.value)
    };

    // executes when user click previous button for audits
    const handlePrevious = () => {
        setLoading(true)
        
        getUsers(users.current_page - 1, undefined, usersFilters.role, usersFilters.department_id, usersFilters.status)
    };

    // executes when user click next button for audits
    const handleNext = () => {
        setLoading(true)
        
        getUsers(users.current_page + 1, undefined, usersFilters.role, usersFilters.department_id, usersFilters.status)
    };

    // executes when user click search
    const handleSearch = (e) => {
        e.preventDefault()

        setLoading(true)
    
        setUsersFilters({
            role: '',
            department_id: '',
            status: ''
        })
            
        getUsers(1, searchUser, undefined, undefined, undefined)
    };

    return (
        <>  
            <Sidebar />
            <Header />  
            
            { users && (
                <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-12">
                    <div className={`flex justify-between items-end mb-6 mt-14`}>
                        <h2 className={`font-bold text-2xl`}>Users</h2>
                        <div className={`flex justify-end gap-4 items-end`}>
                            {/* select role dropdown */}
                            <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                    name="resource" id="resource" value={usersFilters.role} onChange={handleRoleChange}>
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="physician">Physician</option>
                            <option value="secretary">Secretary</option>
                            </select>

                            {/* select department id dropdown */}
                            <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                    name="resource" id="resource" value={usersFilters.department_id} onChange={handleDepartmentIdChange}>
                                <option value="">Select department</option>
                                {departments && departments.map((department) => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                            </select>

                            {/* select status dropdown */}
                            <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                    name="resource" id="resource" value={usersFilters.status} onChange={handleStatusChange}>
                                <option value="">Select status</option>
                                <option value="active">Active</option>
                                <option value="restricted">Restricted</option>
                                <option value="locked">Locked</option>
                                <option value="new">New</option>
                            </select>

                            <div>
                                <label htmlFor="search" className='text-xs block mb-1'>{"Full Name (FN LN) or Personnel No."}</label>
                                <form onSubmit={(e) => handleSearch(e)} className='border border-[#6CB6AD] py-1 rounded ps-4'>
                                    <input
                                        type="text"
                                        name="search"
                                        className="focus:outline-none focus:border-none"
                                        value={searchUser}
                                        onChange={(e) => {setSearchUser(e.target.value)}}
                                        placeholder='Search'
                                    />
                                    <button onClick={(e) => handleSearch(e)} className="btn btn-primary d-flex align-items-center">
                                        <i className="bi bi-search me-2 text-[#374151]"></i>
                                    </button>
                                </form>
                            </div>

                            {/* pagination buttons */}
                            <div>
                                <button className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${users.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`} 
                                        disabled={users.current_page <= 1} onClick={handlePrevious}>
                                    &lt;
                                </button>
                                <button className={`px-4 h-8 border border-[#6CB6AD] text-sm`} disabled={true}>
                                    {users.current_page} OF {users.last_page}
                                </button>
                                <button className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${users.current_page === users.last_page ? 'bg-opacity-70' : ''} text-white text-sm`} 
                                        disabled={users.current_page === users.last_page} onClick={handleNext}>
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>

                    { loading ? (
                        <div className='flex justify-center items-center mt-20'>
                            <PulseLoader color="#6CB6AD" loading={loading} size={15} />
                        </div>
                    ) : (
                        <UsersTable users={users.data} />
                    )}
                </div>
            )}
        </>
    );
};

export default UsersPage;