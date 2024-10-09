import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
// import Cards from "./components/Cards";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import MainLayout from './layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from "./pages/DashboardPage";
import PatientRecordsPage from './pages/PatientRecordsPage';



const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<LoginPage />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='patient-records' element={<PatientRecordsPage />} />
      </Route>
    )
  );

  
  return <RouterProvider router={router} />;
};

export default App;