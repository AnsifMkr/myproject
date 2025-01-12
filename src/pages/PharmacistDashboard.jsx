import React, { useState, useEffect } from 'react';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    try {
      // Retrieve registered users and prescriptions from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
      const storedPrescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];

      // Format the prescriptions to include patient details
      const detailedPrescriptions = storedPrescriptions.map((prescription) => {
        const patient = Object.values(registeredUsers).find(user => user.uid === prescription.uid);
        return {
          ...prescription,
          username: patient ? patient.username : 'Unknown',
          address: patient ? patient.address : 'Unknown',
          phone: patient ? patient.phone : 'Unknown',
        };
      });

      // Set the detailed prescriptions to the state
      setPrescriptions(detailedPrescriptions);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Pharmacist Dashboard</h2>

        {/* Prescriptions Section */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <ul className="space-y-4">
              {prescriptions.map((prescription, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
                  <p><strong className="text-gray-600">Patient UID:</strong> {prescription.uid}</p>
                  <p><strong className="text-gray-600">Username:</strong> {prescription.username}</p>
                  <p><strong className="text-gray-600">Address:</strong> {prescription.address}</p>
                  <p><strong className="text-gray-600">Phone:</strong> {prescription.phone}</p>
                  <p><strong className="text-gray-600">Medication:</strong> {prescription.medication || 'No medication listed'}</p>
                  <p><strong className="text-gray-600">Date:</strong> {prescription.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No prescriptions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;