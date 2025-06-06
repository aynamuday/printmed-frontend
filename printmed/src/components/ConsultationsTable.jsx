import React, { useContext } from 'react'
import { getFormattedNumericDate } from '../utils/dateUtils'

import PhysicianContext from '../context/PhysicianContext'

const ConsultationsTable = ({consultations}) => {
    const { setConsultationComponentStatus, setViewConsultationId } = useContext(PhysicianContext)

    return (
        <div className='w-full overflow-x-auto'>
            <table className="min-w-full border-collapse border border-black bg-white text-start text-sm sm:text-base">
                <thead>
                    <tr>
                        <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[35%] text-sm md:text-base">Chief Complaint</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[35%] text-sm md:text-base">Primary Diagnosis</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[30%] text-sm md:text-base">Date</th>
                    </tr>
                </thead>
                <tbody>
                { consultations && consultations.length !== 0 ? (
                    consultations.map((item, index) => (
                        <tr key={index} onClick={() => {setViewConsultationId(item.id); setConsultationComponentStatus("view");}} className='cursor-pointer bg-white hover:text-red-600'>
                            <td className="border p-2 border-[#828282] text-center text-sm md:text-base">{item.chief_complaint}</td>
                            <td className="border p-2 border-[#828282] text-center text-sm md:text-base">{item.primary_diagnosis}</td>
                            <td className="border p-2 border-[#828282] text-center text-sm md:text-base">{getFormattedNumericDate(item.created_at)}</td>
                        </tr>
                    ))) : (
                        <tr>
                            <td colSpan="7" className="border p-2 border-[#828282] text-center">No previous consultations</td>
                        </tr>
                    )}
                </tbody>
            </table> 
        </div>
    )
}

export default ConsultationsTable