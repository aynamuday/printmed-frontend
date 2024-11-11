import React from 'react';

const PatientTable = ({ patients }) => {
    return (
        <div className="patient-table">
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Patient's Name</th>
                        <th className="border px-4 py-2">Patient's Number</th>
                        <th className="border px-4 py-2">HMO</th>
                        <th className="border px-4 py-2">Total Payment</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="border px-4 py-2">{patient.name}</td>
                                <td className="border px-4 py-2">{patient.patient_number}</td>
                                <td className="border px-4 py-2">{patient.hmo}</td>
                                <td className="border px-4 py-2">{patient.total_payment}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="border text-center px-4 py-2">
                                No patients found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;
