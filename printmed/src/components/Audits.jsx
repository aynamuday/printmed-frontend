import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
import AdminContext from '../context/AdminContext';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { getFormattedNumericDate } from '../utils/dateUtils';

import AuditsTable from './AuditsTable';
import { echo as Echo } from '../utils/pusher/echo';
import Pusher from 'pusher-js';
import { showError } from '../utils/fetch/showError';
import { showWarning } from '../utils/fetch/showWarning';

window.pusher = Pusher

const Audits = ({ forDashboard = false }) => {
    const { user, token } = useContext(AppContext)
    const { 
        auditsToday, 
        setAuditsToday,
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
    const dateToday = getFormattedNumericDate()
    const [auditsDownloadFilters, setAuditsDownloadFilters] = useState({
        dateFrom: '',
        dateUntil: ''
    })
    const [showDownloadPopup, setShowDownloadPopup] = useState(false)
    const [downloadError, setDownloadError] = useState('')
    const [dateError, setDateError] = useState('')

    useEffect(() => {
        if(audits.length < 1) {
            setLoadingAudits(true)
        }

        const page = audits.data ? audits.current_page : 1
        if (forDashboard) {
            getAudits(page, undefined, undefined, undefined)
        }  else {
            const dateFrom = auditsAllFilters.dateFrom
            const dateUntil = auditsAllFilters.dateUntil
            const resource = auditsAllFilters.resource

            getAudits(page, resource, dateFrom, dateUntil)
        }


        const echo = Echo(token)
        echo.private('audit')
            .listen('AuditNew', (e) => {
                const newAudit = e.audit

                if (auditsToday.current_page == 1) {
                    setAuditsToday((prevState) => {
                        const exists = prevState.data.some(item => item.id === newAudit.id);
                        if (exists) {
                            return prevState;
                        }
            
                        const updatedData = [newAudit, ...prevState.data]
                        if (updatedData > 20) {
                            updatedData.pop()
                        }
            
                        return {
                            ...prevState, data: updatedData, total: prevState.total+1
                        }
                    })
                }

                if (auditsAll.current_page == 1 && (auditsAllFilters.dateUntil.trim() == "" || getFormattedNumericDate(auditsAllFilters.dateUntil) == getFormattedNumericDate())) {
                    setAuditsAll((prevState) => {
                        const exists = prevState.data.some(item => item.id === newAudit.id);
                        if (exists) {
                            return prevState;
                        }
            
                        const updatedData = [newAudit, ...prevState.data]
                        if (updatedData > 20) {
                            updatedData.pop()
                        }
            
                        return {
                            ...prevState, data: updatedData, total: prevState.total+1
                        }
                    })
                }
            })

        return () => {
            echo.leave('audit')
        }
    }, [])

    useEffect(() => {
        if (forDashboard) {
            const lastPage = Math.ceil(auditsToday.total / auditsToday.per_page)

            if (lastPage != auditsToday.last_page && lastPage > 1) {
                setAuditsToday({...auditsToday, last_page: lastPage})
            }
        } else {
            const lastPage = Math.ceil(auditsAll.total / auditsAll.per_page)

            if (lastPage != auditsAll.last_page && lastPage > 1) {
                setAuditsAll({...auditsAll, last_page: lastPage})
            }
        }
    }, [auditsToday.total, auditsAll.total])

    // fetch the audits
    const getAudits = async (page = 1, resource='', dateFrom='', dateUntil='') => {
        let url = `/api/audits?page=${page}`

        if (forDashboard) {
            url += `&date_from=${dateToday}`
    
            // if (!(resource.trim() === "")) {
            //     url += `&resource=${resource}`
            // }
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

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error("An error occurred while fetching the audits. You may refresh to try again.")
            }

            forDashboard ? setAuditsToday(data) : setAuditsAll(data)
        } catch (err) {
            showError(err)
        } finally {
            setLoadingAudits(false)
        }
    }

    // executes when user selects audit resource
    // const handleAuditsResourceChange = (e) => {
    //     setLoadingAudits(true)

    //     // if (forDashboard) {
    //     //     setAuditsTodayResource(e.target.value)
    //     //     getAudits(1, e.target.value, undefined, undefined)
    //     // } else {
    //     setAuditsAllFilters({
    //         ...auditsAllFilters,
    //         resource: e.target.value
    //     })
        
    //     getAudits(1, e.target.value, auditsAllFilters.dateFrom, auditsAllFilters.dateUntil)
    //     // }
    // };

    // executes when user selects date from
    const handleAuditsDateFromChange = (e) => {
        if (!forDashboard) {
            const value = e.target.value

            if ((auditsAllFilters.dateUntil !== "" && (new Date(value) > new Date(auditsAllFilters.dateUntil))) || (new Date(value) > new Date())) {
                showWarning("Maximum date is today and 'date until' must be greater than 'date from'.")
                return
            }

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
            const value = e.target.value

            if ((auditsAllFilters.dateFrom !== "" && (new Date(value) < new Date(auditsAllFilters.dateFrom)) )|| (new Date(value) > new Date())) {
                showWarning("Maximum date is today and 'date until' must be greater than 'date from'.")
                return
            }

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
            getAudits(auditsToday.current_page - 1, undefined, undefined, undefined)
        } else {
            getAudits(auditsAll.current_page - 1, auditsAllFilters.resource, auditsAllFilters.dateFrom, auditsAllFilters.dateUntil)
        }
    };

    // executes when user click next button for audits
    const handleNextAudits = () => {
        setLoadingAudits(true)

        if (forDashboard) {
            getAudits(auditsToday.current_page + 1, undefined, undefined, undefined)
        } else {
            getAudits(auditsAll.current_page + 1, auditsAllFilters.resource, auditsAllFilters.dateFrom, auditsAllFilters.dateUntil)
        }
    };

    // executes when button for audits download is clicked
    const handleAuditsDownload = async (e) => {
        e.preventDefault()
        setDownloadError('')

        const monthAfterDateFrom = getFormattedNumericDate(new Date(auditsDownloadFilters.dateFrom).setMonth(new Date(auditsDownloadFilters.dateFrom).getMonth() + 1))
        if (new Date(auditsDownloadFilters.dateUntil) > monthAfterDateFrom) {
            setDownloadError("Date until must be maximum of one month from 'date from'.")
            return
        }

        setShowDownloadPopup(false)
        forDashboard ? setLoadingAuditsTodayDownload(true) : setLoadingAuditsAllDownload(true)

        let fetchUrl = `/api/audits/download?`

        if (forDashboard) {
            fetchUrl += `date_from=${dateToday}`
    
            // if (!(auditsTodayResource.trim() === "")) {
            //     fetchUrl += `&resource=${resource}`
            // }
        }  else {
            const dateFrom = auditsDownloadFilters.dateFrom
            const dateUntil = auditsDownloadFilters.dateUntil

            if (!(dateFrom.trim() === "")) {
                fetchUrl += `date_from=${dateFrom}`
            }
            if (!(dateUntil.trim() === "")) {
                dateFrom.trim() === "" ? fetchUrl += `` : fetchUrl += `&`
                fetchUrl += `date_until=${dateUntil}`
            }
            // if (!(resource.trim() === "")) {
            //     dateFrom.trim() === "" && dateUntil.trim() === "" ? fetchUrl += `` : fetchUrl += `&`
            //     fetchUrl += `resource=${resource}`
            // }
        }

        try {
            const res = await fetch(fetchUrl, {
                headers: {
                    'Content-Type': 'application/pdf',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw new Error("Something went wrong. Please try again later.")
            }

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `printmed-audits-${dateToday}`
            link.click()

            window.URL.revokeObjectURL(url)

            forDashboard ? setLoadingAuditsTodayDownload(false) : setLoadingAuditsAllDownload(false)
        } catch (err) {
            showError(err)
        } finally {
            setLoadingAudits(false)
        }
    }

    const handleClear = () => {
        setLoadingAudits(true)
    
        if (forDashboard) {
            getAudits(1, undefined, undefined, undefined)
        } else {
            setAuditsAllFilters({
                ...auditsAllFilters,
                resource: '',
                dateFrom: '',
                dateUntil: ''
            })

            getAudits(1, undefined, undefined, undefined)
        }
    };

    return (
        <>  
        {/* pop up for downloads*/}
          {showDownloadPopup  && (
            <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
              <div className="bg-white rounded-md flex flex-col pt-6 pb-8 px-6 sm:px-8 w-full max-w-lg sm:max-w-[30%] max-h-[70vh] overflow-y-auto">
                <p className="text-center font-bold text-lg text-black">Please specify the date of audits you want to download.</p>
                <p className="text-center">You may download a maximum of one month of audits.</p>
                <form onSubmit={(e) => handleAuditsDownload(e)} className='flex items-center justify-center mt-4 flex-col'>
                    <div className="w-full sm:w-auto">
                        <label htmlFor="dateFrom" className='mb-1 mr-2 text-sm'>Date From</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={auditsDownloadFilters.dateFrom}
                            onChange={(e) => (setAuditsDownloadFilters({...auditsDownloadFilters, dateFrom: e.target.value}))}
                            min="2024-11-05"
                            max={dateToday}
                            className='px-4 py-1.5 h-10 border border-black rounded-md bg-white font-medium focus:outline-none w-full' 
                            required
                        />
                    </div>
                    <div className="w-full sm:w-auto mt-2">
                        <label htmlFor="dateFrom" className='mb-1 mr-2 text-sm'>Date Until</label>
                        <input
                            type="date"
                            name="dateFrom"
                            value={auditsDownloadFilters.dateUntil}
                            onChange={(e) => (setAuditsDownloadFilters({...auditsDownloadFilters, dateUntil: e.target.value}))}
                            min={auditsDownloadFilters.dateFrom}
                            max={dateToday}
                            className='px-4 py-1.5 h-10 border border-black rounded-md bg-white font-medium focus:outline-none w-full' 
                            required
                        />
                    </div>
                    {downloadError && <p className='text-sm text-red-500'>{downloadError}</p>}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full">
                        <button 
                            type='submit' 
                            className="w-full sm:w-auto py-2 px-4 bg-[#248176] hover:bg-blue-600 text-white rounded-md text-center"
                        >
                            Continue
                        </button>
                        <button 
                            type='button' 
                            onClick={() => setShowDownloadPopup(false)} 
                            className="w-full sm:w-auto py-2 px-4 bg-[#b33c39] hover:bg-[#e34441] text-white rounded-md text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
              </div>
            </div>)}

            <div>
                <h2 className={`font-bold text-2xl`}>{forDashboard ? "Audits | Today" : "Audits" }</h2>
                <div className="flex flex-col gap-4 sm:flex-row-reverse sm:justify-between sm:items-end mb-6 mt-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap w-full sm:w-auto">
                        {!forDashboard && (
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full sm:w-auto">
                            {/* Date From */}
                            <div className="flex flex-col">
                                <label htmlFor="dateFrom" className="text-xs mb-1">Date From</label>
                                <input
                                    type="date"
                                    name="dateFrom"
                                    value={auditsAllFilters.dateFrom}
                                    onChange={handleAuditsDateFromChange}
                                    min="2024-11-05"
                                    max={dateToday}
                                    className="px-4 py-1.5 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none"
                                />
                            </div>

                            {/* Date Until */}
                            <div className="flex flex-col">
                            <label htmlFor="dateUntil" className="text-xs mb-1">Date Until</label>
                            <input
                                type="date"
                                name="dateUntil"
                                value={auditsAllFilters.dateUntil}
                                onChange={handleAuditsDateUntilChange}
                                min={auditsAllFilters.dateFrom !== "" ? auditsAllFilters.dateFrom : "2024-11-05"}
                                max={dateToday}
                                className="px-4 py-1.5 h-8 border border-[#248176] rounded-md bg-white font-medium focus:outline-none"
                            />
                            </div>
                        </div>
                        )}

                        {/* Pagination + Download + Clear */}
                        {audits.data && audits.data.length > 0 && (
                        <div className="flex flex-row sm:flex-row gap-4 sm:items-end w-full sm:w-auto">
                            {/* Pagination */}
                            <div className="flex items-center text-xs sm:text-sm md:text-base">
                                <button
                                    className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${audits.current_page === 1 ? 'bg-opacity-70' : ''} text-white rounded`}
                                    disabled={audits.current_page <= 1}
                                    onClick={handlePreviousAudits}
                                >
                                    &lt;
                                </button>
                                <button className="px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-white text-[#248176] font-medium rounded" disabled>
                                    {audits.current_page} OF {audits.last_page}
                                </button>
                                <button
                                    className={`px-2 sm:px-3 md:px-4 h-8 border border-[#248176] bg-[#248176] ${audits.current_page === audits.last_page ? 'bg-opacity-70' : ''} text-white rounded`}
                                    disabled={audits.current_page === audits.last_page}
                                    onClick={handleNextAudits}
                                >
                                    &gt;
                                </button>
                            </div>

                            {/* Download button */}
                            {user.role === "super admin" && !forDashboard && (
                            <div className="flex items-center">
                                <button
                                    className="px-4 h-8 border border-[#248176] bg-[#248176] text-white font-medium rounded-md hover:bg-[#418981] w-full sm:w-auto"
                                    onClick={() => setShowDownloadPopup(true)}
                                    disabled={forDashboard ? loadingAuditsTodayDownload : loadingAuditsAllDownload}
                                >
                                    {(forDashboard && loadingAuditsTodayDownload) || (!forDashboard && loadingAuditsAllDownload) ? (
                                    <ClipLoader color="#FFFFFF" loading={forDashboard ? loadingAuditsTodayDownload : loadingAuditsAllDownload} size={14} />
                                    ) : (
                                    "Download"
                                    )}
                                </button>
                            </div>
                            )}

                            {/* Clear button */}
                            <div className="flex items-center">
                                <button
                                    onClick={handleClear}
                                    className="px-4 h-8 border border-[#248176] rounded-sm bg-[#248176] text-white text-sm"
                                >
                                    <i className="bi bi-arrow-clockwise text-xl"></i>
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            { loadingAudits ? (
                <div className='flex justify-center items-center mt-20'>
                    <PulseLoader color="#6CB6AD" loading={loadingAudits} size={15} />
                </div>
            ) : (
                <AuditsTable forDashboard={ forDashboard } audits={ audits.data } />
            )}
        </>
    );
};

export default Audits;
