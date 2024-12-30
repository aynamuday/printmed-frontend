
import { Outlet } from 'react-router-dom';
import Header from "./Header";
import Sidebar from "./Sidebar";

const Settings = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[75%] md:ml-[22%] mt-[10%] mb-12">
        <div className="flex flex-col items-center justify-center mt-10 bg-[#98e6dd] bg-opacity-50 p-10 rounded-lg shadow-lg min-h-80">
          { children }
        </div>
      </div>
    </>
  );
};

export default Settings;