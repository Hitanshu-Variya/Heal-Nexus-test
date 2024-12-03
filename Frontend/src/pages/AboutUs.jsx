import React from "react";
import { Footer } from "./landingPage";

const AboutUs = () => {
  const goBackToHome = () => {
    window.location.href = "/"; 
  };

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-blue-300 min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 mt-12 bg-white rounded-2xl shadow-lg flex-1">
        <div className="text-center mb-12">
          <img 
            src='/assets/heal_logo.png'
            alt="Heal Nexus Logo" 
            className="mx-auto mb-6 w-48 sm:w-80 transition-transform transform hover:scale-110 duration-300" 
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 uppercase tracking-wide mb-6">
            About Heal Nexus
          </h1>
        </div>

        <div className="space-y-12">
          {/* Section 1: About Us */}
          <div>
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium mb-6">
              Heal Nexus is a comprehensive platform designed to simplify healthcare access. It allows patients to compare and select healthcare providers, manage appointments, and utilize a wide range of medical services. The platform enhances the patient experience with features like appointment booking, specialist search, medicine orders, report generation, and secure payment processing.
            </p>
          </div>

          {/* Section 2: Key Features */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-600 mb-6">
              Key Features of Heal Nexus
            </h2>
            <ul className="list-none space-y-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-700">
              <li><strong className="font-semibold text-indigo-600">Login & Registration:</strong> Patients can securely create accounts, log in, and manage their profiles.</li>
              <li><strong className="font-semibold text-indigo-600">Search Specialists:</strong> Patients can search and filter doctors by specialty, location, and ratings.</li>
              <li><strong className="font-semibold text-indigo-600">Book Appointments:</strong> Users can view doctor profiles and available slots to book and cancel appointments.</li>
              <li><strong className="font-semibold text-indigo-600">Provide Reviews:</strong> After appointments, patients can rate and review specialists.</li>
              <li><strong className="font-semibold text-indigo-600">Order Medicine:</strong> Patients can order prescribed medicines online for home delivery.</li>
              <li><strong className="font-semibold text-indigo-600">Manage Appointments:</strong> Doctors can view, update, and cancel patient appointments.</li>
              <li><strong className="font-semibold text-indigo-600">Prescription Management:</strong> Doctors can create and manage prescriptions, which are accessible to patients and pharmacies.</li>
              <li><strong className="font-semibold text-indigo-600">Manage Users & Specialists:</strong> Admins can manage user roles, specialist profiles, and update details in real-time.</li>
              <li><strong className="font-semibold text-indigo-600">Emergency Services:</strong> Hospitals can efficiently manage and dispatch emergency services.</li>
              <li><strong className="font-semibold text-indigo-600">Report Generation:</strong> Pathologists can generate and upload reports that are shared with doctors and patients.</li>
              <li><strong className="font-semibold text-indigo-600">Payment System:</strong> Secure payment processing for services and medicines is integrated.</li>
            </ul>
          </div>
        </div>

        {/* Go Back to Home Page Button */}
        <div className="text-center mt-12">
          <button
            className="px-6 sm:px-8 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 duration-200"
            onClick={goBackToHome}
          >
            Go Back to Home Page
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default AboutUs;
