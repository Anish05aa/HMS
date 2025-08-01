import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorList = () => {

    const { doctors, token, getAllDoctors, changeAvailability } = useContext(AdminContext)

    useEffect(() => {
        console.log('Token:', token);
        if (token) {
            getAllDoctors();
        }
    }, [token])



    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-medium'>All Doctors</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {doctors.map((item, index) => (
                    <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                        <img
                            className='bg-indigo-50 group-hover:bg-[#5F6FFF] transition-all duration-500 w-full h-40 object-cover'
                            src={item.image}
                            alt={item.name}
                        />
                        <div className='p-4'>
                            <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                            <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                            <div className='mt-3 flex items-center gap-1 text-sm'>
                                <input
                                    type="checkbox"
                                    checked={item.available}
                                    onChange={() => changeAvailability(item._id)}
                                    className="cursor-pointer transition-colors accent-green-500"
                                />
                                <p>Available</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorList