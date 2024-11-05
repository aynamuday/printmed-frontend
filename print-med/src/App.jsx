import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from './context/AppContext';
import ProtectedRoute from './ProtectedRoute';

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

const App = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return
  }

  return (
    <BrowserRouter>
      <Routes>
        { !user ? (
          // routes if user IS NOT logged in
          <>
            <Route path='/' element={<Navigate to='login'/>}/>
            <Route path='login' element={<LoginPage/>}/>
            {/* <Route path='reset-password' element={<ResetPasswordPage/>}/> */}
          </>
        ) : (
          // routes if user IS logged in
          <Route element={<ProtectedRoute/>}>
            {/* <Route path='login'element={<Navigate to='/'/>}/> */}
            {/* <Route path='reset-password' element={<Navigate to='/'/>}/> */}

            <Route path='settings' element={<SettingsPage/>}/>
            <Route path='settings/update-email' element={<UpdateEmailPage/>}/>
            <Route path='settings/change-password' element={<ChangePasswordPage/>}/>
            
            { user.role === "admin" ? (
              <>
                <Route path='/' element={<DashboardAdminPage/>}/>
                <Route path='users' element={<UsersPage/>}/>
                <Route path='add-user' element={<AddUserPage/>}/>
                <Route path='departments' element={<DepartmentsPage/>}/>
                <Route path='audits' element={<AuditsPage/>}/>
              </>
            ) : ( user.role === "physician" ? (
              <>
                <Route path='/' element={<DashboardPhysicianSecretaryPage/>}/>
                {/* <Route path='update-patient' element={<UpdatePatientPage/>}/> */}
                <Route path='patient' element={<PatientsPage/>}/>
                <Route path='add-patient' element={<AddPatientPage/>}/>
                <Route path='/payments' element={<Payment />}/>
              </>
            ) : ( user.role === "secretary" ? (
              <>
                <Route path='/' element={<DashboardPhysicianSecretaryPage/>}/>
                <Route path='patients' element={<PatientsPage/>}/>
                <Route path='add-patient' element={<AddPatientPage/>}/>
                {/* <Route path='payments' element={<PaymentsPage/>}/> */}
              </>
            ) : ( user.role === "queue manager" ? (
              <>
                <Route path='/' element={<Queue/>}/>
              </>
            ) : ( <Navigate to="/" /> ) ) ) ) }
          </Route>
        ) }

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
