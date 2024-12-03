import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { Footer } from './landingPage';
const DashBoard = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/auth/get-user-details`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setUserName(response.data.userName);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div>
      <Appbar />
      <HeroSection userName={userName} />
      <Services />
      <SpecialitySection />
      <Footer />
    </div>
  );
};


export default DashBoard;

export function Appbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
        withCredentials: true
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error in Logging out', error);
    }
  };

  const handleSearchByCity = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, {
        withCredentials: true
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error in Logging out', error);
    }
  };

  return (
    <div
      className={`flex justify-between items-center px-4 py-4 bg-white border-b border-gray-400 mx-2 transition-all duration-300 ${isScrolled ? "shadow-lg z-50" : ""}`}
      style={{
        position: "sticky",
        top: 0,
        height: "80px",
        zIndex: 50,
      }}
    >
      {/* Logo and Text */}
      <div className="flex items-center justify-between">
        <img src="./assets/heal_logo.png" alt="Logo" className="w-25 h-20" />

        {/* Center the text on small screens */}
        <div className="hidden sm:block text-2xl font-bold text-gray-800 sm:text-left text-center w-full sm:w-auto">
          HealNexus
        </div>
      </div>

      {/* Navigation Links (only visible on medium and up) */}
      <div className="hidden lg:flex space-x-8 text-gray-800 font-semibold">
        <NavLink
          to="/patient-dashboard"
          className={({ isActive }) => isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2 border-transparent'}
        >
          DASHBOARD
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) => isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2 border-transparent'}
        >
          ALL DOCTORS
        </NavLink>
        <NavLink
          to="/about-us"
          className={({ isActive }) => isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2 border-transparent'}
        >
          ABOUT
        </NavLink>
        <NavLink
          to="/team"
          className={({ isActive }) => isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600 hover:border-b-2 border-transparent'}
        >
          OUR-TEAM
        </NavLink>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {/* Appointment Button */}
        <NavLink
          to="/my-appointments"
          className={`px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}
        >
          MyAppointments
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}
        >
          Logout
        </button>

        {/* Profile Icon */}
        <button
          className={`p-2 text-blue-600 hover:text-blue-700 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}
          onClick={(e) => { navigate('/my-profile') }}
          data-testid="pbutton"
        >
          <FaUserCircle className="w-8 h-8" /> {/* User icon */}
        </button>
      </div>
    </div>
  );
}

export function HeroSection({ userName }) {
  return (
    <div className="bg-white py-10">
      <div className="container mx-auto text-center">

        {/* Service Options */}
        <div className="bg-blue-500 mx-8 rounded-lg mt-6">
          <div className="flex justify-between items-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div>
              <h2 className="text-3xl text-left font-semibold text-white">Welcome {userName || "Guest"} to Heal Nexus!</h2>
              <p className="text-sm text-white bg-blue-500 p-2 rounded-md">
                Connecting you to care that truly matters.
              </p>
            </div>
            <img
              src="assets/doc13.png" // Replace with your image path
              alt="Doctor pointing"
              className="max-w-full h-auto self-end"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const navigate = useNavigate();
  const services = [
    { name: "Period doubts or Pregnancy", action: "CONSULT NOW", image: "./assets/irregular-painful+period.webp" },
    { name: "Acne, pimple or skin issues", action: "CONSULT NOW", image: "./assets/Acne.webp" },
    { name: "Cold, cough or fever", action: "CONSULT NOW", image: "./assets/coughing.webp" },
    { name: "Depression or anxiety", action: "CONSULT NOW", image: "./assets/12-mental-wellness.webp" },
  ];


  const handleConsultClick = () => {
    navigate("/doctors");
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Consult top doctors online for all types of health problems
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-4 justify-around">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all ease-in-out duration-300"
            >
              {/* Image (hidden on sm breakpoint) */}
              <div className="hidden md:block mb-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-32 h-32 object-cover mb-4"
                />
              </div>
              {/* Name (visible on all breakpoints) */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              {/* Button */}
              <button onClick={handleConsultClick}
                className="mt-3 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 px-6 py-2 border-2 border-blue-600 rounded-full">
                {service.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export function SpecialitySection() {
  const navigate = useNavigate();

  const specialities = [
    { name: "General Physician", icon: "./assets/general_physician.svg" },
    { name: "Gynecologist", icon: "./assets/gynecologist.svg" },
    { name: "Dermatologist", icon: "./assets/dermatologist.svg" },
    { name: "Pediatrician", icon: "./assets/pediatricians.svg" },
    { name: "Neurologist", icon: "./assets/neurologist.svg" },
    { name: "Gastroenterologist", icon: "./assets/gastroenterologist.svg" },
  ];



  return (
    <div className="py-16 px-4 md:px-8 lg:px-16 text-center mx-2">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Book an appointment for an in-clinic consultation
      </h2>
      <p className="text-gray-600 mb-12">
        Find experienced doctors across all specialties
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {specialities.map((speciality, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 cursor-pointer"
            onClick={() => navigate(`/doctors/${speciality.name}`)}
          >
            <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center transition-transform transform hover:scale-110 hover:translate-y-2 shadow-md">
              <img
                src={speciality.icon}
                alt={speciality.name}
                className="w-12 h-12"
              />
            </div>
            <p className="text-gray-700 font-medium">{speciality.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}