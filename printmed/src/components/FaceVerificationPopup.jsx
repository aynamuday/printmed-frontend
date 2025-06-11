const FaceVerificationPopup = ({ isOpen, onClose, isSuccessful }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-40'>
        <div className="bg-white rounded-md flex justify-items-center min-w-[25%] flex-col pt-4 pb-8 px-8 max-h-[70vh] overflow-y-auto relative">
            <i onClick={onClose} className="bi bi-x text-3xl absolute right-4 text-gray-600 font-bold cursor-pointer"></i>
            <i className={`bi ${isSuccessful ? "bi-person-check text-[#52a1fd]" : "bi-person-slash text-red-600"} block text-[60px] text-center`}></i>
            <p className="text-center font-bold text-xl text-black">{isSuccessful ? "Verification Successful" : "Face ID Mismatch"}</p>
        </div>
    </div>
  );
};

export default FaceVerificationPopup;
