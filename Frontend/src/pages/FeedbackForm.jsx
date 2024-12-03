import React, { useState } from "react";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    console.log({ rating: selectedRating, feedback });
    alert("Thank you for your feedback!");
  };

  return (
    <div className="feedback">
    <div className="main-rate-container">
      <div className="rate-container">
        <h2>Rate your experience</h2>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${selectedRating >= star ? "selected" : ""}`}
              onClick={() => handleRatingClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Tell us about your experience!"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button className="sendbtn" onClick={handleSubmit}>Send</button>
      </div>
    </div>
    </div>
  );
};

export default FeedbackForm;
