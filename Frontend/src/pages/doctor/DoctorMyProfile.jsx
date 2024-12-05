import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import Navbar from '../../components/doctor/Navbar';
import Sidebar from '../../components/doctor/Sidebar';
import { z } from 'zod';
import { doctorSchema } from '../Profile/Roles/DoctorProfile';

const imageSchema = z.object({
  image: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'Image size must be less than 5MB'
    })
    .refine(file => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type), {
      message: 'Only .jpg, .jpeg, and .png formats are supported'
    })
    .optional()
});

const DoctorMyProfile = () => {
  const [userdata, setuserdata] = useState({
    specialty: "",
    qualifications: [""],
    experience: "",
    contactNumber: "",
    consultationFee: "",
    clinicAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    biography: "",
  });
  const [isEdit, setIsedit] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/profile/get-doctor`, {
          withCredentials: true
        });

        if (response.status === 200) {
          setuserdata(response.data.response);
        }
      } catch (error) {
        console.error('Error in fetching doctor profile', error);
        toast.error("Failed to fetch profile data");
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        imageSchema.parse({ image: file });
        setImage(file);
      } catch (error) {
        error.errors.forEach(err => {
          toast.error(err.message);
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserdata(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const field = name.split('.')[1];

    setuserdata(prev => ({
      ...prev,
      clinicAddress: {
        ...prev.clinicAddress,
        [field]: value,
      },
    }));
  };

  const updateUserProfileData = async () => {
    setIsLoading(true);
    try {
      if (image) {
        const imageValidation = imageSchema.safeParse({ image });
        if (!imageValidation.success) {
          imageValidation.error.errors.forEach(err => {
            toast.error(err.message);
          });
          setIsLoading(false);
          return;
        }
      }

      // Validate profile data using doctorSchema
      const validationResult = doctorSchema.safeParse(userdata);
      if (!validationResult.success) {
        validationResult.error.errors.forEach(err => {
          toast.error(err.message);
        });
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("specialty", userdata.specialty);
      formData.append("experience", userdata.experience);
      formData.append("contactNumber", userdata.contactNumber);
      formData.append("consultationFee", userdata.consultationFee);
      formData.append("biography", userdata.biography);

      userdata.qualifications.forEach((qualification, index) => {
        formData.append(`qualifications[${index}]`, qualification);
      });

      Object.entries(userdata.clinicAddress).forEach(([key, value]) => {
        formData.append(`clinicAddress[${key}]`, value);
      });

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/profile/update-doctor`, formData, {
        withCredentials: true
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setIsedit(false);
        setImage(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error in updating doctor profile', error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-start bg-[#F8F8FF] min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            {/* Profile Image Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  className="w-32 h-32 rounded-full border bg-gray-200 shadow"
                  src={image ? URL.createObjectURL(image) : userdata?.image}
                  alt="Profile"
                />
                {isEdit && (
                  <>
                    <button
                      className="absolute bottom-2 right-2 bg-blue-500 text-white text-sm font-medium px-2 py-1 rounded-full shadow hover:bg-blue-600"
                      onClick={() => document.getElementById('image').click()}
                    >
                      Edit
                    </button>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      accept="image/jpeg,image/png,image/jpg"
                      hidden
                    />
                  </>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Username: {userdata?.userName}</h2>
                <p className="text-gray-600">email: {userdata?.email}</p>
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Professional Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Specialty</label>
                    {isEdit ? (
                      <input
                        type="text"
                        name="specialty"
                        value={userdata.specialty}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userdata.specialty}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Experience (years)</label>
                    {isEdit ? (
                      <input
                        type="text"
                        name="experience"
                        value={userdata.experience}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userdata.experience} years</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Contact Number</label>
                    {isEdit ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={userdata.contactNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{userdata.contactNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Consultation Fee</label>
                    {isEdit ? (
                      <input
                        type="text"
                        name="consultationFee"
                        value={userdata.consultationFee}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">₹{userdata.consultationFee}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Qualifications Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Qualifications</h3>
                {isEdit ? (
                  <div className="space-y-2">
                    {userdata.qualifications.map((qual, index) => (
                      <input
                        key={index}
                        type="text"
                        value={qual}
                        onChange={(e) => {
                          const newQuals = [...userdata.qualifications];
                          newQuals[index] = e.target.value;
                          setuserdata(prev => ({
                            ...prev,
                            qualifications: newQuals
                          }));
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ))}
                    <button
                      onClick={() => setuserdata(prev => ({
                        ...prev,
                        qualifications: [...prev.qualifications, ""]
                      }))}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Qualification
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {userdata.qualifications.map((qual, index) => (
                      <li key={index} className="text-gray-900">{qual}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Clinic Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Clinic Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(userdata.clinicAddress).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {isEdit ? (
                        <input
                          type="text"
                          name={`clinicAddress.${key}`}
                          value={value}
                          onChange={handleAddressChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Biography</h3>
                {isEdit ? (
                  <textarea
                    name="biography"
                    value={userdata.biography}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full bg-slate-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{userdata.biography}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6">
              {isEdit ? (
                <>
                  <button
                    onClick={() => {
                      setIsedit(false);
                      setImage(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateUserProfileData}
                    className={`bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                      }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsedit(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorMyProfile;
