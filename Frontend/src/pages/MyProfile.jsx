import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Appbar } from './dashBoard';
import { patientSchema } from './Profile/Roles/PatientProfile';
import { z } from 'zod';

// Define image validation schema (similar to DoctorMyProfile)
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

const MyProfile = () => {
    const [userdata, setuserdata] = useState({
        age: "",
        gender: "",
        email: "",
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
        medicalHistory: [],
    });
    const [isEdit, setIsedit] = useState(false);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/profile/get-patient`,
                    { withCredentials: true }
                );

                if (response.status === 200) {
                    setuserdata(response.data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error("Failed to load profile data");
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

    const updateUserProfileData = async () => {
        setIsLoading(true);
        try {
            // Validate image if present
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

            // Validate profile data using patientSchema
            const validationResult = patientSchema.safeParse(userdata);
            if (!validationResult.success) {
                validationResult.error.errors.forEach(err => {
                    toast.error(err.message);
                });
                setIsLoading(false);
                return;
            }

            const formData = new FormData();

            // Append basic fields
            formData.append("age", userdata.age);
            formData.append("gender", userdata.gender);
            formData.append("contactNumber", userdata.contactNumber);
            
            // Append medical history
            userdata.medicalHistory.forEach((history, index) => {
                formData.append(`medicalHistory[${index}]`, history);
            });

            // Append emergency contact details
            Object.entries(userdata.emergencyContact).forEach(([key, value]) => {
                formData.append(`emergencyContact[${key}]`, value);
            });

            // Append address details
            Object.entries(userdata.address).forEach(([key, value]) => {
                formData.append(`address[${key}]`, value);
            });

            if (image) {
                formData.append("image", image);
            }

            const response = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/profile/update-patient`,
                formData,
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                setIsedit(false);
                setImage(null);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Appbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-4">
                <div className="w-full sm:w-[400px] lg:w-[500px] xl:w-[600px] p-4 bg-white shadow-md rounded-lg text-sm text-gray-800 space-y-4">
                    {/* Profile Image and Basic Info */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                className="w-32 h-32 rounded-full border bg-gray-200"
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
                                        hidden
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex-1">
                            {isEdit ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={userdata?.age}
                                        onChange={(e) => setuserdata(prev => ({ ...prev, age: e.target.value }))}
                                        className="bg-gray-100 w-full p-2 rounded"
                                        placeholder="Age"
                                    />
                                    <select
                                        value={userdata?.gender}
                                        onChange={(e) => setuserdata(prev => ({ ...prev, gender: e.target.value }))}
                                        className="bg-gray-100 w-full p-2 rounded"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-500">Age: {userdata?.age}</p>
                                    <p className="text-gray-500">Gender: {userdata?.gender}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-gray-700 font-semibold">Contact Information</h3>
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="text-blue-500">{userdata?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phone:</span>
                                {isEdit ? (
                                    <input
                                        type="text"
                                        value={userdata?.contactNumber}
                                        onChange={(e) => setuserdata(prev => ({
                                            ...prev,
                                            contactNumber: e.target.value
                                        }))}
                                        className="bg-gray-100 w-2/3 p-1 rounded"
                                    />
                                ) : (
                                    <span className="text-gray-500">{userdata?.contactNumber}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    {/* Address */}
                    <div>
                        <h3 className="text-gray-700 font-semibold">Address</h3>
                        <div className="mt-2 space-y-1">
                            {Object.keys(userdata?.address || {}).map((key) => (
                                <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key}:</span>
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            value={userdata.address[key]}
                                            onChange={(e) => setuserdata(prev => ({
                                                ...prev,
                                                address: {
                                                    ...prev.address,
                                                    [key]: e.target.value
                                                }
                                            }))}
                                            className="bg-gray-100 w-2/3 p-1 rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-500">{userdata.address[key]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    {/* Emergency Contact */}
                    <div>
                        <h3 className="text-gray-700 font-semibold">Emergency Contact</h3>
                        <div className="mt-2 space-y-1">
                            {Object.keys(userdata?.emergencyContact || {}).map((key) => (
                                <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key}:</span>
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            value={userdata.emergencyContact[key]}
                                            onChange={(e) => setuserdata(prev => ({
                                                ...prev,
                                                emergencyContact: {
                                                    ...prev.emergencyContact,
                                                    [key]: e.target.value
                                                }
                                            }))}
                                            className="bg-gray-100 w-2/3 p-1 rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-500">
                                            {userdata.emergencyContact[key]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    {/* Medical History */}
                    <div>
                        <h3 className="text-gray-700 font-semibold">Medical History</h3>
                        {isEdit ? (
                            <textarea
                                value={userdata?.medicalHistory?.join('\n')}
                                onChange={(e) => setuserdata(prev => ({
                                    ...prev,
                                    medicalHistory: e.target.value.split('\n')
                                }))}
                                className="bg-gray-100 w-full p-2 rounded h-24 mt-2"
                                placeholder="Enter medical history (one per line)"
                            />
                        ) : (
                            <ul className="list-disc pl-5 mt-2">
                                {userdata?.medicalHistory?.length ? (
                                    userdata.medicalHistory.map((item, index) => (
                                        <li key={index} className="text-gray-500">{item}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No medical history provided</li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-4">
                        {isEdit ? (
                            <>
                                <button
                                    onClick={() => setIsedit(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateUserProfileData}
                                    className={`bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center ${
                                        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
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
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;