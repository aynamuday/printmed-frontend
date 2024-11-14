import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from './context/AppContext';
import ProtectedRoute from './ProtectedRoute';

import { AdminProvider } from './context/AdminContext';
import { SecretaryPhysicianProvider } from './context/SecretaryPhysicianContext';
import { PhysicianProvider } from './context/PhysicianContext';

import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import UpdateEmailPage from './pages/UpdateEmailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AuditsPage from './pages/AuditsPage';

import PatientsPage from './pages/PatientsPage';
import PatientPage from './pages/PatientPage';
import AddPatientPage from './pages/AddPatientPage';

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
          <Route path='/' element={<AdminDashboardPage/>}/>
          <Route path='users' element={<UsersPage/>}/>
          <Route path='add-user' element={<UserPage/>}/>
          <Route path='view-user/:userId' element={<UserPage/>}/>
          <Route path='departments' element={<DepartmentsPage/>}/>
          <Route path='audits' element={<AuditsPage/>}/>
          { generalRoutes }
        </Route>
      )
    } else if (user.role === "physician") {
      roleBasedRoutes = (
        <Route element={<PhysicianProvider />}>
          <Route element={<SecretaryPhysicianProvider />}>
            <Route path='/' element={<PatientsPage/>}/>
            <Route path='patient' element={<PatientPage/>}/>
            <Route path='add-patient' element={<AddPatientPage/>}/>
            { generalRoutes }
          </Route>
        </Route>
      )
    } else if (user.role === "secretary") {
      roleBasedRoutes = (
        <Route element={<SecretaryPhysicianProvider />}>
          <Route path='/' element={<PatientsPage/>}/>
          <Route path='add-patient' element={<AddPatientPage/>}/>
          { generalRoutes }
        </Route>
      )
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* if user is NOT logged in */}
        { !user ? (
          <>
            <Route path='/' element={<Navigate to='register'/>}/>
            <Route path='login' element={<LoginPage />}/>
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