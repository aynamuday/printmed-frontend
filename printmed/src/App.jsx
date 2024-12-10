import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from './context/AppContext';
import ProtectedRoute from './ProtectedRoute';

import { AdminProvider } from './context/AdminContext';
import { PhysicianProvider } from './context/PhysicianContext';
import { SecretaryProvider } from './context/SecretaryContext';

import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UpdateEmailPage from './pages/UpdateEmailPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

import EditProfilePage from './pages/EditProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AuditsPage from './pages/AuditsPage';

import PatientPagePhysician from './pages/PatientPagePhysician';

import PatientsPage from './pages/PatientsPage';
import PatientPageSecretary from './pages/PatientPageSecretary';
import AddPatientPage from './pages/AddPatientPage';
import RegistrationsPage from './pages/RegistrationsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

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

  const adminRoutes = (
    <>
      <Route path='/' element={<AdminDashboardPage/>}/>
      <Route path='users' element={<UsersPage/>}/>
      <Route path='users/:userId' element={<UserPage/>}/>
      <Route path='add-user' element={<UserPage/>}/>
      <Route path='audits' element={<AuditsPage/>}/>
    </>
  )

  let roleBasedRoutes;

  if (user) {
    if (user.role == "super admin") {
      roleBasedRoutes = (
        <Route element={<AdminProvider />}>
          <Route path='departments' element={<DepartmentsPage/>}/> &&
          <Route path='settings/edit-profile' element={<EditProfilePage />}/>
          { adminRoutes }
          { generalRoutes }
        </Route>
      )
    } else if (user.role === "admin") {
      roleBasedRoutes = (
        <Route element={<AdminProvider />}>
          { adminRoutes }
          { generalRoutes }
        </Route>
      )
    } else if (user.role === "physician") {
      roleBasedRoutes = (
        <Route element={<PhysicianProvider />}>
          <Route path='/' element={<PatientPagePhysician/>}/>
          { generalRoutes }
        </Route>
      )
    } else if (user.role === "secretary") {
      roleBasedRoutes = (
        <Route element={<SecretaryProvider />}>
          <Route path='/' element={<PatientsPage/>}/>
          <Route path='patient' element={<PatientPageSecretary/>}/>
          <Route path='registrations' element={<RegistrationsPage/>}/>
          <Route path='add-patient' element={<AddPatientPage/>}/>
          { generalRoutes }
        </Route>
      )
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='register' element={<RegistrationPage />} />
        
        {/* if user is NOT logged in */}
        { !user ? (
          <>
            <Route path='/' element={<LandingPage />}/>
            <Route path='login' element={<LoginPage />}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </>
        ) : (
          // routes if user is logged in
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