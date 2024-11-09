import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { PulseLoader } from 'react-spinners';
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

    // fetch the users
    const getUsers = async (page = 1, role='', department_id='', status='') => {
        setLoading(true)

        let url = `/api/users?page=${page}`

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

    useEffect(() => {
        if(users.length < 1) {
            setLoading(true)
        }

        const role = usersFilters.role
        const department_id = usersFilters.department_id
        const status = usersFilters.status

        getUsers(1, role, department_id, status)
    }, [])

    // executes when user selects audit resource
    const handleRoleChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            role: e.target.value
        })
            
        getUsers(1, e.target.value, usersFilters.department_id, usersFilters.status)
    };

    // executes when user selects audit resource
    const handleDepartmentIdChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            department_id: e.target.value
        })
            
        getUsers(1, usersFilters.role, e.target.value, usersFilters.status)
    };

    // executes when user selects audit resource
    const handleStatusChange = (e) => {
        setLoading(true)
        
        setUsersFilters({
            ...usersFilters,
            status: e.target.value
        })
            
        getUsers(usersFilters.role, usersFilters.department_id, e.target.value)
    };

    // executes when user click previous button for audits
    const handlePrevious = () => {
        setLoading(true)
        
        getUsers(users.current_page - 1, usersFilters.role, usersFilters.department_id, usersFilters.status)
    };

    // executes when user click next button for audits
    const handleNext = () => {
        setLoading(true)
        
        getUsers(users.current_page + 1, usersFilters.role, usersFilters.department_id, usersFilters.status)
    };

    return (
        <>  
            <Sidebar />
            <Header />  
            
            { users ? (
                <div className="w-full md:w-[75%] md:ml-[22%] mt-10">
                    <div className={`flex justify-between items-end mb-6 mt-12`}>
                        <h2 className={`font-bold text-2xl`}>{ "Users" }</h2>
                        <div className={`flex justify-end gap-4 items-end`}>
                            {/* select role dropdown */}
                            <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                    name="resource" id="resource" value={usersFilters.role} onChange={handleRoleChange}>
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="physician">Physician</option>
                            <option value="secretary">Secretary</option>
                            <option value="queue manager">Queue Manager</option>
                            </select>

                            {/* select department id dropdown */}
                            <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                    name="resource" id="resource" value={usersFilters.department_id} onChange={handleDepartmentIdChange}>
                                <option value="">Select department</option>
                                { departments && departments.map((department, index) => (
                                    <>
                                        <option key={index} value={department.id}>{department.name}</option>
                                    </>
                                )) }
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
            ) : (<></>)}
        </>
    );
};

export default UsersPage;