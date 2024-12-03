import React, { useEffect, useState } from 'react';
import Navbar from '../../components/doctor/Navbar.jsx';
import Sidebar from '../../components/doctor/Sidebar.jsx';
import axios from 'axios';

export const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("_");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[parseInt(month, 10) - 1];
  return `${day} ${monthName} ${year}`;
};

export const DoctorDashBoard = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [latestAppointments, setLatestAppointments] = useState([]);

  useEffect(() => {
    const getTotalAppointments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/patient/appointments`, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setTotalAppointments(response.data.allAppointmentsData.length);
          setLatestAppointments(response.data.allAppointmentsData);
          setTotalEarnings(response.data.totalAmount);
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
    <>
      <Navbar />
      <div className='flex items-start bg-[#F8F8FF]'>
        <Sidebar />
          <div className='m-5'>
            <div className='flex flex-wrap gap-6'>
              
              {/* Doctor Metrics */}
              <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                <div className='w-16'>
                  <img src='/assets/doctor_icon.svg' alt="Doctor Icon" />
                </div>
                <div>
                  <p className='text-2xl font-semibold text-gray-600'>{totalEarnings}</p>
                  <p className='text-gray-400'>Total Earnings</p>
                </div>
              </div>

              {/* Appointments Metrics */}
              <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                <div className='w-16'>
                  <img src='/assets/appointments_icon.svg' alt="Appointments Icon" />
                </div>
                <div>
                  <p className='text-2xl font-semibold text-gray-600'>{totalAppointments}</p>
                  <p className='text-gray-400'>Pending Appointments</p>
                </div>
              </div>
            </div>

            {/* Latest Bookings Section */}
            <div className='bg-white mt-10'>
              <div className='flex items-center gap-3 px-6 py-5 rounded-t-lg border'>
                <img src='/assets/list_icon.svg' alt="List Icon" />
                <p className='font-semibold text-xl'>Top Appointments</p>
              </div>

              <div className='pt-4 border border-t-0'>
                {latestAppointments.slice(0, 5).map((item, index) => (
                  <div className='flex items-center px-8 py-4 gap-4 hover:bg-gray-100' key={index}>
                    <img className='w-28 rounded-full' src={item.patientData.image} alt="Doctor" />
                    <div className='flex-1 text-base'>
                      <p className='text-gray-800 font-medium'>{item.patientData.userName}</p>
                      <p className='text-gray-600'>{formatDate(item.appointmentData.slotDate)}</p>
                    </div>
                    <div className='text-green-400 text-lg'>pending</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </>
  );
};


