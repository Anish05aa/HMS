import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {

    const [state, setstate] = useState('Admin')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const { setToken, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext) // Assuming setDToken is a function to set the doctor token in context or state



    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {

        event.preventDefault()

        try {
            if (state === 'Admin') {
                console.log(`${backendUrl}/api/admin/login`);

                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
                if (data.success) {
                    // console.log(data.token);
                    localStorage.setItem('adminToken', data.token);
                    setToken(data.token);
                    // Add this after setting the token:
                    localStorage.removeItem(state === 'Admin' ? 'DToken' : 'adminToken');
                    navigate('/admin-dashboard'); // ✅ Move this here
                    // Add this after setting the token:

                } else {
                    // toast.error(data.message)
                    toast.error(data.message || 'Invalid credentials', {
                        position: "top-center"
                    });

                }
            }
            else {
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
                if (data.success) {
                    // console.log(data.token);
                    localStorage.setItem('DToken', data.token);
                    setDToken(data.token);
                    console.log(data.token);
                    navigate('/doctor-dashboard'); // ✅ Move this here
                } else {
                    // toast.error(data.message)
                    toast.error(data.message || 'Invalid credentials', {
                        position: "top-center"
                    });

                }
            }
        }
        catch (error) {
            console.error("Login error:", error);
            toast.error(error.message)
        }

    }





    // On successful login:








    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'>{state}</span>Login </p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e) => setemail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type='text' required />
                </div>

                <div className='w-full'>
                    <p>password</p>
                    <input onChange={(e) => setpassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type='password' required />
                </div>


                <button className='bg-[#5F6FFF] text-white w-full py-2 rounded-md text-base ' >Login</button>
                {
                    state === 'Admin' ?
                        <p> Doctor Login? <span className='text-sm text-[#5F6FFF] cursor-pointer' onClick={() => setstate('Doctor')}>Click here</span></p> :
                        <p> Admin Login? <span className='text-sm text-[#5F6FFF] cursor-pointer' onClick={() => setstate('Admin')}>Click here</span></p>
                }
            </div>

        </form>
    )
}

export default Login
