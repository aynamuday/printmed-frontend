import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { getFormattedDate } from '../utils/dateUtils';

import AuditsTable from './AuditsTable';

const Audits = ({ forDashboard = false }) => {
    const { token } = useContext(AppContext)
    const { 
        auditsToday, 
        setAuditsToday,
        auditsTodayResource, 
        setAuditsTodayResource, 
        loadingAuditsTodayDownload, 
        setLoadingAuditsTodayDownload, 
        auditsAll, 
        setAuditsAll, 
        auditsAllFilters, 
        setAuditsAllFilters, 
        loadingAuditsAllDownload, 
        setLoadingAuditsAllDownload 
    } = useContext(AdminContext)
    const [ loadingAudits, setLoadingAudits ] = useState(false)
    const audits = forDashboard ? auditsToday : auditsAll
    const dateToday = getFormattedDate()

    // fetch the audits
    const getAudits = async (page = 1, resource='', dateFrom='', dateUntil='') => {
        let url = `/api/audits?page=${page}`

        if (forDashboard) {
            url += `&date_from=${dateToday}`
    
            if (!(resource.trim() === "")) {
                url += `&resource=${resource}`
            }
        }  else {
            if (!(dateFrom.trim() === "")) {
                url += `&date_from=${dateFrom}`
            }
            if (!(dateUntil.trim() === "")) {
                url += `&date_until=${dateUntil}`
            }
            if (!(resource.trim() === "")) {
                url += `&resource=${resource}`
            }
        }

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        forDashboard ? setAuditsToday(data) : setAuditsAll(data)

        setLoadingAudits(false)
    }

    useEffect(() => {
        if(audits.length < 1) {
            setLoadingAudits(true)
        }

        if (forDashboard) {
            getAudits(1, auditsTodayResource, undefined, undefined)
        }  else {
            const dateFrom = auditsAllFilters.dateFrom
            const dateUntil = auditsAllFilters.dateUntil
            const resource = auditsAllFilters.resource

            getAudits(1, resource, dateFrom, dateUntil)
        }
    }, [])

    // executes when user selects audit resource
    const handleAuditsResourceChange = (e) => {
        setLoadingAudits(true)
        if (forDashboard) {
            setAuditsTodayResource(e.target.value)
            getAudits(1, e.target.value, undefined, undefined)
        } else {
            setAuditsAllFilters({
                ...auditsAllFilters,
                resource: e.target.value
            })
            
            getAudits(1, e.target.value, auditsAllFilters.dateFrom, auditsAllFilters.dateUntil)
        }
    };

    // executes when user selects date from
    const handleAuditsDateFromChange = (e) => {
        if (!forDashboard) {
            setLoadingAudits(true)
            setAuditsAllFilters({
                ...auditsAllFilters,
                dateFrom: e.target.value
            })
            
            getAudits(1, auditsAllFilters.resource, e.target.value, auditsAllFilters.dateUntil)
        }
    };

    // executes when user selects date until
    const handleAuditsDateUntilChange = (e) => {
        if (!forDashboard) {
            setLoadingAudits(true)
            setAuditsAllFilters({
                ...auditsAllFilters,
                dateUntil: e.target.value
            })

            console.log(e.target.value)
            
            getAudits(1, auditsAllFilters.resource, auditsAllFilters.dateFrom, e.target.value)
        }
    };

    // executes when user click previous button for audits
    const handlePreviousAudits = () => {
        setLoadingAudits(true)
        if (forDashboard) {
            getAudits(auditsToday.current_page - 1, auditsTodayResource, undefined, undefined)
        } else {
            getAudits(auditsToday.current_page - 1, {...auditsAllFilters, resource}, auditsAllFilters.dateFrom, auditsAllFilters.dateUntil)
        }
    };

    // executes when user click next button for audits
    const handleNextAudits = () => {
        setLoadingAudits(true)
        if (forDashboard) {
            getAudits(auditsToday.current_page + 1, auditsTodayResource, undefined, undefined)
        } else {
            getAudits(auditsToday.current_page + 1, {...auditsAllFilters, resource}, auditsAllFilters.dateFrom, auditsAllFilters.dateUntil)
        }
    };

    // executes when button for audits download is clicked
    const handleAuditsDownload = async () => {
        forDashboard ? setLoadingAuditsTodayDownload(true) : setLoadingAuditsAllDownload(true)

        let fetchUrl = `/api/audits/download?`

        if (forDashboard) {
            fetchUrl += `date_from=${dateToday}`
    
            if (!(auditsTodayResource.trim() === "")) {
                fetchUrl += `&resource=${resource}`
            }
        }  else {
            const dateFrom = auditsAllFilters.dateFrom
            const dateUntil = auditsAllFilters.dateUntil
            const resource = auditsAllFilters.resource

            if (!(dateFrom.trim() === "")) {
                fetchUrl += `date_from=${dateFrom}`
            }
            if (!(dateUntil.trim() === "")) {
                dateFrom.trim() === "" ? fetchUrl += `` : fetchUrl += `&`
                fetchUrl += `date_until=${dateUntil}`
            }
            if (!(resource.trim() === "")) {
                dateFrom.trim() === "" && dateUntil.trim() === "" ? fetchUrl += `` : fetchUrl += `&`
                fetchUrl += `resource=${resource}`
            }
        }

        const res = await fetch(fetchUrl, {
            headers: {
                'Content-Type': 'application/pdf',
                Authorization: `Bearer ${token}`
            }
        })

        const blob = await res.blob()
        console.log(blob)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `printmed-audits-${dateToday}`
        link.click()

        window.URL.revokeObjectURL(url)

        forDashboard ? setLoadingAuditsTodayDownload(false) : setLoadingAuditsAllDownload(false)
    }

    const resourceValue = forDashboard ? auditsTodayResource : auditsAllFilters.resource

    return (
        <>  
            { audits ? (
                <>
                    <div className={`flex justify-between items-end mb-6 ${!forDashboard ? `mt-12` : ``}`}>
                        <h2 className={`font-bold ${forDashboard ? `text-lg` : `text-2xl`}`}>{forDashboard ? "Audits | Today" : "Audits" }</h2>
                        <div className={`flex justify-end gap-4 items-end`}>
                            {/* select audit resource dropdown */}
                            <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                    name="resource" id="resource" value={resourceValue} onChange={handleAuditsResourceChange}>
                            <option value="">Select resource</option>
                            <option value="user">User</option>
                            <option value="patient">Patient</option>
                            <option value="consultation record">Consultation Record</option>
                            <option value="payment">Payment</option>
                            </select>

                            {!forDashboard ? (
                                <>
                                    {/* date from */}
                                    <div>
                                        <label htmlFor="dateFrom" className='text-xs block mb-1'>Date From</label>
                                        <input
                                            type="date"
                                            name="dateFrom"
                                            value={auditsAllFilters.dateFrom}
                                            onChange={handleAuditsDateFromChange}
                                            max={dateToday}
                                            className='block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                        />
                                    </div>

                                    {/* date until */}
                                    <div>
                                        <label htmlFor="dateUntil" className='text-xs block mb-1'>Date Until</label>
                                        <input
                                            type="date"
                                            name="dateUntil"
                                            value={auditsAllFilters.dateUntil}
                                            onChange={handleAuditsDateUntilChange}
                                            min={auditsAllFilters.dateFrom !== "" ? auditsAllFilters.dateFrom : ''}
                                            max={dateToday}
                                            className='block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                                        />
                                    </div>
                                </>
                            ) : (<></>)}

                            {/* pagination buttons */}
                            <div>
                                <button className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${audits.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`} 
                                        disabled={audits.current_page <= 1} onClick={handlePreviousAudits}>
                                    &lt;
                                </button>
                                <button className={`px-4 h-8 border border-[#6CB6AD] text-sm`} disabled={true}>
                                    {audits.current_page} OF {audits.last_page}
                                </button>
                                <button className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${audits.current_page === audits.last_page ? 'bg-opacity-70' : ''} text-white text-sm`} 
                                        disabled={audits.current_page === audits.last_page} onClick={handleNextAudits}>
                                    &gt;
                                </button>
                            </div>

                            {/* download audits button */}
                            { audits.data && audits.data.length > 0 && ( 
                                <button className='px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-black font-medium rounded-md hover:bg-[#37c9b8]' onClick={handleAuditsDownload} 
                                        disabled={ forDashboard ? loadingAuditsTodayDownload : loadingAuditsAllDownload }>
                                    { (forDashboard && loadingAuditsTodayDownload) || (!forDashboard && loadingAuditsAllDownload) ? (
                                        <ClipLoader color="#FFFFFF" loading={forDashboard ? loadingAuditsTodayDownload : loadingAuditsAllDownload} size={14} />
                                    ) : ( "Download" ) }
                                </button>
                            )}
                        </div>
                    </div>

                    { loadingAudits ? (
                        <div className='flex justify-center items-center mt-20'>
                            <PulseLoader color="#6CB6AD" loading={loadingAudits} size={15} />
                        </div>
                    ) : (
                        // audits table
                        <AuditsTable forDashboard={ forDashboard } audits={ audits.data } />
                    )}
                </>
            ) : (<></>)}
        </>
    );
};

export default Audits;
