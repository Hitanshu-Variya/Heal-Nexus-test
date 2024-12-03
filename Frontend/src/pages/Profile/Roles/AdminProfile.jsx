import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const navigate = useNavigate();
  const [adminImg, setAdminImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    permissions: [],
    department: "",
    role: "",
    employeeId: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
    workingHours: {
      start: "",
      end: "",
    },
    responsibilities: [],
    accessLevel: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setAdminImg(file);
    } else {
      toast.error("File size should be less than 5MB");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setAdminDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAdminDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all text data
      Object.keys(adminDetails).forEach(key => {
        if (typeof adminDetails[key] === 'object') {
          formData.append(key, JSON.stringify(adminDetails[key]));
        } else {
          formData.append(key, adminDetails[key]);
        }
      });

      // Append image if exists
      if (adminImg) {
        formData.append("image", adminImg);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/profile/create-admin`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        toast.success("Admin profile created successfully");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error creating admin profile:", error);
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
      <h3 className="text-lg font-medium text-blue-700 mb-4">Admin Details</h3>
      
      <input
        name="employeeId"
        value={adminDetails.employeeId}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Employee ID"
        autoComplete="off"
      />
      <input
        name="department"
        value={adminDetails.department}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Department"
        autoComplete="off"
      />
      <input
        name="role"
        value={adminDetails.role}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Role"
        autoComplete="off"
      />
      
      <input
        name="emergencyContact.name"
        value={adminDetails.emergencyContact.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Emergency Contact Name"
        autoComplete="off"
      />
      <input
        name="emergencyContact.relationship"
        value={adminDetails.emergencyContact.relationship}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Relationship"
        autoComplete="off"
      />
      <input
        name="emergencyContact.contactNumber"
        value={adminDetails.emergencyContact.contactNumber}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Emergency Contact Number"
        autoComplete="off"
      />
    </div>

    {/* Right Section */}
    <div className="md:w-1/2">
      <h3 className="text-lg font-medium text-blue-700 mb-4">Address Details</h3>
      
      <input
        name="address.street"
        value={adminDetails.address.street}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Street Address"
        autoComplete="off"
      />
      <div className="grid grid-cols-2 gap-5 mb-3">
        <input
          name="address.city"
          value={adminDetails.address.city}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded-lg"
          placeholder="City"
          autoComplete="off"
        />
        <input
          name="address.state"
          value={adminDetails.address.state}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded-lg"
          placeholder="State"
          autoComplete="off"
        />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-3">
        <input
          name="address.postalCode"
          value={adminDetails.address.postalCode}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded-lg"
          placeholder="Postal Code"
          autoComplete="off"
        />
        <input
          name="address.country"
          value={adminDetails.address.country}
          onChange={handleChange}
          className="w-full p-2 border border-blue-300 rounded-lg"
          placeholder="Country"
          autoComplete="off"
        />
      </div>

      <h3 className="text-lg font-medium text-blue-700 mb-4">Permissions</h3>
      <select
        name="permissions"
        value={adminDetails.permissions}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
      >
        <option value="">Select Permissions</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Staff">Staff</option>
      </select>
    </div>
  </div>

  <div className="text-center mt-8">
    <button
      type="submit"
      className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all"
    >
      Save Profile
    </button>
  </div>
</form>


  );
}
