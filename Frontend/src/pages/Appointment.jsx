import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useParams } from "react-router-dom";

Modal.setAppElement("#root");

const Appointment = () => {
  const [doctorData, setDoctorData] = useState(null); // Updated to null to match the first code block
  const [loading, setLoading] = useState(true); // Loading state
  const { id } = useParams();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/profile/get-doctor/${id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setDoctorData(response.data.response);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const doctorSlots = [
    { date: "21_11_2024", slots: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
    { date: "22_11_2024", slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
    { date: "23_11_2024", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
  ];

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleDayClick = (index) => {
    setSelectedDayIndex(index);
    setSelectedSlot("");
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      alert("Please select a time slot before booking.");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/appointment/book-appointment`,
        {
          doctorID: id,
          slotDate: doctorSlots[selectedDayIndex].date,
          slotTime: selectedSlot,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      alert("Error booking appointment. Please try again.");
      console.error("Error booking appointment:", error);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    window.location.href = "/my-appointments";
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!doctorData) {
    return <p>Doctor data not found.</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Doctor Details Section */}
      <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6">
        <img
          src={doctorData.image}
          alt={doctorData.userName}
          className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
        />
        <h1 className="text-2xl font-bold text-gray-800">
          {doctorData.userName}{" "}
          <span className="text-blue-500">
            <i className="fas fa-check-circle"></i>
          </span>
        </h1>
        <p className="text-gray-600">
          {doctorData?.qualifications?.join(", ")} - {doctorData?.specialty}
        </p>

        <p className="text-gray-500 mt-2 text-center">{doctorData.biography}</p>
        <p className="text-lg font-semibold text-gray-800 mt-4">
          Appointment Fee: ${doctorData.consultationFee}
        </p>
      </div>

      {/* Slot Selection Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select a Day
        </h3>
        <div className="flex justify-center mb-6">
          {doctorSlots.map((date, index) => {
            const dayDate = date.date.replace(/_/g, "-");
            const [year, month, day] = dayDate.split("-");
            const formattedDate = `${day}-${month}-${year}`;
            const dayName = daysOfWeek[new Date(formattedDate).getDay()];

            return (
              <button
                key={index}
                onClick={() => handleDayClick(index)}
                className={`text-center w-24 h-16 rounded-md font-bold mx-2 flex flex-col items-center justify-center ${
                  selectedDayIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <span className="text-base font-semibold">{dayName}</span>
                <span className="text-xs mt-1">{dayDate}</span>
              </button>
            );
          })}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select a Time Slot
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {doctorSlots[selectedDayIndex].slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => handleSlotClick(slot)}
              className={`p-2 border rounded-md text-center ${
                selectedSlot === slot ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Book Appointment Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleBookAppointment}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Book Appointment
        </button>
      </div>

      {/* Modal for Confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Booking</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to book an appointment with <b>{doctorData.userName}</b>{" "}
          on{" "}
          <b>
            {doctorSlots[selectedDayIndex].date.replace(/_/g, "/")} at{" "}
            {selectedSlot}
          </b>
          ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={confirmBooking}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Modal for Success Alert */}
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-green-600 mb-4">Success!</h2>
        <p className="text-gray-700 mb-6">
          Appointment successfully booked with <b>{doctorData.userName}</b> on{" "}
          <b>
            {doctorSlots[selectedDayIndex].date.replace(/_/g, "/")} at{" "}
            {selectedSlot}
          </b>
          .
        </p>
        <div className="flex justify-center">
          <button
            onClick={closeSuccessModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Appointment;
