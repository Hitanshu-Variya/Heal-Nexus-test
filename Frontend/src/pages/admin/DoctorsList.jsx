import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/Navbar.jsx';
import Sidebar from '../../components/admin/Sidebar.jsx';
import axios from 'axios';

const DoctorsList = () => {
  const [verifiedDoctors, setVerifiedDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/admin/get-verified-doctors`, {
          withCredentials: true
        });

        if (response.status === 200) {
          const doctorData = response.data.doctorData;
          const updatedDoctorData = doctorData.map((doctor) => {
            const ratings = doctor.ratings;

            const averageRatings = ratings?.length > 0
              ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
              : 0;

            return {
              ...doctor,
              averageRatings,
            };
          });

          setVerifiedDoctors(updatedDoctorData);
        }

      } catch (error) {
        console.error('Error in fetching doctors:', error);
      }
    };

    fetchDoctorData();
  }, []);

  if (!verifiedDoctors || verifiedDoctors.length === 0) {
    return <div>No verified doctors available.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className='flex items-start bg-[#F8F8FF]'>
        <Sidebar />
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
          <h1 className='text-lg font-medium'>All Doctors</h1>
          <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
            {verifiedDoctors.length > 0 && verifiedDoctors.map((item, index) => (
              <div
                className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group'
                key={index}
              >
                <img
                  className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
                  src={item.image}
                  alt={`Image of ${item.userData ? item.userData.userName : 'Unknown'}`}
                />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>
                    {item.userData ? item.userData.userName : 'Unknown User'}
                  </p>
                  <p className='text-zinc-600 text-sm'>{item.specialty}</p>
                  <p>{item.experience} years experience</p>
                  <p>₹{item.consultationFee} Consultation fee</p>
                  <p>{item.averageRatings || 0} Ratings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;