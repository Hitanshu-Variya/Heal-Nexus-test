import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import LabTechnicianProfile from '../../data/models/profile/profile.labTechnician.js';
import PharmacistProfile from '../../data/models/profile/profile.pharmacist.js';
import Appointment from '../../data/models/appointment.models.js';
import AdminProfile from '../../data/models/profile/profile.admin.js';
import User from '../../data/models/user.model.js';
import getErrorDetails from '../../Utilites/errorCodes.js'
import jwt from 'jsonwebtoken';


const getAdminProfile = async (req, res) => {
  try {
    const adminProfile = await AdminProfile.findById(req.params.id);
    if (!adminProfile) {
      return res.status(404).json({ message: 'Resource not found: Admin not found' });
    }
    const response = { 
      address: adminProfile.address, 
      permissions: adminProfile.permissions 
    };

    const error = getErrorDetails('SUCCESS');
    res.status(error.code).json({
      response
    });

  } catch (error) {
    const error_response = getErrorDetails('INTERNAL_SERVER_ERROR', 'Error in getting the profile for admin');
    return res.status(error_response.code).json({message : error_response.message});
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { address, permissions } = req.body;
    const oldAdminProfile = {
      address, 
      permissions
    };

   const updateAdmin = await AdminProfile.findByIdAndUpdate(
      req.params.id,
      oldAdminProfile,
      { new: true, runValidators: true }
    );

    if (!updateAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const error = getErrorDetails('SUCCESS');
    res.status(error.code).json({
      message: 'Admin profile Updated successfully',
    });

  } catch (error) {
    const error_response = getErrorDetails('INTERNAL_SERVER_ERROR', 'Error in Updating the profile for admin');
    return res.status(error_response.code).json({message : error_response.message});
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

const allVerifiedDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({isVerified: true});
    const doctorData = await Promise.all(
      doctors.map(async (doctor) => {
        const user = await User.findById(doctor.userID); 
        return {
          ...doctor.toObject(), 
          userData: user ? user : null, 
        };
      })
    );

    res.status(200).json({ success: true, doctorData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const allUnVerifiedDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find({isVerified: false});
      const doctorData = await Promise.all(
        doctors.map(async (doctor) => {
          const user = await User.findById(doctor.userID); 
          return {
            ...doctor.toObject(), 
            userData: user ? user : null, 
          };
        })
      );

    res.json({ success: true, doctorData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const approveDoctor = async (req, res) => {
  try {
    const { doctorID } = req.params;
    await DoctorProfile.findByIdAndUpdate(doctorID, { isVerified: true });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.json({ success: true, appointments })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });

  }
}

const adminDashboard = async (req, res) => {
  try {
    const users = await PatientProfile.find({});
    const doctors = await DoctorProfile.find({});
    const appointments = await Appointment.find({ isCompleted: false });
    const labTechnicians = await LabTechnicianProfile.find({});
    const pharmacists = await PharmacistProfile.find({});

    const detailedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        // Fetch patient and doctor details
        const patient = await PatientProfile.findById(appointment.patientID); 
        const doctor = await DoctorProfile.findById(appointment.doctorID); 

        // Fetch user details for patient and doctor
        const patientData = patient ? await User.findById(patient.userID) : null;
        const doctorData = doctor ? await User.findById(doctor.userID) : null;

        // Handle missing user data
        if (!patientData || !doctorData) {
          console.error('Missing user data for patient or doctor');
          return null;  // or handle as you see fit (e.g., return a default value or error message)
        }

        return {
          slotDate: appointment.slotDate, 
          slotTime: appointment.slotTime,
          amount: appointment.amount, 
          patientName: patientData.userName, 
          patientImage: patient.image,
          patientAge: patient.age, 
          doctorName: doctorData.userName,
          doctorImage: doctor.image
        };
      })
    );

    // Filter out null values in detailedAppointments if any user data is missing
    const validDetailedAppointments = detailedAppointments.filter(item => item !== null);

    const dashboardData = {
      users: users.length,
      doctors: doctors.length,
      appointments: appointments.length,
      labTechnicians: labTechnicians.length,
      pharmacists: pharmacists.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    };

    res.status(200).json({ success: true, dashboardData, detailedAppointments: validDetailedAppointments });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export { getAdminProfile, updateAdminProfile, adminLogin, allVerifiedDoctors, allUnVerifiedDoctors, approveDoctor, appointmentsAdmin, adminDashboard };