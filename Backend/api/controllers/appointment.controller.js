import Appointment from '../../data/models/appointment.models.js';
import PatientProfile from '../../data/models/profile/profile.patient.js';
import DoctorProfile from '../../data/models/profile/profile.doctor.js';
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

    const newAppointment = new Appointment({
      patientID: patientData._id,
      doctorID,
      amount: doctorData.consultationFee,
      slotDate,
      slotTime,
      date: Date.now(),
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};


const getPatientAppointments = async (req, res) => {
  try {
    const { userID } = req;

    const patientData = await PatientProfile.findOne({ userID: userID });
    if (!patientData) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const appointments = await Appointment.find({ patientID: patientData._id });
    if (!appointments.length) {
      return res.status(200).json({ success: true, allAppointmentsData: [] });
    }

    const doctorDataPromises = appointments.map(async (appointment) => {
      const doctorData = await DoctorProfile.findById(appointment.doctorID);
      const doctorSignupData = await User.findById(doctorData?.userID);

      if (!doctorData || !doctorSignupData) {
        return null;
      }

      return {
        appointmentData: {
          id: appointment._id,
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime,
          cancel: appointment.cancel,
          payment: appointment.payment,
          isCompleted: appointment.isCompleted,
          amount: appointment.amount
        },
        doctorData: {
          image: doctorData.image,
          userName: doctorSignupData.userName,
          specialty: doctorData.specialty,
          address: {
            street: doctorData.clinicAddress?.street,
            city: doctorData.clinicAddress?.city,
            state: doctorData.clinicAddress?.state
          }
        },
      };
    });

    const allAppointmentsData = (await Promise.all(doctorDataPromises)).filter(Boolean);
    res.status(200).json({ success: true, allAppointmentsData });

  } catch (error) {
    console.error("Error in getPatientAppointments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userID } = req;
    const { appointmentID } = req.params;
    const appointmentData = await Appointment.findById(appointmentID);
    const patientdata = await PatientProfile.find({userID: userID});

    if (appointmentData.patientID.toString() != patientdata[0]._id.toString()) {
      return res.status(400).json({ success: false, message: "Unauthorized Action" })
    }

    await Appointment.findByIdAndUpdate(appointmentID, { cancel: true });

    if (!appointmentData.payment) {
      const { doctorID, slotDate, slotTime } = appointmentData;
      const doctorData = await DoctorProfile.findById(doctorID);

      let slot_booked = doctorData.slot_booked;
      if (slot_booked[slotDate]) {
        slot_booked[slotDate] = slot_booked[slotDate].filter(time => time !== slotTime);
      }

      await DoctorProfile.findByIdAndUpdate(doctorID, { slot_booked });
    }

    res.status(200).json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const confirmAppointment = async (req, res) => {
  try {
    const { userID } = req;
    const { appointmentID } = req.params;
    const appointmentData = await Appointment.findById(appointmentID);
    const patientdata = await PatientProfile.find({userID: userID});
    
    if (appointmentData.patientID.toString() != patientdata[0]._id.toString()) {
      return res.status(400).json({ success: false, message: "Unauthorized Action" })
    }

    const { doctorID, slotDate, slotTime } = appointmentData;
    const doctorData = await DoctorProfile.findById(doctorID);

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

    await Promise.all([
      Appointment.findByIdAndUpdate(appointmentID, { payment: true }),
      DoctorProfile.findByIdAndUpdate(doctorID, { slot_booked })
    ]);

    res.status(200).json({ success: true, message: "Appointment booked with Payment" });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const doctorProfile = await DoctorProfile.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const appointments = await Appointment.find({ 
      doctorID: doctorId,
      cancel: false 
    });

    const bookedSlots = [];
    
    const slot_booked = doctorProfile.slot_booked || {};
    Object.entries(slot_booked).forEach(([date, times]) => {
      times.forEach(time => {
        bookedSlots.push({
          slotDate: date,
          slotTime: time,
          cancel: false,
          payment: true
        });
      });
    });

    // Add unpaid appointments
    appointments.forEach(appointment => {
      if (!appointment.payment) {
        bookedSlots.push({
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime,
          cancel: false,
          payment: false
        });
      }
    });

    res.status(200).json({
      success: true,
      bookedSlots
    });

  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({
      success: false, 
      message: 'Error fetching booked slots'
    });
  }
};

export { bookAppointment, getPatientAppointments, cancelAppointment, confirmAppointment, getBookedSlots };