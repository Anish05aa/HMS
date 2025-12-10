import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const DoctorContext = createContext();


const DoctorContextProvider = (props) => {

    const backendUrl = 'https://hms-backend-p6a4.onrender.com';

    const [dtoken, setDToken] = useState(localStorage.getItem('adminToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [dashData,setDashData] = useState(false)
    const [profileData,setProfileData] = useState(false);





    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: {
                    'Authorization': `Bearer ${dtoken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (data.success) {
                setAppointments(data.appointments);//use rev so latest appointment get at first
                console.log(data.appointments);
            }
            else {
                toast.error(data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointments`, // Fixed endpoint
                { appointmentId },
                {
                    headers: {
                        'Authorization': `Bearer ${dtoken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message || "Appointment marked as completed");
                getAppointments();
            } else {
                toast.error(data.message || 'Failed to complete appointment');
            }
        } catch (error) {
            console.error("Error completing appointment:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointments`, // Fixed endpoint
                { appointmentId },
                {
                    headers: {
                        'Authorization': `Bearer ${dtoken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (data.success) {
                toast.success(data.message || "Appointment cancelled");
                getAppointments();
            } else {
                toast.error(data.message || 'Failed to cancel appointment');
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getDashData = async () => {
        try {
            const {data}=await axios.get(`${backendUrl}/api/doctor/dashboard`,  {
                headers: {
                    'Authorization': `Bearer ${dtoken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData);
            } else {
                toast.error(data.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error(error.response?.data?.message || error.message);
            
        }
    }


    const getProfileData = async () => {
        try {
            
            const {data}=await axios.get(`${backendUrl}/api/doctor/profile`,  {headers: {
                'Authorization': `Bearer ${dtoken}`,
                'Content-Type': 'application/json'
            }
        });
        if( data.success) {
            setProfileData(data.profileData);
            console.log(data.profileData);
        }


        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error(error.response?.data?.message || error.message);
            
        }
    }



    const value = {
        backendUrl,
        dtoken,
        setDToken,
        appointments, setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,dashData,setDashData,getDashData,
        profileData,setProfileData,getProfileData

    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
}

export default DoctorContextProvider;
