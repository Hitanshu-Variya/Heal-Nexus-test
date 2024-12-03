import DoctorProfile from '../../data/models/profile/profile.doctor.js';

export const filterDoctorsByState = async (req, res) => {
  try {
    const { state } = req.body;
    const doctors = await DoctorProfile.find({ 'clinicAddress.state': state });

    if (!doctors.length) {
      return res.status(404).json({ message: "No doctors found with the specified specialty" });
    }

    console.log(doctors);
    res.status(200).json(doctors);
    
  } catch (error) {
    const error_response = getErrorDetails('INTERNAL_SERVER_ERROR', 'Error in filtering doctors by specialty');
    return res.status(error_response.code).json({ message: error_response.message });
  }
};

export const filterDoctorsByCity = async (req, res) => {
    try {
      const { city } = req.body;
      if (!city) {
        return res.status(400).json({ message: "City parameter is required" });
      }
  
      const doctors = await DoctorProfile.find({ 'clinicAddress.city': city });
      if (!doctors.length) {
        return res.status(404).json({ message: "No doctors found in the specified city" });
      }
  
      console.log(doctors);
      res.status(200).json(doctors);

    } catch (error) {
      const error_response = getErrorDetails('INTERNAL_SERVER_ERROR', 'Error in filtering doctors by city');
      return res.status(error_response.code).json({ message: error_response.message });
    }
  };
