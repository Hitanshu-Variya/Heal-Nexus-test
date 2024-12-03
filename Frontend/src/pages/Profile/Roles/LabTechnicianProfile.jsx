import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LabTechnicianProfile() {
  const navigate = useNavigate();
  const [labImg, setLabImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [labTechnicianDetails, setLabTechnicianDetails] = useState({
    qualifications: [],
    associatedLab: "",
    specialization: [],
    yearsOfExperience: "",
    certifications: [],
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const handleFileChange = (e) => {
    setLabImg(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLabTechnicianDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setLabTechnicianDetails((prevDetails) => ({
      ...prevDetails,
      address: {
        ...prevDetails.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("associatedLab", labTechnicianDetails.associatedLab);
    formData.append("yearsOfExperience", labTechnicianDetails.yearsOfExperience);
    formData.append("contactNumber", labTechnicianDetails.contactNumber);
    labTechnicianDetails.qualifications.forEach((qual, index) => {
      formData.append(`qualifications[${index}]`, qual);
    });
    labTechnicianDetails.specialization.forEach((spec, index) => {
      formData.append(`specialization[${index}]`, spec);
    });
    labTechnicianDetails.certifications.forEach((cert, index) => {
      formData.append(`certifications[${index}]`, cert);
    });
    Object.keys(labTechnicianDetails.address).forEach((key) => {
      formData.append(`address[${key}]`, labTechnicianDetails.address[key]);
    });
    if (labImg) {
      formData.append("image", labImg);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/profile/create-lab-technician`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        toast.success("Lab Technician profile created successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating Lab Technician profile:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMsg);
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
      <h3 className="text-lg font-medium text-blue-700 mb-4">Lab Technician Details</h3>
      <input
        name="qualifications"
        value={labTechnicianDetails.qualifications.join(", ")}
        onChange={(e) =>
          setLabTechnicianDetails({
            ...labTechnicianDetails,
            qualifications: e.target.value.split(", "),
          })
        }
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Qualifications (comma-separated)"
        autoComplete="off"
      />
      <input
        name="associatedLab"
        value={labTechnicianDetails.associatedLab}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Associated Lab"
        autoComplete="off"
      />
      <input
        name="specialization"
        value={labTechnicianDetails.specialization.join(", ")}
        onChange={(e) =>
          setLabTechnicianDetails({
            ...labTechnicianDetails,
            specialization: e.target.value.split(", "),
          })
        }
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Specialization (comma-separated)"
        autoComplete="off"
      />
      <input
        name="yearsOfExperience"
        type="number"
        value={labTechnicianDetails.yearsOfExperience}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Years of Experience"
        autoComplete="off"
      />
      <input
        name="certifications"
        value={labTechnicianDetails.certifications.join(", ")}
        onChange={(e) =>
          setLabTechnicianDetails({
            ...labTechnicianDetails,
            certifications: e.target.value.split(", "),
          })
        }
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Certifications (comma-separated)"
        autoComplete="off"
      />
      <input
        name="contactNumber"
        value={labTechnicianDetails.contactNumber}
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
          value={labTechnicianDetails.address.street}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="Street Address"
          autoComplete="off"
        />
        <input
          name="city"
          value={labTechnicianDetails.address.city}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="City"
          autoComplete="off"
        />
      </div>
      <div className="flex gap-3 mb-3">
        <input
          name="state"
          value={labTechnicianDetails.address.state}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="State"
          autoComplete="off"
        />
        <input
          name="postalCode"
          value={labTechnicianDetails.address.postalCode}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="Postal Code"
          autoComplete="off"
        />
      </div>
      <div className="flex gap-3 mb-3">
        <input
          name="country"
          value={labTechnicianDetails.address.country}
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
          id="lab-img"
          accept="image/*"
        />
        <label
          htmlFor="lab-img"
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
              {labImg ? labImg.name : "JPG, PNG up to 5MB"}
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
