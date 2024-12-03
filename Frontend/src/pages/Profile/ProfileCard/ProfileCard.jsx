import React from "react";
import { useParams } from "react-router-dom";
import AdminProfile from "../Roles/AdminProfile";
import PatientProfile from "../Roles/PatientProfile";
import DoctorProfile from "../Roles/DoctorProfile";
import PharmacistProfile from "../Roles/PharmacistProfile";
import LabTechnicianProfile from "../Roles/LabTechnicianProfile";

export function ProfileCard() {
    const { role } = useParams();
    const Role = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="bg-white min-h-screen p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6">{`${Role} Profile`}</h1>
            <div className="w-auto">
                {role === "admin" ? (
                    <AdminProfile />
                ) : role === "patient" ? (
                    <PatientProfile />
                ) : role === "doctor" ? (
                    <DoctorProfile />
                ) : role === "pharmacist" ? (
                    <PharmacistProfile />
                ) : role === "lab-technician" ? (
                    <LabTechnicianProfile />
                ) : (
                    <p className="text-red-500">Please select a valid role.</p>
                )}
            </div>
        </div>
    );
}
