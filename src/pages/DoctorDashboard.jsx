import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [uid, setUid] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [diabetesPrescription, setDiabetesPrescription] = useState('');
  const [generalPrescription, setGeneralPrescription] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Simulate doctor login data (retrieve from localStorage)
  const loggedInDoctor = JSON.parse(localStorage.getItem('loggedInDoctor')) || { };

  // Fetch patient details by UID
  const fetchPatientDetails = () => {
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    const storedPrescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];

    const patient = Object.values(storedUsers).find((user) => user.uid === uid);

    if (patient) {
      setPatientData(patient);
      setRecentPrescriptions(
        storedPrescriptions.filter((prescription) => prescription.uid === uid).slice(0, 5)
      );
      setError('');
    } else {
      setError('Patient not found. Please check the UID.');
      setPatientData(null);
      setRecentPrescriptions([]);
    }
  };

  // Save prescription to localStorage
  const savePrescription = (type) => {
    if (!diabetesPrescription && !generalPrescription) {
      setError('Please fill in the prescription details before saving.');
      return;
    }

    const newPrescription = {
      uid,
      type,
      details: type === 'diabetes' ? diabetesPrescription : generalPrescription,
      doctor: loggedInDoctor.username,
      date: new Date().toLocaleDateString(),
    };

    const storedPrescriptions = JSON.parse(localStorage.getItem('prescriptions')) || [];
    localStorage.setItem('prescriptions', JSON.stringify([newPrescription, ...storedPrescriptions]));

    // Clear prescription inputs
    if (type === 'diabetes') setDiabetesPrescription('');
    if (type === 'general') setGeneralPrescription('');

    // Refresh recent prescriptions
    setRecentPrescriptions([newPrescription, ...recentPrescriptions]);
    setError('');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Doctor Dashboard</h2>

        {/* UID Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="uid">
            Enter Patient UID
          </label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchPatientDetails}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Fetch Details
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Patient Details */}
        {patientData && (
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Patient Details</h3>
            <p><strong className="text-gray-500">UID:</strong> {patientData.uid}</p>
            <p><strong className="text-gray-500">Name:</strong> {patientData.username}</p>
            <p><strong className="text-gray-500">Age:</strong> {patientData.age}</p>
            <p><strong className="text-gray-500">Gender:</strong> {patientData.gender}</p>
            <p><strong className="text-gray-500">Phone:</strong> {patientData.phone}</p>
          </div>
        )}

        {/* Recent Prescriptions */}
        {recentPrescriptions.length > 0 && (
          <div className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Prescriptions</h3>
            <ul className="space-y-4">
              {recentPrescriptions.map((prescription, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <p><strong className="text-gray-600">Type:</strong> {prescription.type}</p>
                  <p><strong className="text-gray-600">Details:</strong> {prescription.details}</p>
                  <p><strong className="text-gray-600">Date:</strong> {prescription.date}</p>
                  <p><strong className="text-gray-600">Prescribed By:</strong> {prescription.doctor}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prescription Forms */}
        {patientData && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Add Prescription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diabetes Prescription */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="diabetesPrescription">
                 Prescription(for Diabetes)
                </label>
                <textarea
                  id="diabetesPrescription"
                  value={diabetesPrescription}
                  onChange={(e) => setDiabetesPrescription(e.target.value)}
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  onClick={() => savePrescription('diabetes')}
                  className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
                >
                  Save Diabetes Prescription
                </button>
              </div>

              {/* General Prescription */}
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="generalPrescription">
                  General Prescription
                </label>
                <textarea
                  id="generalPrescription"
                  value={generalPrescription}
                  onChange={(e) => setGeneralPrescription(e.target.value)}
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  onClick={() => savePrescription('general')}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
                >
                  Save General Prescription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
