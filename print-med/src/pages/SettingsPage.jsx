import React, { useContext, useState } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UpdateEmailPage from './UpdateEmailPage';
import ChangePasswordPage from './ChangePasswordPage';
import AppContext from '../context/AppContext'; // Adjust the import based on your structure

const SettingsPage = () => {
  const { user } = useContext(AppContext); // Get current user from AppContext
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <>
      <Sidebar />
      <Header />
      
    </>
  );
};

export default SettingsPage;

{/* <div className="w-full md:w-[70%] md:ml-[25%]">
        <div className="flex flex-col items-center justify-center mt-10 bg-[#6CB6AD] p-10 rounded-lg shadow-lg">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {/* Profile Picture *
          </div>

          {user ? (
            <>
              <h2 className="text-lg font-bold mt-4">DOC. {user.username.toUpperCase()}</h2>
              <p className="text-gray-500">{user.email || `${user.username}@doctor.crm.ph`}</p>
              <p className="mt-2 text-gray-700">
                <strong>Specialization:</strong> {user.specialization}
              </p>
              <p className="text-gray-700">
                <strong>Room Assigned:</strong> {user.roomAssigned}
              </p>

              <div className="mt-6 space-y-4 w-full flex flex-col items-center">
                <button
                  onClick={() => setShowUpdateEmail(true)}
                  className="w-48 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Update Email
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-48 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Change Password
                </button>
              </div>
            </>
          ) : (
            <p>No user logged in.</p>
          )}
        </div>

        {showUpdateEmail && <UpdateEmailPage onClose={() => setShowUpdateEmail(false)} />}
        {showChangePassword && <ChangePasswordPage onClose={() => setShowChangePassword(false)} />}
      </div> */}