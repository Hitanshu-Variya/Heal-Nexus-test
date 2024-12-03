import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PaymentStatus({ status, message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          {status === 'success' ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          )}
          <h3 className="mt-4 text-xl font-semibold text-blue-900">
            {status === 'success' ? 'Payment Successful' : 'Payment Cancelled'}
          </h3>
          <p className="mt-3 text-gray-600">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 w-full inline-flex justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}