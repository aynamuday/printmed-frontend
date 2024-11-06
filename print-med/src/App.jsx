import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from './context/AppContext';
import ProtectedRoute from './ProtectedRoute';
import { AdminProvider } from './context/AdminContext';
import { BounceLoader } from 'react-spinners';

import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import UpdateEmailPage from './pages/UpdateEmailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardAdminPage from './pages/DashboardAdminPage';
import UsersPage from './pages/UsersPage';
import AddUserPage from './pages/AddUserPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AuditsPage from './pages/AuditsPage';
import DashboardPhysicianSecretaryPage from './pages/DashboardPhysicianSecretaryPage';
import PatientsPage from './pages/PatientsPage';
import AddPatientPage from './pages/AddPatientPage';
import DashboardQueueManagerPage from './pages/DashboardQueueManagerPage';
import Queue from './pages/Queue';
import RegistrationPage from './pages/RegistrationPage';


const App = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return
  }

  const generalRoutes = (
    <>
      <Route path='settings' element={<SettingsPage/>}/>
      <Route path='settings/update-email' element={<UpdateEmailPage/>}/>
      <Route path='settings/change-password' element={<ChangePasswordPage/>}/>
    </>
  )

  let roleBasedRoutes;

  if (user) {
    if (user.role === "admin") {
      roleBasedRoutes = (
        <Route element={<AdminProvider />}>
          <Route path='/' element={<DashboardAdminPage/>}/>
          <Route path='users' element={<UsersPage/>}/>
          <Route path='add-user' element={<AddUserPage/>}/>
          <Route path='departments' element={<DepartmentsPage/>}/>
          <Route path='audits' element={<AuditsPage/>}/>
          { generalRoutes }
        </Route>
      )
    } else if (user.role === "physician") {
      roleBasedRoutes = (
        <>
          <Route path='/' element={<DashboardPhysicianSecretaryPage/>}/>
          {/* <Route path='update-patient' element={<UpdatePatientPage/>}/> */}
          <Route path='patient' element={<PatientsPage/>}/>
          <Route path='add-patient' element={<AddPatientPage/>}/>
          <Route path='/payments' element={<Payment />}/>
          { generalRoutes }
        </>
      )
    } else if (user.role === "secretary") {
      roleBasedRoutes = (
        <>
          <Route path='/' element={<DashboardPhysicianSecretaryPage/>}/>
          <Route path='patients' element={<PatientsPage/>}/>
          <Route path='add-patient' element={<AddPatientPage/>}/>
          {/* <Route path='payments' element={<PaymentsPage/>}/> */}
          { generalRoutes }
        </>
      )
    } else if (user.role === "queue manager") {
      roleBasedRoutes = (
        <>
          <Route path='/' element={<Queue/>}/>
          { generalRoutes }
        </>
      )
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* if user is NOT logged in */}
        { !user ? (
          <>
            <Route path='/' element={<Navigate to='login'/>}/>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='register' element={<RegistrationPage />} />
            {/* <Route path='reset-password' element={<ResetPasswordPage/>}/> */}
          </>
        ) : (
          // routes if user IS logged in
          <Route element={<ProtectedRoute/>}>
            { roleBasedRoutes }
          </Route>
        ) }
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;