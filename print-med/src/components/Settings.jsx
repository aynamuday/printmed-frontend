
import { Outlet } from 'react-router-dom';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Settings = ({ children }) => {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="w-full md:w-[70%] md:ml-[25%]">
        <div className="flex flex-col items-center justify-center mt-10 bg-[#6CB6AD] bg-opacity-50 p-16 rounded-lg shadow-lg min-h-80">
          { children }
        </div>
      </div>
    </>
  );
};

export default Settings;