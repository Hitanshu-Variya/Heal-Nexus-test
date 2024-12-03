import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); 
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/patient/get-doctor-name`, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setDoctorName(response.data.userName);
        }
      } catch (error) {
        console.error('Error in Logging out', error);
      }
    };

    fetchDoctorName();
  });

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

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <div className="flex justify-between py-3 items-center px-10 border-b bg-white">
      {/* Left: Logo Section */}
      <div className="flex items-center text-xs gap-2">
        <img className="w-40 cursor-pointer" src='/assets/heal_logo.png' alt="Logo" />
        <div>
          <p className="text-3xl font-bold">Heal Nexus</p>
          <p className="mt-1 border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-center">
            Doctor
          </p>
        </div>
      </div>

      <div className="flex items-center relative gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded-full"
        >
          Logout
        </button>

        <div
          className="flex items-center cursor-pointer gap-2"
          onClick={toggleProfileDropdown}
        >
          <img
            src='/assets/doctor_icon.svg'
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <p className="text-sm font-medium">{doctorName}</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
