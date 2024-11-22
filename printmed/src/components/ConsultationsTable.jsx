import React, { useContext } from 'react'
import { getFormattedNumericDate } from '../utils/dateUtils'

import PhysicianContext from '../context/PhysicianContext'

const ConsultationsTable = ({consultations}) => {
    const { setConsultationComponentStatus, setViewConsultationId } = useContext(PhysicianContext)

    return (
        <div>
            <table className="min-w-full border border-spacing-0 border-gray-300">
                <thead>
                    <tr>
                        <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[40%]">Chief Complaint</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[40%]">Primary Diagnosis</th>
                        <th className="bg-[#D9D9D9] border border-[#828282] p-2 text-center w-[20%]">Date</th>
                    </tr>
                </thead>
                <tbody>
                { consultations ? (
                    consultations.map((item) => (
                        <tr key={item.id} onClick={() => {setViewConsultationId(item.id); setConsultationComponentStatus("view");}} className='cursor-pointer bg-white hover:text-red-600'>
                            <td className="border p-2 border-[#828282] text-center">{item.chief_complaint}</td>
                            <td className="border p-2 border-[#828282] text-center">{item.primary_diagnosis}</td>
                            <td className="border p-2 border-[#828282] text-center">{getFormattedNumericDate(item.created_at)}</td>
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