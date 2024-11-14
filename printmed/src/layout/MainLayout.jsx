import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
        <Header />
        <Sidebar />
        <Outlet />
    </>
  );
};

export default MainLayout