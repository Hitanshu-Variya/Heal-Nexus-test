import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function PatientProfile() {
  const navigate = useNavigate();
  const [docImg, setDocImg] = useState(null);

  const [userDetails, setUserDetails] = useState({
    age: "",
    gender: "",
    contactNumber: "",
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    medicalHistory: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setDocImg(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [parent]: {
          ...prevDetails[parent],
          [child]: value,
        },
      }));
    } else {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("age", userDetails.age);
    formData.append("gender", userDetails.gender);
    formData.append("contactNumber", userDetails.contactNumber);
    formData.append("medicalHistory", userDetails.medicalHistory);
    formData.append("emergencyContact[name]", userDetails.emergencyContact.name);
    formData.append("emergencyContact[relationship]", userDetails.emergencyContact.relationship);
    formData.append("emergencyContact[contactNumber]", userDetails.emergencyContact.contactNumber);
    formData.append("address[street]", userDetails.address.street);
    formData.append("address[city]", userDetails.address.city);
    formData.append("address[state]", userDetails.address.state);
    formData.append("address[postalCode]", userDetails.address.postalCode);
    formData.append("address[country]", userDetails.address.country);
    if (docImg) {
      formData.append("image", docImg);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/profile/create-patient`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error_) {
      console.error("Error logging in:", error_.response?.data || error_.message);
      const error = error_.response?.data?.error || "An error occurred. Please try again.";
      toast.error(error);
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
          <h3 className="text-lg font-medium text-blue-700 mb-4">Patient Details</h3>
          <input
            name="age"
            value={userDetails.age}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
            placeholder="Age"
            autoComplete="off"
          />
          <input
            name="gender"
            value={userDetails.gender}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
            placeholder="Gender"
            autoComplete="off"
          />
          <input
            name="contactNumber"
            value={userDetails.contactNumber}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
            placeholder="Contact Number"
            autoComplete="off"
          />

          <h3 className="text-lg font-medium text-blue-700 mb-4 mt-4">Emergency Contact</h3>
          <input
            name="emergencyContact.name"
            value={userDetails.emergencyContact.name}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
            placeholder="Name"
            autoComplete="off"
          />
          <input
            name="emergencyContact.relationship"
            value={userDetails.emergencyContact.relationship}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
            placeholder="Relationship"
            autoComplete="off"
          />
          <input
            name="emergencyContact.contactNumber"
            value={userDetails.emergencyContact.contactNumber}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
            placeholder="Contact Number"
            autoComplete="off"
          />
          <h3 className="text-lg font-medium text-blue-700 mb-4 mt-4">Upload Profile Pic</h3>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="doc-img"
              accept="image/*"
            />
            <label
              htmlFor="doc-img"
              className="flex items-center justify-center w-full p-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-blue-500">Click to upload profile picture</span>
                <span className="text-sm text-gray-500 mt-1">{docImg ? docImg.name : 'JPG, PNG up to 5MB'}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 pl-6">
          <h3 className="text-lg font-medium text-blue-700 mb-4">Address</h3>
          <div className="flex gap-3 mb-3">
            <input
              name="address.street"
              value={userDetails.address.street}
              onChange={handleChange}
              className="w-1/2 p-2 border border-blue-300 rounded-lg"
              placeholder="Street Address"
              autoComplete="off"
            />
            <input
              name="address.city"
              value={userDetails.address.city}
              onChange={handleChange}
              className="w-1/2 p-2 border border-blue-300 rounded-lg"
              placeholder="City"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-3 mb-3">
            <input
              name="address.state"
              value={userDetails.address.state}
              onChange={handleChange}
              className="w-1/2 p-2 border border-blue-300 rounded-lg"
              placeholder="State"
              autoComplete="off"
            />
            <input
              name="address.postalCode"
              value={userDetails.address.postalCode}
              onChange={handleChange}
              className="w-1/2 p-2 border border-blue-300 rounded-lg"
              placeholder="Postal Code"
              autoComplete="off"
            />
          </div>
          <div className="flex gap-3 mb-3">
            <input
              name="address.country"
              value={userDetails.address.country}
              onChange={handleChange}
              className="w-1/2 p-2 border border-blue-300 rounded-lg"
              placeholder="Country"
              autoComplete="off"
            />
            <div className="w-1/2"></div>
          </div>

          <h3 className="text-lg font-medium text-blue-700 mb-4 mt-4">Medical History</h3>
          <textarea
            name="medicalHistory"
            value={userDetails.medicalHistory}
            onChange={handleChange}
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg !bg-white"
            placeholder="Medical History"
            autoComplete="off"
          />
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
