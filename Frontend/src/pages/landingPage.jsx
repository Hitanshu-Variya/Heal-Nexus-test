import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import React from "react";
function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <Appbar isLoggedIn={isLoggedIn} navigate={navigate}/>
      <AppointmentSection isLoggedIn={isLoggedIn} navigate={navigate}/>
      <SpecialitySection isLoggedIn={isLoggedIn} navigate={navigate}/>
      <AppointmentCTA isLoggedIn={isLoggedIn} navigate={navigate}/>
      <Footer />
    </div>
  );
}
export default LandingPage;

const handleProtectedNavigation = (path, isLoggedIn, navigate) => {
  if (!isLoggedIn) {
    toast.error("Login required to access this page.");
  } else {
    navigate(path);
  }
};

export function Appbar({isLoggedIn,navigate}) {
  const [isScrolled, setIsScrolled] = useState(false);  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex justify-between items-center px-4 py-4 bg-white border-b border-gray-400 mx-2 transition-all duration-300 ${
        isScrolled ? "fixed top-0 left-0 w-full shadow-lg z-50" : ""
      }`}
      style={{ height: "80px" }}
    >
      {/* Logo and Text */}
      <div className="flex items-center justify-between">
        <img src="../assets/heal_logo.png" alt="Logo" className="w-25 h-20" />
        <div className="text-2xl font-bold text-gray-800 sm:text-left text-center w-full sm:w-auto">
          HealNexus
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex space-x-8 text-gray-800 font-semibold">
        <button
          onClick={() => handleProtectedNavigation("/dashboard", isLoggedIn, navigate)}
          className="hover:text-blue-600 hover:border-b-2 border-blue-600"
        >
          DASHBOARD
        </button>
        <button
          onClick={() => handleProtectedNavigation("/doctors", isLoggedIn, navigate)}
          className="hover:text-blue-600 hover:border-b-2 border-blue-600"
        >
          ALL DOCTORS
        </button>
        <Link
          to="/about-us"
          className="hover:text-blue-600 hover:border-b-2 border-blue-600"
        >
          ABOUT
        </Link>
        <Link
          to="/team"
          className="hover:text-blue-600 hover:border-b-2 border-blue-600"
        >
          OUR-TEAM
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/login")}
          className={`hidden sm:flex px-4 py-2 text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transform transition-all duration-300 ${
            isScrolled ? "translate-y-[-5px] scale-105" : ""
          } hover:translate-y-[-5px] hover:scale-105`}
        >
          Admin Panel
        </button>
        <button
          onClick={() => navigate("/login")}
          className={`px-4 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transform transition-all duration-300 ${
            isScrolled ? "translate-y-[-5px] scale-105" : ""
          } hover:translate-y-[-5px] hover:scale-105`}
        >
          Create account
        </button>
      </div>
    </div>
  );
}

export function AppointmentSection({isLoggedIn,navigate}) {
  return (
    <div className="bg-blue-500 flex items-center justify-between px-4 mx-2 md:px-8  lg:px-16 rounded-lg mt-4">
      <div className="max-w-4xl flex flex-col md:flex-row items-center">
        {/* Left Section */}
        <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Book Appointment <br /> With Trusted Doctors
          </h1>
          <p className="text-white text-base md:text-lg mb-8 hidden md:block">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
          <button onClick={() => handleProtectedNavigation("/doctors",isLoggedIn,navigate)}className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-200 hover:scale-105 hover:translate-y-1 transition-all duration-300 ease-in-out">
              Book appointment<span className="hidden sm:inline"> →</span>
          </button>
        </div>
      </div>
      
    
      <div className="">
        <img src='../assets/header_img.png' className="self-end" alt="Doctor" />
      </div>
    </div>
  );
}


export function SpecialitySection({isLoggedIn,navigate}) {
  const specialities = [
    { name: "General physician", icon: "./assets/general_physician.svg" },
    { name: "Gynecologist", icon: "./assets/gynecologist.svg" },
    { name: "Dermatologist", icon: "./assets/dermatologist.svg" },
    { name: "Pediatricians", icon: "./assets/pediatricians.svg" },
    { name: "Neurologist", icon: "./assets/neurologist.svg" },
    { name: "Gastroenterologist", icon: "./assets/gastroenterologist.svg" },
  ];

  return (
    <div className="py-16 px-4 md:px-8 lg:px-16 text-center mx-2">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Find by Speciality</h2>
      <p className="text-gray-600 mb-12">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
      <div className="flex flex-wrap justify-center gap-8 cursor-pointer">
        {specialities.map((speciality, index) => (
          <div key={index} onClick={()=>handleProtectedNavigation("/doctors",isLoggedIn,navigate)}className="flex flex-col items-center space-y-2">
            <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center transition-transform transform hover:scale-110 hover:translate-y-2 shadow-md">
              <img src={speciality.icon} alt={speciality.name} className="w-12 h-12" />
            </div>
            <p className="text-gray-700 font-medium">{speciality.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export const AppointmentCTA = ({isLoggedIn,navigate}) => {
  return (
    <div className="bg-white sm:bg-blue-500 text-white mx-2 px-10 rounded-lg flex flex-col items-center md:justify-center md:text-center lg:flex-row lg:justify-between">
      {/* Unified Text and Button Section */}
      <div className="w-full text-center flex flex-col justify-center items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-500 md:text-white">
          Book Appointment With 100+ Trusted Doctors 
        </h2>
        <button onClick={()=>{navigate("/login")}}className="font-semibold py-3 px-6 rounded-full bg-blue-500 text-white md:bg-white md:text-blue-500 hover:bg-blue-700 md:hover:bg-gray-200 transform transition-all duration-300 hover:translate-y-[-5px] hover:scale-105">
          Create account
        </button>
      </div>

      {/* Image Section - Only visible on large screens */}
      <div className="hidden lg:flex lg:w-1/3 justify-center">
        <img
          src="assets/appointment_img.png" // Replace with your image path
          alt="Doctor pointing"
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};






export const Footer = () => {
  return (
    <footer className="bg-white mx-2 mt-4 pt-4 border-">
      <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
        {/* Logo and Description */}
        <div className="mb-6 md:mb-0 md:text-center flex flex-col items-center">
          <div className="flex items-center mb-4">
            <img src="assets/heal_logo.png" alt="Logo" className="h-25 w-20 mr-2" />
            <h1 className="text-2xl font-bold">HealNexus</h1>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6 md:mb-0 md:text-center flex flex-col items-center">
          <h2 className="font-bold mb-2">COMPANY</h2>
          <ul className="text-gray-600">
            <li className="mb-1">
              <Link to="/about-us" className="hover:text-blue-500">About us</Link>
            </li>
            <li className="mb-1">
              <Link to="/team" className="hover:text-blue-500">Team</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 border-t pt-4 text-gray-600">
        © 2024 @ Group_34 @ Made with{' '}
        <img 
          src="assets/Love_Heart_SVG.svg" 
          alt="icon" 
          className="inline-block w-4 h-4 align-middle"
        />{' '}
        - All Rights Reserved.
      </div>
    </footer>
  );
};
