import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // THIS IMPORT IS CRUCIAL
import Navbar from './components/Navbar';
import Sidebar from './components/sidebar';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';
import AddDoctor from './pages/Admin/AddDoctor';
import AllApointments from './pages/Admin/AllApointments';
import Dashboard from './pages/Admin/DashBoard';
import DoctorList from './pages/Admin/DoctorList';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import Login from './pages/Login';


const App = () => {


  const { token } = useContext(AdminContext)
  const { dtoken } = useContext(DoctorContext)
  const [authReady, setAuthReady] = useState(false);


  useEffect(() => {
    setAuthReady(true); // Ensure component re-renders after context initializes
  }, [token, dtoken]);

  if (!authReady) return null;

  return token || dtoken ? (
    <div className='bg-[#F8F9Fd]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        {/* // Replace the Routes section with: */}
        <Routes>
          {token ? (
            <>
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllApointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-list' element={<DoctorList />} />
              <Route path='*' element={<Navigate to="/admin-dashboard" />} />
            </>
          ) : dtoken ? (
            <>
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appointments' element={<DoctorAppointments />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
              <Route path='*' element={<Navigate to="/doctor-dashboard" />} />
            </>
          ) : null}
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />

    </>

  )
}

export default App
