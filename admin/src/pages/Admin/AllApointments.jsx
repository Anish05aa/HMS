import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {

  const { token, appointments, getAllappointments ,Appointmentcancel} = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)




  useEffect(() => {
    if (token) {
      getAllappointments();
    }
  }, [token]); // ✅ Correct syntax


  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>

        {/* use grid */}

        <div className='
         grid-flow-col py-3 px-6 border-b justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 ' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full ' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>

            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)},{item.slotTime}</p>

            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200 ' src={item.docData.image} alt="" />
              <p>{item.docData.name}</p>

            </div>

            <p>{currency}{item.amount}</p>
            {item.cancelled 
            ? <p className='text-red-400 font-medium'>Cancelled</p>
            : item.isCompleted 
            ? <p className='text-green-500 font-medium'>Completed</p> 
            :<img onClick={()=>Appointmentcancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
            }

          </div>

        ))}

      </div>
    </div>
  )
}

export default AllAppointments