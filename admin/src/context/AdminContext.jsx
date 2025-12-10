import axios from "axios";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData ,setdashData]=useState(false);

    const backendUrl = 'https://hms-backend-p6a4.onrender.com';

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message || 'Failed to fetch doctors');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`,
                { docId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success(data.message || 'Doctor availability updated successfully');
                getAllDoctors();
            } else {
                toast.error(data.message || 'Failed to update doctor availability');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const getAllappointments = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/all-appointments`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (data.success) {
                setAppointments(data.appointments);
                console.log(data.appointments);
            } else {
                toast.error(data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const Appointmentcancel =async (appointmentId) => {

        try {
            
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message || 'Appointment cancelled successfully');
                getAllappointments();
            } else {
                toast.error(data.message || 'Failed to cancel appointment');
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            
        }

    }

    const getDashData =async()=>{
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/dashboard`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (data.success) {
                setdashData(data.dashData)
                console.log(data.dashData);
            }
            else{
                toast.error(data.message);
            }




        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    // ✅ VALUE MUST BE OUTSIDE FUNCTIONS
    const value = {
        token,
        setToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllappointments,
        Appointmentcancel,getDashData,dashData
    };

    // ✅ RETURN THE CONTEXT PROVIDER HERE
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
