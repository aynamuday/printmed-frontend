import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppContext from './context/AppContext';
import { useContext } from 'react';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardAdminPage from './pages/DashboardAdminPage';

const App = () => {
  const { user } = useContext(AppContext);

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

            {/* <Route path='profile' element={<DashboardPhysicianSecretaryPage/>}/> */}
            {/* <Route path='update-email' element={<UpdateEmailPage/>}/>
            <Route path='change-password' element={<ChangePasswordPage/>}/> */}
            
            { user.role === "admin" ? (
              <>
                <Route path='/' element={<DashboardAdminPage/>}/>
                {/* <Route path='users' element={<UsersPage/>}/>
                <Route path='add-user' element={<AddUserPage/>}/>
                <Route path='departments' element={<DepartmentsPage/>}/>
                <Route path='audits' element={<AuditsPage/>}/> */}
              </>
            ) : ( user.role === "physician" || user.role === "secretary" ? (
              <>
                {/* <Route path='/' element={<DashboardPhysicianSecretaryPage/>}/> */}
                {/* <Route path='add-patient' element={<AddPatientPage/>}/> */}
              </>
            ) : ( user.role === "physician" ? (
              <>
                {/* <Route path='update-patient' element={<UpdatePatientPage/>}/>
                <Route path='patient' element={<PatientPage/>}/>
                <Route path='payments' element={<PaymentsPage/>}/> */}
              </>
            ) : ( user.role === "secretary" ? (
              <>
                {/* <Route path='patients' element={<PatientsPage/>}/> */}
              </>
            ) : ( user.role === "queue manager" ? (
              <>
                {/* <Route path='/' element={<DashboardQueueManagerPage/>}/> */}
              </>
            ) : ( <Navigate to="/" /> ) ) ) ) ) }
          </Route>
        ) }

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
