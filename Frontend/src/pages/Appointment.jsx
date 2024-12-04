import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

Modal.setAppElement("#root");

const Appointment = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const { id } = useParams();

  const fetchBookedSlots = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/appointment/booked-slots/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBookedSlots(response.data.bookedSlots);
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      toast.error("Failed to fetch booked slots. Please try again.");
    }
  };

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const [doctorResponse, bookedSlotsResponse] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_SERVER_URL}/profile/get-doctor/${id}`,
            { withCredentials: true }
          ),
          axios.get(
            `${process.env.REACT_APP_SERVER_URL}/appointment/booked-slots/${id}`,
            { withCredentials: true }
          )
        ]);

        if (doctorResponse.status === 200) {
          setDoctorData(doctorResponse.data.response);
        }
        
        if (bookedSlotsResponse.status === 200) {
          setBookedSlots(bookedSlotsResponse.data.bookedSlots);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
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

  const isSlotAvailable = (date, time) => {
    const bookedSlot = bookedSlots.find(
      slot => slot.slotDate === date && slot.slotTime === time
    );
    
    if (!bookedSlot) {
      return { available: true, status: "Available" };
    } else if (bookedSlot.cancel === true && bookedSlot.payment === false) {
      return { available: true, status: "Available" };
    } else if (bookedSlot.payment === false) {
      return { available: false, status: "Not available" };
    } else {
      return { available: false, status: "Booked" };
    }
  };

  const handleSlotClick = (slot) => {
    const { available, status } = isSlotAvailable(doctorSlots[selectedDayIndex].date, slot);
    if (!available) {
      toast.error(`This slot is ${status}!`);
      return;
    }
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
      if (!isSlotAvailable(doctorSlots[selectedDayIndex].date, selectedSlot)) {
        setIsModalOpen(false);
        toast.error("This slot has just been booked by someone else. Please select another slot.");
        return;
      }

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
        await fetchBookedSlots();
      }
    } catch (error) {
      setIsModalOpen(false);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Slot is already booked!");
      } else {
        toast.error("Error booking appointment. Please try again.");
      }
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
          Appointment Fee: &#8377; {doctorData.consultationFee}
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
          {doctorSlots[selectedDayIndex].slots.map((slot, idx) => {
            const { available, status } = isSlotAvailable(doctorSlots[selectedDayIndex].date, slot);
            
            return (
              <button
                key={idx}
                onClick={() => handleSlotClick(slot)}
                disabled={!available}
                className={`
                  p-2 border rounded-md text-center transition-colors
                  ${
                    available 
                      ? selectedSlot === slot
                        ? "bg-blue-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                      : status === "Not available"
                        ? "bg-yellow-100 text-yellow-800 cursor-not-allowed"
                        : "bg-red-100 text-red-800 cursor-not-allowed"
                  }
                `}
              >
                {slot}
                {!available && <span className="block text-xs">{status}</span>}
              </button>
            );
          })}
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
