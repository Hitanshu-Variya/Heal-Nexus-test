import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PharmacistProfile() {
  const navigate = useNavigate();
  const [pharmacistImg, setpharmacistImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pharmacistDetails, setPharmacistDetails] = useState({
    certification: [],
    pharmacyName: "",
    pharmacyLocation: {
      street: "",
      city: "", 
      state: "",
      postalCode: "",
      country: "",
    },
    contactNumber: "",
    yearsOfExperience: "",
    specializations: [],
    education: [],
    licenseNumber: "",
    workingHours: {
      start: "",
      end: "",
    },
    services: [],
    languages: [],
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { 
      setpharmacistImg(file);
    } else {
      toast.error("File size should be less than 5MB");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPharmacistDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPharmacistDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(",").map(item => item.trim());
    setPharmacistDetails(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setPharmacistDetails(prev => ({
      ...prev,
      pharmacyLocation: {
        ...prev.pharmacyLocation,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all text data
      Object.keys(pharmacistDetails).forEach(key => {
        if (typeof pharmacistDetails[key] === 'object') {
          formData.append(key, JSON.stringify(pharmacistDetails[key]));
        } else {
          formData.append(key, pharmacistDetails[key]);
        }
      });

      // Append image if exists
      if (pharmacistImg) {
        formData.append("image", pharmacistImg);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/profile/create-pharmacist`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast.success("Pharmacist profile created successfully");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error creating pharmacist profile:", error);
      toast.error(error.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="bg-blue-50 p-6 rounded-lg shadow-lg w-auto mt-2 border border-blue-200"
  >
    <div className="flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 pr-6 border-r border-blue-300">
        <h3 className="text-lg font-medium text-blue-700 mb-4">Pharmacist Details</h3>
        <input
          name="certification"
          value={pharmacistDetails.certification}
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
          placeholder="Certification"
          autoComplete="off"
        />
        <input
          name="pharmacyName"
          value={pharmacistDetails.pharmacyName}
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
          placeholder="Pharmacy Name"
          autoComplete="off"
        />
        <input
          name="yearsOfExperience"
          type="number"
          value={pharmacistDetails.yearsOfExperience}
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
          placeholder="Years of Experience"
          autoComplete="off"
        />
        <input
          name="contactNumber"
          value={pharmacistDetails.contactNumber}
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
          placeholder="Contact Number"
          autoComplete="off"
        />
      </div>
  
      {/* Right Section */}
      <div className="md:w-1/2 pl-6">
        <h3 className="text-lg font-medium text-blue-700 mb-4">Address</h3>
        <div className="flex gap-3 mb-3">
          <input
            name="street"
            value={pharmacistDetails.pharmacyLocation.street}
            onChange={handleAddressChange}
            className="w-1/2 p-2 border border-blue-300 rounded-lg"
            placeholder="Street"
            autoComplete="off"
          />
          <input
            name="city"
            value={pharmacistDetails.pharmacyLocation.city}
            onChange={handleAddressChange}
            className="w-1/2 p-2 border border-blue-300 rounded-lg"
            placeholder="City"
            autoComplete="off"
          />
        </div>
        <div className="flex gap-3 mb-3">
          <input
            name="state"
            value={pharmacistDetails.pharmacyLocation.state}
            onChange={handleAddressChange}
            className="w-1/2 p-2 border border-blue-300 rounded-lg"
            placeholder="State"
            autoComplete="off"
          />
          <input
            name="postalCode"
            value={pharmacistDetails.pharmacyLocation.postalCode}
            onChange={handleAddressChange}
            className="w-1/2 p-2 border border-blue-300 rounded-lg"
            placeholder="Postal Code"
            autoComplete="off"
          />
        </div>
        <div className="flex gap-3 mb-3">
          <input
            name="country"
            value={pharmacistDetails.pharmacyLocation.country}
            onChange={handleAddressChange}
            className="w-1/2 p-2 border border-blue-300 rounded-lg"
            placeholder="Country"
            autoComplete="off"
          />
          <div className="w-1/2"></div>
        </div>
  
        <h3 className="text-lg font-medium text-blue-700 mb-4 mt-4">Upload Profile Pic</h3>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="pharmacist-img"
            accept="image/*"
          />
          <label
            htmlFor="pharmacist-img"
            className="flex items-center justify-center w-full p-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-blue-500">Click to upload profile picture</span>
              <span className="text-sm text-gray-500 mt-1">
                {pharmacistImg ? pharmacistImg.name : "JPG, PNG up to 5MB"}
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  
    <button
      type="submit"
      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full mt-4"
      disabled={loading}
    >
      {loading ? "Saving..." : "Save"}
    </button>
  </form>  
  );
}
