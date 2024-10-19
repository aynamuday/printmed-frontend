import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useUser } from '../components/UserContext'; // Import the context

const SettingsPage = () => {
  const { currentUser } = useUser(); // Access the currentUser

  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[70%] md:ml-[25%]">
        <div className="flex flex-col items-center justify-center mt-10 bg-[#6CB6AD] p-10 rounded-lg shadow-lg">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {/* <img src={profilePic} alt="Profile" className="object-cover w-full h-full" /> */}
          </div>

          {/* User Details */}
          {currentUser ? (
            <>
              <h2 className="text-lg font-bold mt-4">DOC. {currentUser.username.toUpperCase()}</h2>
              <p className="text-gray-500">{currentUser.username}@doctor.crm.ph</p>
              <p className="mt-2 text-gray-700">
                <strong>Specialization:</strong> Pediatrics
              </p>
              <p className="text-gray-700">
                <strong>Room Assigned:</strong> Room 203 | 3rd Floor
              </p>

              {/* Change Password Button */}
              <button className="mt-6 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                Change Password
              </button>
            </>
          ) : (
            <p>No user logged in.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
