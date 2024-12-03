// AdminDashBoard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/Navbar.jsx';
import Sidebar from '../../components/admin/Sidebar.jsx';
import axios from 'axios';

const AdminDashBoard = () => {
    const [dashboardData, setDashboardData] = useState({});
    const [appointmentData, setAppointmentData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/dashboard`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setDashboardData(response.data.dashboardData);
                    setAppointmentData(response.data.detailedAppointments);
                }
            } catch (error) {
                console.error('Error in fetching dashboard data', error);
            }
        };

        fetchDashboardData();
    }, []);

    function formatDate(dateString) {
        const [day, month, year] = dateString.split("_");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = months[parseInt(month, 10) - 1];
        return `${day} ${monthName} ${year}`;
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-start bg-[#F8F8FF]'>
                <Sidebar />
                {dashboardData && (
                    <div className='m-5'>
                        <div className='flex flex-wrap gap-6'>
                            {/* Doctors Metrics */}
                            <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                                <div className='w-16'>
                                    <img src='/assets/doctor_icon.svg' alt="" />
                                </div>
                                <div>
                                    <p className='text-2xl font-semibold text-gray-600'>{dashboardData.doctors}</p>
                                    <p className='text-gray-400'>Doctors</p>
                                </div>
                            </div>

                            {/* Appointments Metrics */}
                            <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                                <div className='w-16'>
                                    <img src={'/assets/appointments_icon.svg'} alt="" />
                                </div>
                                <div>
                                    <p className='text-2xl font-semibold text-gray-600'>{dashboardData.appointments}</p>
                                    <p className='text-gray-400'>Appointments</p>
                                </div>
                            </div>

                            {/* Patients Metrics */}
                            <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                                <div className='w-16'>
                                    <img src='/assets/patients_icon.svg' alt="" />
                                </div>
                                <div>
                                    <p className='text-2xl font-semibold text-gray-600'>{dashboardData.users}</p>
                                    <p className='text-gray-400'>Patients</p>
                                </div>
                            </div>

                            {/* Lab Technicians Metrics */}
                            <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                                <div className='w-16'>
                                    <img src='/assets/doctor_icon.svg' alt="dacter" />
                                </div>
                                <div>
                                    <p className='text-2xl font-semibold text-gray-600'>{dashboardData.labTechnicians}</p>
                                    <p className='text-gray-400'>Lab Assistants</p>
                                </div>
                            </div>

                            {/* Pharmacists Metrics */}
                            <div className='flex items-center gap-4 bg-white p-6 min-w-72 rounded-lg border-2 border-fary-100 cursor-pointer hover:scale-105 transition-all'>
                                <div className='w-16'>
                                    <img src='/assets/doctor_icon.svg' alt="dacter" />
                                </div>
                                <div>
                                    <p className='text- 2xl font-semibold text-gray-600'>{dashboardData.pharmacists}</p>
                                    <p className='text-gray-400'>Pharmacists</p>
                                </div>
                            </div>
                        </div>

                        {/* Latest Bookings Section */}
                        <div className='bg-white mt-10'>
                            <div className='flex items-center gap-3 px-6 py-5 rounded-t-lg border'>
                                <img src={'/assets/list_icon.svg'} alt="" />
                                <p className='font-semibold text-xl'>Latest Bookings</p>
                            </div>
                            <div className='pt-4 border border-t-0'>
                                {appointmentData.slice(0, 5).map((item, index) => (
                                    <div className='flex items-center px-8 py-4 gap-4 hover:bg-gray-100' key={index}>
                                        <img className='w-28 rounded-full' src={item.doctorimage} alt="Doctor" />
                                        <div className='flex-1 text-base'>
                                            <p className='text-gray-800 font-medium'>{item.doctorName}</p>
                                            <p className='text-gray-600'>{formatDate(item.slotDate)}</p>
                                        </div>
                                        <div className='text-green-400 text-lg'>pending</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashBoard; // Ensure this is a default export