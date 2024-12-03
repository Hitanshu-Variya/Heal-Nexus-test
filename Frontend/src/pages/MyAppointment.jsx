import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { Appbar } from './dashBoard';
import axios from 'axios';

Modal.setAppElement('#root'); 

const MyAppointments = () => {
  const [patientAppointmentData, setPatientAppointmentData] = useState([]);

  useEffect(() => {
    const fetchPatientAppointmentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/appointment/get-patient-appointments`, { 
          withCredentials: true 
        });
        
        if (response.status === 200) {
          setPatientAppointmentData(response.data.allAppointmentsData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchPatientAppointmentDetails(); 
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [modalAction, setModalAction] = useState(''); 

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('_');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month, 10) - 1];
    return `${day} ${monthName} ${year}`;
  };

  const openModal = (appointment, action) => {
    setCurrentAppointment(appointment);
    setModalAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentAppointment(null);
    setModalAction('');
  };

  const handleModalConfirm = () => {
    if (modalAction === 'cancel') {
      cancelAppointment(currentAppointment.appointmentData.id);
    } else if (modalAction === 'book') {
      bookAppointment(currentAppointment.appointmentData.id);
    }
    closeModal();
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/appointment/cancel-appointment/${appointmentId}`, null, {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const updatedAppointments = patientAppointmentData.map((item) =>
          item.appointmentData._id === appointmentId ? { ...item, cancel: true } : item
        );
        setPatientAppointmentData(updatedAppointments);
        toast.success('Appointment cancelled successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };
  

  const bookAppointment = async (appointmentId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/appointment/pay-book-appointment/${appointmentId}`, null, {
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        const updatedAppointments = patientAppointmentData.map((item) =>
          item.appointmentData._id === appointmentId ? { ...item, payment: true } : item
        );
        setPatientAppointmentData(updatedAppointments);
        toast.success('Appointment booked successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error payment-booking appointment:', error);
    }
  };

  return (
    <div><Appbar/>
    <div className="mx-20">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {patientAppointmentData && patientAppointmentData.slice().reverse().map((item) => (
          <div
            key={item.appointmentData.id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img className="w-32 bg-indigo-50" src={item.doctorData.image} alt={item.doctorData.userName} />
            </div>
            <div className="flex-1 text-small text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.doctorData.userName}</p>
              <p>{item.doctorData.specialty}</p>
              <p className="text-neutral-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.doctorData.address.street}</p>
              <p className="text-xs">{item.doctorData.address.city}</p>
              <p className="text-xs">{item.doctorData.address.state}</p>
              <p className="mt-1">
                <span className="font-medium">Date & Time:</span>{' '}
                <span className="text-xs">
                  {formatDate(item.appointmentData.slotDate)} | {item.appointmentData.slotTime}
                </span>
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.appointmentData.cancel && !item.appointmentData.payment && (
                <button
                  onClick={() => openModal(item, 'book')}
                  className="text-sm text-stone-500 text-center min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Offline
                </button>
              )}
              {!item.appointmentData.cancel && !item.appointmentData.payment && (
                <button
                  onClick={() => openModal(item, 'cancel')}
                  className="text-sm text-stone-500 text-center min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}
              {item.appointmentData.cancel && (
                <button className="text-sm text-center min-w-48 py-2 border rounded border-red-500 text-red-500 transition-all duration-300">
                  Appointment Cancelled
                </button>
              )}
              {!item.appointmentData.cancel && item.appointmentData.payment && (
                <button className="text-sm text-center min-w-48 py-2 border rounded border-green-500 text-green-500 transition-all duration-300">
                  Payment Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for confirmation */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        className="flex items-center justify-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg p-8 w-80 shadow-md">
          <h2 className="text-lg font-semibold">
            {modalAction === 'cancel' ? 'Cancel Appointment' : 'Pay Offline'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {modalAction === 'cancel'
              ? 'Are you sure you want to cancel this appointment?'
              : 'Are you sure you want to book this appointment?'}
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm text-gray-500 bg-gray-200 rounded hover:bg-gray-300"
            >
              No
            </button>
            <button
              onClick={handleModalConfirm}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </div>
    </div>
  );
};

export default MyAppointments;
