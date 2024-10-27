const FingerprintModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h3 className="text-lg font-semibold">Confirm with Fingerprint</h3>
        <p>Please scan the patient's fingerprint to confirm the new OPD finding.</p>
        <button onClick={onConfirm} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Verify Fingerprint</button>
        <button onClick={onCancel} className="mt-4 bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
  
  export default FingerprintModal;
  