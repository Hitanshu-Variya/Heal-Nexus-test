import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/admin/Navbar.jsx';
import Sidebar from '../../components/admin/Sidebar.jsx';
const AdminallAppointments = () => {
  const [appointmentData, setAppointmentData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/dashboard`, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setAppointmentData(response.data.detailedAppointments)
        }
      } catch (error) {
        console.error('Error in Logging out', error);
      }
    };

    fetchDashboardData();
  }, []);
  // Function to format the date
  function formatDate(dateString) {
    const [day, month, year] = dateString.split("_");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(month, 10) - 1];
    return `${day} ${monthName} ${year}`;
  }

  // Function to calculate age based on date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
          <p>Doctor</p>
          <p>Fees</p>
        </div>

        {appointmentData && appointmentData.length > 0 ? (
          appointmentData.map((item, index) => (
            <div
              className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
              key={index}
            >
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                {item.patientName && (
                  <>
                    <img className='w-8 rounded-full' src={item.patientimage || '/assets/people_icon.svg'} alt="User" />
                    <p className='text-ellipsis overflow-hidden max-w-[150px]'>{item.patientName}</p>
                  </>
                )}
              </div>
              <p>{item.userData ? item.patientage : "N/A"}</p>
              <p>{formatDate(item.slotDate)} | {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                {item.doctorName && (
                  <>
                    <img className='w-8 rounded-full' src={item.doctorimage || '/assets/doctor_icon.svg'} alt="Doctor" />
                    <p className='text-ellipsis overflow-hidden max-w-[150px]'>{item.doctorName}</p>
                  </>
                )}
              </div>
              <p>{item.doctorName ? `$${item.amount}` : "N/A"}</p>
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

export default AdminallAppointments