import React from 'react'

const DashboardCard = ({name, value}) => {
  return (
    <>
        <div className="bg-[#D9D9D9] bg-opacity-75 shadow rounded-lg p-4 text-center flex flex-col items-center justify-center min-h-[8rem] sm:min-h-[10rem]">
            <h2 className="font-bold text-lg">{name}</h2>
            <p className="text-4xl sm:text-6xl md:text-7xl font-medium">{value}</p>
        </div>
    </>
  )
}

export default DashboardCard