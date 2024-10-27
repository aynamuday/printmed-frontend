const FindingsList = ({ findings, onAddFinding, onViewFinding }) => (
    <div className="mt-2">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-2">Presumption</th>
            <th className="text-left p-2">Date Consulted</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((finding, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{finding.presumption}</td>
              <td className="p-2">{finding.dateConsulted}</td>
              <td className="p-2">
                <button onClick={() => onViewFinding(finding)} className="text-blue-600 underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  export default FindingsList;
  