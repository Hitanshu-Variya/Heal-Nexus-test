import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Appbar } from './dashBoard';


const MyProfile = () => {
    const [userdata, setuserdata] = useState(null);
    const [isEdit, setIsedit] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/profile/get-patient`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setuserdata(response.data);
                }
            } catch (error) {
                console.error('Error in Logging out', error);
            }
        };

        fetchProfileData();
    }, []);

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append("age", userdata.age);
            formData.append("gender", userdata.gender);
            formData.append("contactNumber", userdata.contactNumber);
            formData.append("medicalHistory", userdata.medicalHistory);
            formData.append("emergencyContact[name]", userdata.emergencyContact.name);
            formData.append("emergencyContact[relationship]", userdata.emergencyContact.relationship);
            formData.append("emergencyContact[contactNumber]", userdata.emergencyContact.contactNumber);
            formData.append("address[street]", userdata.address.street);
            formData.append("address[city]", userdata.address.city);
            formData.append("address[state]", userdata.address.state);
            formData.append("address[postalCode]", userdata.address.postalCode);
            formData.append("address[country]", userdata.address.country);
            if (image) {
                formData.append("image", image);
            }

            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/profile/update-patient`, formData, {
                withCredentials: true
            });

            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                setIsedit(false);
                setImage(null);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error in Logging out', error);
        }
    };

    const address = userdata?.address || {};
    const emergencyContact = userdata?.emergencyContact || {};
    const medicalHistory = userdata?.medicalHistory || [];

    return (
        <div>
            <Appbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 mt-4">
                {/* Square-shaped container */}
                <div className="w-full sm:w-[400px] lg:w-[500px] xl:w-[600px] p-4 bg-white shadow-md rounded-lg text-sm text-gray-800 space-y-4 aspect-square flex flex-col">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                className="w-32 h-32 rounded-full border bg-gray-200"
                                src={image ? URL.createObjectURL(image) : userdata?.image}
                                alt="Profile"
                            />
                            {isEdit && (
                                <button
                                    className="absolute bottom-2 right-2 bg-blue-500 text-white text-sm font-medium px-2 py-1 rounded-full shadow-md hover:bg-blue-600"
                                    onClick={() => document.getElementById('image').click()}
                                >
                                    Edit
                                </button>
                            )}
                            {isEdit && (
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    hidden
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            {isEdit ? (
                                <input
                                    type="text"
                                    value={userdata?.name}
                                    onChange={(e) => setuserdata((prev) => ({ ...prev, name: e.target.value }))}
                                    className="bg-gray-100 w-full p-2 rounded"
                                />
                            ) : (
                                <h2 className="text-xl font-semibold">{userdata?.name}</h2>
                            )}
                            <p className="text-gray-500">Age: {userdata?.age}</p>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    <div>
                        <h3 className="text-gray-700 font-semibold">Contact Information</h3>
                        <div className="mt-2 space-y-2">
                            <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="text-blue-500">{userdata?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phone:</span>
                                {isEdit ? (
                                    <input
                                        type="text"
                                        value={userdata?.contactNumber}
                                        onChange={(e) => setuserdata((prev) => ({ ...prev, contactNumber: e.target.value }))}
                                        className="bg-gray-100 w-2/3 p-1 rounded"
                                    />
                                ) : (
                                    <span className="text-blue-400">{userdata?.contactNumber}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    <div>
                        <h3 className="text-gray-700 font-semibold">Address</h3>
                        <div className="mt-2 space-y-1">
                            {Object.keys(address).map((key) => (
                                <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key}:</span>
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            value={address[key]}
                                            onChange={(e) =>
                                                setuserdata((prev) => ({
                                                    ...prev,
                                                    address: { ...prev.address, [key]: e.target.value },
                                                }))
                                            }
                                            className="bg-gray-100 w-2/3 p-1 rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-500">{address[key]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    <div>
                        <h3 className="text-gray-700 font-semibold">Emergency Contact</h3>
                        <div className="mt-2 space-y-1">
                            {Object.keys(emergencyContact).map((key) => (
                                <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key}:</span>
                                    {isEdit ? (
                                        <input
                                            type="text"
                                            value={emergencyContact[key]}
                                            onChange={(e) =>
                                                setuserdata((prev) => ({
                                                    ...prev,
                                                    emergencyContact: { ...prev.emergencyContact, [key]: e.target.value },
                                                }))
                                            }
                                            className="bg-gray-100 w-2/3 p-1 rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-500">{emergencyContact[key]}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-gray-300" />

                    <div>
                        <h3 className="text-gray-700 font-semibold">Medical History</h3>
                        {isEdit ? (
                            <textarea
                                value={medicalHistory.join('\n')}
                                onChange={(e) =>
                                    setuserdata((prev) => ({
                                        ...prev,
                                        medicalHistory: e.target.value.split('\n'),
                                    }))
                                }
                                className="bg-gray-100 w-full p-2 rounded h-24"
                            />
                        ) : (
                            <ul className="list-disc pl-5">
                                {medicalHistory.length ? (
                                    medicalHistory.map((item, index) => (
                                        <li key={index} className="text-gray-500">
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No medical history provided</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        {isEdit ? (
                            <button
                                onClick={() => setIsedit(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsedit(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Edit Profile
                            </button>
                        )}

                        {isEdit && (
                            <button
                                onClick={updateUserProfileData} // Calling the function here
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
