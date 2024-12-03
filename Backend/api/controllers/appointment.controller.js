import Appointment from '../../data/models/appointment.models.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
import mongoose from 'mongoose';
import User from '../../data/models/user.model.js';

const bookAppointment = async (req, res) => {
  try {
    const { userID } = req;
    const { doctorID, slotTime, slotDate } = req.body;

    const patientData = await PatientProfile.findOne({ userID: userID });
    const doctorData = await DoctorProfile.findById(doctorID);

    if (!patientData || !doctorData) {
      return res.status(400).json({ message: "Patient or Doctor not found" });
    }

    let slot_booked = doctorData.slot_booked;
    if (slot_booked[slotDate]) {
      if (slot_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({ success: false, message: "Doctor not available at this time" });
      } else {
        slot_booked[slotDate].push(slotTime);
      }
    } else {
      slot_booked[slotDate] = [slotTime];
    }

    const newAppointment = new Appointment({
      patientID: patientData._id,
      doctorID,
      amount: doctorData.consultationFee,
      slotDate,
      slotTime,
      date: Date.now(),
    });

    // Save the new appointment and update doctor's slot booking
    await newAppointment.save();
    await DoctorProfile.findByIdAndUpdate(doctorID, { slot_booked });

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};


const getPatientAppointments = async (req, res) => {
  try {
    const { userID } = req

    const patientData = await PatientProfile.find({ userID: userID });
    const appointments = await Appointment.find({ patientID: patientData[0]._id });

    const doctorDataPromises = appointments.map(async (appointment) => {
      const doctorData = await DoctorProfile.findById(appointment.doctorID);
      const doctorSignupData = await User.findById(doctorData.userID);

      return {
        appointmentData: {
          id: appointment._id,
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime,
          cancel: appointment.cancel,
          payment: appointment.payment,
          amount: appointment.amount
        },
        doctorData: {
          image: doctorData.image,
          userName: doctorSignupData.userName,
          specialty: doctorData.specialty,
          address: {
            street: doctorData.clinicAddress.street,
            city: doctorData.clinicAddress.city,
            state: doctorData.clinicAddress.state
          }
        },
      };
    });

    const allAppointmentsData = await Promise.all(doctorDataPromises);
    res.status(200).json({ success: true, allAppointmentsData });

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const { userID } = req;
    console.log(req.params);
    const { appointmentID } = req.params;
    const appointmentData = await Appointment.findById(appointmentID);
    const patientdata = await PatientProfile.find({userID: userID});

    if (appointmentData.patientID.toString() != patientdata[0]._id.toString()) {
      return res.status(400).json({ success: false, message: "Unauthorized Action" })
    }

    await Appointment.findByIdAndUpdate(appointmentID, { cancel: true });

    const { doctorID, slotDate, slotTime } = appointmentData
    const doctorData = await DoctorProfile.findById(doctorID)

    let slot_booked = doctorData.slot_booked;
    slot_booked[slotDate] = slot_booked[slotDate].filter(e => e.slotTime !== slotTime)

    await DoctorProfile.findByIdAndUpdate(doctorID, { slot_booked });
    res.status(200).json({ success: true, message: "Appointment cancelled" })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

const confirmAppointment = async (req, res) => {
  try {
    const { userID } = req;
    const { appointmentID } = req.params;
    const appointmentData = await Appointment.findById(appointmentID);
    const patientdata = await PatientProfile.find({userID: userID});
    
    if (appointmentData.patientID.toString() != patientdata[0]._id.toString()) {
      return res.status(400).json({ success: false, message: "Unauthorized Action" })
    }

    await Appointment.findByIdAndUpdate(appointmentID, { payment: true });

    const { doctorID, slotDate, slotTime } = appointmentData
    const doctorData = await DoctorProfile.findById(doctorID)

    let slot_booked = doctorData.slot_booked;
    slot_booked[slotDate] = slot_booked[slotDate].filter(e => e != slotTime)

    await DoctorProfile.findByIdAndUpdate(doctorID, { slot_booked });
    res.status(200).json({ success: true, message: "Appointment booked with Payment" })

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export { bookAppointment, getPatientAppointments, cancelAppointment, confirmAppointment };