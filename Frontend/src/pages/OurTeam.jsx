import React from "react";
import { useNavigate } from "react-router-dom";

import { Footer } from "./landingPage";



const teamMembers = [
  { name: 'Zeel Danani', id: '202201507', image: '/assets/zeel.png' },
  { name: 'Mihir Patel', id: '202201506', image: '/assets/mihir.png' },
  { name: 'Harshit Prajapati', id: '202201500', image:  '/assets/harshit.png'},
  { name: 'Shail Patel', id: '202201297', image: '/assets/shail.png' },
  { name: 'Malay Sidapara', id: '202201488', image:  '/assets/malay.jpg'},
  { name: 'Ayush Chaudhari', id: '202201517', image:  '/assets/Ayush_jpg.jpeg'},
  { name: 'Hitanshu Varia', id: '202201510', image: '/assets/hitanshu.jpg' },
  { name: 'Dharmi Patel', id: '202201467', image:'/assets/dharmi.png'  },
  { name: 'Aditya Raina', id: '202201466', image: '/assets/aditya.png' },
  { name: 'Prof. Saurabh Tiwary', id: 'Mentor', image: '/assets/prof.saurabh tiwary.png'},
];



// Shuffle the teamMembers array manually on initial load


const OurTeam = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50">
      <Appbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-16 text-center text-white shadow-lg">
        <h1 className="text-5xl font-extrabold animate__animated animate__fadeIn">Meet Our Team</h1>
        <p className="text-lg mt-4 max-w-xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
          A passionate group of individuals working together to make a difference.
        </p>
      </div>

      {/* Team Members Section */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-12 text-center">
          Our Dedicated Team
        </h2>

        {/* Grid Layout for Team Members */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 w-full transform hover:scale-105"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-56 object-cover transition-transform duration-500"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 tracking-tight">{member.name}</h3>
                <p className="text-gray-500 mt-2">{member.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

const Appbar = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200"
      style={{
        position: "sticky",
        top: 0,
        height: "80px",
        zIndex: 50,
      }}
    >
      {/* App Name */}
      <div className="flex items-center">
        <img src="/assets/heal_logo.png" alt="Logo" className="w-16 h-14 sm:w-20 sm:h-16" />
        <h1 className="ml-4 text-xl sm:text-2xl font-bold text-gray-800">HealNexus</h1>
      </div>

      {/* Go to Home Page Button */}
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
      >
        Go to Home
      </button>
    </div>
  );
};

export default OurTeam;
