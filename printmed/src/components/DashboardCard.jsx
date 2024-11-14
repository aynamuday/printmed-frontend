import React from 'react'

const DashboardCard = ({name, value}) => {
  return (
    <>
        <div className="bg-[#D9D9D9] bg-opacity-75 shadow rounded-lg p-4 text-center">
            <h2 className="font-bold text-lg">{name}</h2>
            <p className="text-8xl font-medium">{value}</p>
        </div>
    </>
  )
}

export default DashboardCard