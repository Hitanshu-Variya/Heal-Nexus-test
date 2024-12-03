export function Quote() {
    return (
      <div className="relative w-full h-full">
        {/* Health-related image */}
        <img 
          src="/assets/appointment_img.png" // Replace this with a real health/doctor image URL
          alt="Health Icon"
          className="w-full h-full object-cover rounded-r-3xl shadow-r-3xl" // Ensure the image covers the card, but doesn't exceed it
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-blue-500 opacity-50 rounded-r-3xl"></div>
        
        {/* Content placed over the image */}
        <div className="relative z-10 text-white p-8">
          {/* You can add any overlay content here if needed */}
        </div>
      </div>
    );
  }