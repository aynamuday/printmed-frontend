
import { Outlet } from 'react-router-dom';
import Header from "./Header";
import Sidebar from "./Sidebar";

const Settings = ({ children }) => {
  return (
    <>
      <div className="px-4 sm:px-6 mt-4 mb-4">
        <div className="flex flex-col items-center justify-center bg-[#98e6dd] bg-opacity-50 p-10 rounded-lg shadow-lg min-h-80">
          { children }
        </div>
      </div>
    </>
  );
};

export default Settings;