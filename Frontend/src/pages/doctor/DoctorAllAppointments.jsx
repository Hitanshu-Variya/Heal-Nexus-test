import React, { useEffect, useState } from 'react';
import Navbar from '../../components/doctor/Navbar.jsx';
import Sidebar from '../../components/doctor/Sidebar.jsx'; 
import axios from 'axios';
import ReactModal from 'react-modal';
import { toast } from 'react-hot-toast';

ReactModal.setAppElement('#root');

export const DoctorAllAppointments = () => {
  const [totalAppointments, setTotalAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
    
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
        console.error('Error fetching appointments', error);
      }
    };

    getTotalAppointments();
  }, []);

  const handleMarkAsDone = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmMarkAsDone = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/patient/complete-appointment`,
        { 
          appointmentID: selectedAppointment.appointmentData.id 
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTotalAppointments(prevAppointments =>
          prevAppointments.map(apt =>
            apt.appointmentData.id === selectedAppointment.appointmentData.id
              ? { ...apt, appointmentData: { ...apt.appointmentData, isCompleted: true } }
              : apt
          )
        );
        toast.success('Appointment marked as completed');
      }
    } catch (error) {
      console.error('Error marking appointment as done:', error);
      toast.error('Failed to mark appointment as done');
    }
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

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
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {totalAppointments && totalAppointments.length > 0 ? (
          totalAppointments
            .filter(item => !item.appointmentData.cancel) // Filter out cancelled appointments
            .map((item, index) => (
              <div
                className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
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
                
                <div>
                  {!item.appointmentData.isCompleted ? (
                    <button
                      onClick={() => handleMarkAsDone(item)}
                      className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Mark Done
                    </button>
                  ) : (
                    <span className="text-green-600">Completed</span>
                  )}
                </div>
              </div>
            ))
        ) : (
          <p className="text-center py-4">No appointments available.</p>
        )}
      </div>
    </div>
    </div>

    {/* Confirmation Modal */}
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Completion</h2>
      <p className="text-gray-700 mb-6">
        Are you sure you want to mark this appointment as completed?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={confirmMarkAsDone}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Confirm
        </button>
      </div>
    </ReactModal>
    </div>
  );
}



