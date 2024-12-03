import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/payment/paymentHeader';
import { toast } from 'react-hot-toast';
import PaymentForm from '../../components/payment/paymentForm';
import PaymentStatus from '../../components/payment/paymentStatus';

const PaymentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentData, doctorData } = location.state || {};
  const [showStatus, setShowStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePaymentSuccess = async (paymentMethod) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/appointment/pay-book-appointment/${appointmentData.id}`,
        { paymentMethod },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setPaymentStatus('success');
        setShowStatus(true);
        toast.success('Payment confirmed successfully!');
      }
    } catch (error) {
      setPaymentStatus('error');
      setShowStatus(true);
      toast.error('Payment confirmation failed. Please try again.');
      console.error('Payment confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCancel = () => {
    setPaymentStatus('error');
    setShowStatus(true);
  };

  const handleCloseStatus = () => {
    setShowStatus(false);
    if (paymentStatus === 'success') {
      navigate('/my-appointments');
    }
  };

  if (!appointmentData || !doctorData) {
    return <div className="text-center mt-10">Invalid appointment data. Please try again.</div>;
  }

  return (
    <div>
  <Header />
  <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-blue-800 text-center mb-10">
        Complete Your Payment
      </h2>

      <div className="flex gap-8">
        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 w-full">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6 border-b pb-3">Appointment Details</h3>
          <div className="flex flex-col space-y-4 text-gray-700">
            <div className="flex items-center">
              <span className="font-bold text-blue-700 w-32">Doctor:</span>
              <span className="text-gray-800">{doctorData.userName}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-blue-700 w-32">Date:</span>
              <span className="text-gray-800">{appointmentData.slotDate.replace(/_/g, '/')}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-blue-700 w-32">Time:</span>
              <span className="text-gray-800">{appointmentData.slotTime}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-blue-700 w-32">Amount:</span>
              <span className="text-gray-800 font-semibold">INR {appointmentData.amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <PaymentForm
          appointmentData={appointmentData}
          onSuccess={handlePaymentSuccess}
          onCancel={() => navigate('/my-appointments')}
        />
      </div>
    </div>

    {/* Payment Status */}
    {showStatus && (
      <PaymentStatus
        status={paymentStatus}
        message={
          paymentStatus === 'success'
            ? 'Your payment has been processed successfully. Thank you for choosing HEAL NEXUS.'
            : 'The payment process was cancelled. Please try again or contact support.'
        }
        onClose={handleCloseStatus}
      />
    )}
  </div>
</div>
  
  );
};

export default PaymentDashboard; 