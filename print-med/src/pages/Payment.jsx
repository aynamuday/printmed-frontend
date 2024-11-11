import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../context/AppContext';
//import AdminContext from '../context/AdminContext';
import SecretaryPhysicianContext from '../context/SecretaryPhysicianContext';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { getFormattedDate } from '../utils/dateUtils';

import PaymentTable from '../components/PaymentTable';

const Payment = ({ forDashboard = false }) => {
  const { token } = useContext(AppContext)
  const {
    paymentsToday, 
    setPaymentsToday,
    paymentsTodayResource, 
    setPaymentsTodayResource, 
    loadingPaymentsTodayDownload, 
    setLoadingPaymentsTodayDownload, 
    paymentsAll, 
    setPaymentsAll, 
    paymentsAllFilters, 
    setPaymentsAllFilters, 
    loadingPaymentsAllDownload, 
    setLoadingPaymentsAllDownload
  } = useContext(SecretaryPhysicianContext)
  const [ loadingPayments, setLoadingPayments ] = useState(false);
  const [ loadingPayment, setLoadingPayment ] = useState(false);
  const payments = forDashboard ? paymentsToday : paymentsAll
  const dateToday = getFormattedDate()

  // Fetch the payments
  const getPayments = async (page = 1, resource='', dateFrom='', dateUntil='') => {
    let url = `/api/payments?page=${page}`

    if (forDashboard) {
      url += `&date_from=${dateToday}`

      if (!(resource.trim() === "")) {
          url += `&resource=${resource}`
      }
    } else {
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

    //const url = `/api/payments?page=${pagination.currentPage}&${queryParams.toString()}`;
    //console.log(url)

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()
    console.log(url)
    console.log(data.payments.data)
    forDashboard ? setPaymentsToday(data) : setPaymentsAll(data)

    setLoadingPayment(false)
  }

  useEffect(() => {
    if(payments.length < 1) {
      setLoadingPayment(true)
    }

    if (forDashboard) {
      getPayments(1, paymentsTodayResource, undefined, undefined)
    } else {
      const dateFrom = paymentsAllFilters.dateFrom
      const dateUntil = paymentsAllFilters.dateUntil
      const resource = paymentsAllFilters.resource

      getPayments(1, resource, dateFrom, dateUntil)
    }
  }, [])

  //executes when user selects payment resource
  const handlePaymentsResourceChange = (e) => {
    setLoadingPayments(true)
    if (forDashboard) {
      setPaymentsTodayResource(e.target.value)
      getPayments(1, e.target.value, undefined, undefined)
    } else {
      setPaymentsAllFilters({
        ...paymentsAllFilters,
        resource: e.target.value
      })

      getPayments(1, e.target.value, paymentsAllFilters.dateFrom, paymentsAllFilters.dateUntil)
    }
  };

  //executes when use selects date from
  const handlePaymentsDateFromChange = (e) => {
    if (!forDashboard) {
      setLoadingPayments(true)
      setPaymentsAllFilters({
        ...paymentsAllFilters,
        dateFrom: e.target.value
      })

      getPayments(1, paymentsAllFilters.resource, e.target.value, paymentsAllFilters.dateUntil)
    }
  };

  // executes when user selects date until
  const handlePaymentsDateUntilChange = (e) => {
    if (!forDashboard) {
      setLoadingPayments(true)
      setPaymentsAllFilters({
        ...paymentsAllFilters,
        dateUntil: e.target.value
      })

      console.log(e.target.value)

      getPayments(1, paymentsAllFilters.resource, paymentsAllFilters.dateFrom, e.target.value)
    }
  };

  // executes when user click previous button for payments
  const handlePreviousPayments = () => {
    setLoading(true)
    if (forDashboard) {
      getPayments(paymentsToday.current_page - 1, paymentsTodayResource, undefined, undefined)
    } else {
      getPayments(paymentsToday.current_page - 1, {...paymentsAllFilters, resource}, paymentsAllFilters.dateFrom, paymentsAllFilters.dateUntil)
    }
  }

  //executes when user click the next button for payments
  const handleNextPayments = () => {
    setLoading(true)
    if (forDashboard) {
      getPayments(paymentsToday.current_page + 1, paymentsTodayResource, undefined, undefined)
    } else {
      getPayments(paymentsToday.current_page + 1, {...paymentsAllFilters, resource}, paymentsAllFilters.dateFrom, paymentsAllFilters.dateUntil)
    }
  };

  // executes when button for payments download is clicked
  const handlePaymentsDownload = async () => {
    forDashboard ? setLoadingPaymentsTodayDownload(true) : setLoadingPaymentsAllDownload(true)

    let fetchUrl = `/api/payments/download?`

    if (forDashboard) {
      fetchUrl += `date_from=${dateToday}`

      if (!(paymentsTodayResource.trim() === "")) {
        fetchUrl += `$resource=${resource}`
      }
    } else {
      const dateFrom = paymentsAllFilters.dateFrom
      const dateUntil = paymentsAllFilters.dateUntil
      const resource = paymentsAllFilters.resource

      if (!(dateFrom.trim() === "")) {
        fetchUrl += `date_from`
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
    link.download = `printmed-payments-${dateToday}`
    link.click()

    window.URL.revokeObjectURL(url)

    forDashboard ? setLoadingPaymentsAllDownload(false) :setLoadingPaymentsAllDownload(false)
  }

  const resourceValue = forDashboard ? paymentsTodayResource :paymentsAllFilters.resource

  return (
    <>
      { payments.payments ? (
        <>
          <div className={`flex justify-between items-end mb-6 ${!forDashboard ? `mt-12` : ``}`}>
            <h2 className={`font-bold ${forDashboard ? `text-lg` : `text-2xl`}`}>{forDashboard ? "Payments | Today" : "Payments" }</h2>
            <div className={`flex justify-end gap-4 items-end`}>
              {/* select audit resource dropdown */}
              <select className='px-4 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                      name="resource" id="resource" value={resourceValue} onChange={handlePaymentsResourceChange}>
                <option value="">Select resource</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                </select>

                {!forDashboard ? (
                  <>
                    {/* date from */}
                    <div>
                      <label htmlFor="dateFrom" className='text-xs block mb-1'>Date From</label>
                        <input
                          type="date"
                          name="dateFrom"
                          value={paymentsAllFilters.dateFrom}
                          onChange={handlePaymentsDateFromChange}
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
                          value={paymentsAllFilters.dateUntil}
                          onChange={handlePaymentsDateUntilChange}
                          min={paymentsAllFilters.dateFrom !== "" ? auditsAllFilters.dateFrom : ''}
                          max={dateToday}
                          className='block px-4 py-1.5 h-8 border border-[#6CB6AD] rounded-md bg-white font-medium focus:outline-none' 
                        />
                    </div>
                  </>
                ) : (<></>)}
                {/* pagination buttons */}
                <div>
                  <button className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${payments.current_page === 1 ? 'bg-opacity-70' : ''} text-white text-sm`} 
                          disabled={payments.current_page <= 1} onClick={handlePreviousPayments}>
                    &lt;
                  </button>
                  <button className={`px-4 h-8 border border-[#6CB6AD] text-sm`} disabled={true}>
                          {payments.current_page} OF {payments.last_page}
                  </button>
                  <button className={`px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] ${payments.current_page === payments.last_page ? 'bg-opacity-70' : ''} text-white text-sm`} 
                          disabled={payments.current_page === payments.last_page} onClick={handleNextPayments}>
                    &gt;
                  </button>
                </div>

                {/* download payments button */}
                { payments.data && payments.data.length > 0 && ( 
                  <button className='px-4 h-8 border border-[#6CB6AD] bg-[#6CB6AD] text-black font-medium rounded-md hover:bg-[#37c9b8]' onClick={handlePaymentsDownload} 
                          disabled={ forDashboard ? loadingPaymentsTodayDownload : loadingPaymentsAllDownload }>
                    { (forDashboard && loadingPaymentsTodayDownload) || (!forDashboard && loadingPaymentsAllDownload) ? (
                      <ClipLoader color="#FFFFFF" loading={forDashboard ? loadingPaymentsTodayDownload : loadingPaymentsAllDownload} size={14} />
                    ) : ( "Download" ) }
                  </button>
                )}
            </div>
          </div>

          { loadingPayments ? (
            <div className='flex justify-center items-center mt-20'>
              <PulseLoader color="#6CB6AD" loading={loadingPayments} size={15} />
            </div>
          ) : (
            // payments table
            <PaymentTable forDashboard={ forDashboard } payments={ payments.payments.data } />
          ) }
        </>
      ) : (<></>)}
    </>
  );
};

export default Payment

      