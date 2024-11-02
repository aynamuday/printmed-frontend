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

import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import AddAccount from './pages/AddAccount';
import { UserProvider } from './components/UserContext';
import DashboardAdmin from './pages/DashboardAdmin';
import DepartmentPage from './pages/DepartmentPage';
import AuditPage from './pages/AuditPage';
import QueueView from './pages/QueueView';



const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        {/* <Route index element={<LoginPage />} /> */}
        {/* <Route path='dashboard' element={<Dashboard />} /> */}
        <Route index element={<Dashboard />} />
        <Route path='patient-records' element={<PatientRecordsPage />} />
        <Route path='add-records' element={<AddRecordPage />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='queue-view' element={<QueueView />} />
        <Route path='queue' element={<Queue />} />
        <Route path='dashboard-admin' element={<DashboardAdmin />} />
        <Route path='user-management' element={<UserManagement />} />
        <Route path='department' element={<DepartmentPage />} />
        <Route path='reports' element={<Reports />} />
        <Route path='audit' element={<AuditPage/>} />
        <Route path='add-account' element={<AddAccount />} />
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