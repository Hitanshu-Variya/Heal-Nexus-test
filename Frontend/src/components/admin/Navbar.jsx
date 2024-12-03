import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
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

  return (
    <div className='flex justify-between py-3 items-center px-10 border-b bg-white'>
    <div className='flex items-center text-xs gap-2'>
      <img className='w-40 cursor-pointer' src='/assets/heal_logo.png' alt="Logo" />
      <div>
        <p className='text-3xl font-bold'>Heal Nexus</p>
        <p className='mt-1 border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-center'>
          Admin 
        </p>
      </div>
    </div>
      
      <div className="flex">
        <img src="/assets/patients_icon.svg" alt="Admin" />
        <button onClick={handleLogout} className='bg-red-500  text-white text-sm px-10 py-2 rounded-full'>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
