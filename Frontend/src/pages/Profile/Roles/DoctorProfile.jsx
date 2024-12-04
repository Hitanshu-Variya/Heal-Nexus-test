import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from 'zod';

export const doctorSchema = z.object({
  specialty: z
    .string()
    .min(5, { message: "Specialty must be at least 5 characters long" }),

  qualifications: z
    .array(z.string().min(3, { message: "Qualification must be at least 3 characters long" }))
    .min(1, { message: "At least one qualification is required" }),

  experience: z
    .string()
    .refine((val) => !isNaN(val) && parseInt(val) > 0, { message: "Experience must be a positive number" }),

  contactNumber: z
    .string()
    .length(10, { message: "Contact number must be exactly 10 digits" })
    .regex(/^[0-9]+$/, { message: "Contact number must be numeric" }),

  consultationFee: z
    .string()
    .refine((val) => !isNaN(val) && parseFloat(val) > 0, { message: "Consultation fee must be a positive number" }),

  clinicAddress: z.object({
    street: z
      .string()
      .min(5, { message: "Street address must be at least 5 characters long" }),

    city: z
      .string()
      .min(3, { message: "City must be at least 3 characters long" }),

    state: z
      .string()
      .min(3, { message: "State must be at least 3 characters long" }),

    postalCode: z
      .string()
      .length(6, { message: "Postal Code must be exactly 6 digits" })
      .regex(/^[0-9]+$/, { message: "Postal Code must be numeric" }),

    country: z
      .string()
      .min(3, { message: "Country is required" }),
  }),

  biography: z
    .string()
    .min(5, { message: "Biography must be at least 5 characters long" }),
});

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [docImg, setDocImg] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({
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
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setDocImg(e.target.files[0]); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const field = name.split('.')[1];
    
    setDoctorDetails((prevDetails) => ({
      ...prevDetails,
      clinicAddress: {
        ...prevDetails.clinicAddress,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Validate doctorDetails using the doctorSchema
    const validationResult = doctorSchema.safeParse(doctorDetails);
  
    if (!validationResult.success) {
      // If validation fails, show error messages for each field
      validationResult.error.errors.forEach((err) => {
        toast.error(err.message); // Show validation error message
      });
      setLoading(false);
      return; // Stop form submission if validation fails
    }
  
    const formData = new FormData();
    formData.append("specialty", doctorDetails.specialty);
    formData.append("experience", doctorDetails.experience);
    formData.append("contactNumber", doctorDetails.contactNumber);
    formData.append("consultationFee", doctorDetails.consultationFee);
    formData.append("biography", doctorDetails.biography);
  
    // Append qualifications to formData
    doctorDetails.qualifications.forEach((qualification, index) => {
      formData.append(`qualifications[${index}]`, qualification);
    });
  
    // Append clinicAddress to formData
    Object.keys(doctorDetails.clinicAddress).forEach((key) => {
      formData.append(`clinicAddress[${key}]`, doctorDetails.clinicAddress[key]);
    });
  
    // Append image if present
    if (docImg) {
      formData.append("image", docImg);
    }
  
    try {
      // Sending the form data to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/profile/create-doctor`,
        formData,
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        toast.success("Doctor profile created successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating doctor profile:", error.response?.data || error.message);
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
      <h3 className="text-lg font-medium text-blue-700 mb-4">Doctor Details</h3>
      <input
        name="specialty"
        value={doctorDetails.specialty}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Specialty"
        autoComplete="off"
      />
      <input
        name="experience"
        value={doctorDetails.experience}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Experience (years)"
        autoComplete="off"
      />
      <input
        name="contactNumber"
        value={doctorDetails.contactNumber}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Contact Number"
        autoComplete="off"
      />
      <input
        name="consultationFee"
        value={doctorDetails.consultationFee}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg"
        placeholder="Consultation Fee"
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
            <span className="text-sm text-gray-500 mt-1">{docImg ? docImg.name : 'JPG, PNG up to 5MB'}</span>
          </div>
        </label>
      </div>
    </div>

    {/* Right Section */}
    <div className="md:w-1/2 pl-6">
      <h3 className="text-lg font-medium text-blue-700 mb-4">Clinic Address</h3>
      <div className="flex gap-3 mb-3">
        <input
          name="clinicAddress.street"
          value={doctorDetails.clinicAddress.street}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="Street"
          autoComplete="off"
        />
        <input
          name="clinicAddress.city"
          value={doctorDetails.clinicAddress.city}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="City"
          autoComplete="off"
        />
      </div>
      <div className="flex gap-3 mb-3">
        <input
          name="clinicAddress.state"
          value={doctorDetails.clinicAddress.state}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="State"
          autoComplete="off"
        />
        <input
          name="clinicAddress.postalCode"
          value={doctorDetails.clinicAddress.postalCode}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="Postal Code"
          autoComplete="off"
        />
      </div>
      <div className="flex gap-3 mb-3">
        <input
          name="clinicAddress.country"
          value={doctorDetails.clinicAddress.country}
          onChange={handleAddressChange}
          className="w-1/2 p-2 border border-blue-300 rounded-lg"
          placeholder="Country"
          autoComplete="off"
        />
        <div className="w-1/2"></div>
      </div>
      <h3 className="text-lg font-medium text-blue-700 mb-4 mt-4">Biography</h3>
      <textarea
        name="biography"
        value={doctorDetails.biography}
        onChange={handleChange}
        className="w-full p-2 mb-3 border border-blue-300 rounded-lg !bg-white"
        placeholder="Biography"
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
