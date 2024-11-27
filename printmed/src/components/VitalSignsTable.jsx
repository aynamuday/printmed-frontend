import React from 'react'

const VitalSignsTable = (vitalSigns) => {
  return (
    <>
        <table className='text-start border-collapse border border-black bg-white w-full break-words'>
            <tbody>
                <tr>
                    <th className='text-start border border-[#828282] p-2 w-[15%]'>Height</th>
                    <td className='border p-2 border-[#828282] w-[20%]'>{ vitalSigns.height + vitalSigns.height_unit }</td>
                    <th className='text-start border border-[#828282] p-2 w-[15%]'>Weight</th>
                    <td className='border p-2 border-[#828282] w-[35%]'>{ vitalSigns.weight + vitalSigns.weight_unit }</td>
                </tr>
                <tr>
                    <th className='text-start border border-[#828282] p-2 w-[15%]'>Temperature</th>
                    <td className='border p-2 border-[#828282] w-[20%]'>{ vitalSigns.temperature } &#176;C</td>
                    <th className='text-start border border-[#828282] p-2 w-[25%]'>Blood Pressure</th>
                    <td className='border p-2 border-[#828282] w-[35%]'>{ vitalSigns.blood_pressure }</td>
                </tr>
            </tbody>
        </table>
    </>
  )
}

export default VitalSignsTable