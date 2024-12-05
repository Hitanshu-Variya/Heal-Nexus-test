const handleRoleBasedNavigation = (role, navigate) => {
  window.scrollTo(0, 0); 
  switch (role.toLowerCase()) {
    case "doctor":
      navigate("/doctor-dashboard");
      break;
    case "patient":
      navigate("/patient-dashboard");
      break;
    case "admin":
      navigate("/admin-dashboard");
      break;
    case "pharmacist":
      navigate("/pharmacist-dashboard");
      break;
    case "lab-technician":
      navigate("/lab-technician-dashboard");
      break;
    default:
      navigate("/");
  }
};

export default handleRoleBasedNavigation;