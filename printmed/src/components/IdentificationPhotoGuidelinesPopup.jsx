import React from 'react';

const IdentificationPhotoGuidelinesPopup = ({ isOpen, onClose, isInvalidPhoto }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 w-fit max-w-[80%] lg:max-w-[30%] max-h-[80vh] rounded-lg shadow-lg overflow-y-auto">
        <div className="relative">
          <button onClick={onClose} className="text-2xl absolute -right-1 -top-2 bg-gray-200 px-2 py-1 rounded-full">
              <i className='bi bi-x'></i>
          </button>

          {isInvalidPhoto ? (
            <>
              <i className="bi bi-exclamation-circle block text-red-600 text-center text-4xl"></i>
              <h3 className="text-xl font-bold text-center text-red-600">Invalid Photo</h3>
              <p className="text-center mb-4">Patient record unsuccessfully created.</p>
              <hr className="my-2 mb-4 border-t border-black" />
              <p className="text-xl font-bold text-center mb-2">Identification Photo Guidelines</p>
            </>
          ): (
              <h3 className="text-xl font-bold text-center mb-4">Identification Photo Guidelines</h3>
          )}
        </div>

        <table className="w-full table-fixed border-separate border-spacing-y-2 align-top">
          <tbody>
            <tr>
              <td className="align-text-top font-bold text-lg">•</td>
              <td className="w-11/12 text-base"><span className="font-bold">Face Forward </span><br /> Have the patient face the camera directly—no tilting up/down or turning sideways.</td>
            </tr>
            <tr>
              <td className="align-text-top font-bold text-lg">•</td>
              <td className="w-11/12 text-base"><span className="font-bold">Even Lighting </span><br /> Ensure the face is well-lit with flat, even lighting. Avoid shadows, glare, or harsh contrast.</td>
            </tr>
            <tr>
              <td className="align-text-top font-bold text-lg">•</td>
              <td className="w-11/12 text-base"><span className="font-bold">No Obstructions</span><br />Remove any items that cover the face, such as masks, headbands, or sunglasses.</td>
            </tr>
            <tr>
              <td className="align-text-top font-bold text-lg">•</td>
              <td className="w-11/12 text-base"><span className="font-bold">Centered and Large Face</span><br /> Make sure the face is centered and takes up a large portion of the image.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IdentificationPhotoGuidelinesPopup;
