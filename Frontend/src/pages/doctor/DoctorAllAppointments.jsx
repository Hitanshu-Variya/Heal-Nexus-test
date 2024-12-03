import React, { useEffect, useState } from 'react';
import Navbar from '../../components/doctor/Navbar.jsx';
import Sidebar from '../../components/doctor/Sidebar.jsx'; 
import axios from 'axios';

export const DoctorAllAppointments = () => {
  const [totalAppointments, setTotalAppointments] = useState([]);
    
  useEffect(() => {
    const getTotalAppointments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/patient/appointments`, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setTotalAppointments(response.data.allAppointmentsData);
        }
      } catch (error) {
        console.error('Error in Logging out', error);
      }
    };

    getTotalAppointments();
  });

  function formatDate(dateString) {
    const [day, month, year] = dateString.split("_");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(month, 10) - 1];
    return `${day} ${monthName} ${year}`;
  }

  return (
    <div>
    <Navbar></Navbar>
    <div className='flex items-start bg-[#F8F8FF]'>
     <Sidebar></Sidebar>
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
        </div>

        {totalAppointments && totalAppointments.length > 0 ? (
          totalAppointments.map((item, index) => (
            <div
              className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
              key={index}
            >
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                {item.patientData && (
                  <>
                    <img className='w-8 rounded-full' src={item.patientData.image || '/assets/people_icon.svg'} alt="User" />
                    <p className='text-ellipsis overflow-hidden max-w-[150px]'>{item.patientData.userName}</p>
                  </>
                )}
              </div>
              <p>{item.patientData ? item.patientData.age : "N/A"}</p>
              <p>{formatDate(item.appointmentData.slotDate)} | {item.appointmentData.slotTime}</p>
              
              <p>{item.appointmentData ? `$${item.appointmentData.amount}` : "N/A"}</p>
            </div>
          ))
        ) : (
          <p className="text-center py-4">No appointments available.</p>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}



