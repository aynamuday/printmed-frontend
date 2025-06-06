import React from 'react';

const VitalSignsTable = ({ vitalSigns }) => {
  return (
    <div className="w-full bg-white overflow-x-auto rounded-lg shadow-sm">
      <div className="hidden md:block">
        <table className="w-full text-left border border-black border-collapse">
          <tbody>
            <tr>
              <th className="border border-[#828282] p-2 w-[15%]">Height</th>
              <td className="border border-[#828282] p-2 w-[20%]">
                {vitalSigns.height} {vitalSigns.height_unit}
              </td>
              <th className="border border-[#828282] p-2 w-[15%]">Weight</th>
              <td className="border border-[#828282] p-2 w-[35%]">
                {vitalSigns.weight} {vitalSigns.weight_unit}
              </td>
            </tr>
            <tr>
              <th className="border border-[#828282] p-2 w-[15%]">Temperature</th>
              <td className="border border-[#828282] p-2 w-[20%]">
                {vitalSigns.temperature} &#176;C
              </td>
              <th className="border border-[#828282] p-2 w-[25%]">Blood Pressure</th>
              <td className="border border-[#828282] p-2 w-[35%]">
                {vitalSigns.systolic}/{vitalSigns.diastolic}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden grid gap-3 p-2">
        <div className="flex justify-between border border-[#828282] p-2">
          <span className="font-semibold">Height:</span>
          <span>{vitalSigns.height} {vitalSigns.height_unit}</span>
        </div>
        <div className="flex justify-between border border-[#828282] p-2">
          <span className="font-semibold">Weight:</span>
          <span>{vitalSigns.weight} {vitalSigns.weight_unit}</span>
        </div>
        <div className="flex justify-between border border-[#828282] p-2">
          <span className="font-semibold">Temperature:</span>
          <span>{vitalSigns.temperature} &#176;C</span>
        </div>
        <div className="flex justify-between border border-[#828282] p-2">
          <span className="font-semibold">Blood Pressure:</span>
          <span>{vitalSigns.systolic}/{vitalSigns.diastolic}</span>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsTable;
