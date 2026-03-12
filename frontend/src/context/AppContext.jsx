import { createContext, useEffect, useState } from "react";
// import {doctors} from '../assets/assets'
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const [userData, setUserData] = useState(false)

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')

            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async () => {
        try {

            const { data } = await axios.get(
                backendUrl + '/api/user/get-profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (data.success) {
                setUserData({
                    ...data.userData,
                    address: data.userData.address || { line1: "", line2: "" }
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)

            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token")
                setToken(false)
                setUserData(false)
            } else {
                toast.error(error.message)
            }
        }
    }

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData
    }


    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
