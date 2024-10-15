import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from "./pages/DashboardPage";
import PatientRecordsPage from './pages/PatientRecordsPage';
import AddRecordPage from './pages/AddRecordPage';
import SettingsPage from './pages/SettingsPage';
import Queue from './pages/Queue';
import { UserProvider } from './components/UserContext';



const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<LoginPage />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='patient-records' element={<PatientRecordsPage />} />
        <Route path='add-records' element={<AddRecordPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='queue' element={<Queue />} />
      </Route>
    )
  );

  
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
};

export default App;