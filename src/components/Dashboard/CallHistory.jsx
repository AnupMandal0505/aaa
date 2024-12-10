/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from "axios";
import './CallHistory.css'

const CallHistory = () => {


  const [callHistory, setCallHistory] = useState([]);
  const [error, setError] = useState("");

  const [meetingtime, setMeetingtime] = useState('');
  const [message, setMessage] = useState('');


  const fetchCallHistory = async () => {
    try {
      const token = localStorage.getItem("token"); // Replace with your token retrieval logic
      const response = await axios.get(
        "https://signwave-api-ydf3.onrender.com/api/create_call",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCallHistory(response.data); // Assuming the response contains an array of callHistory
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching callHistory history:", err);
      setError(err.response?.data?.message || "Failed to fetch callHistory history");
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, []);


  const signupData = {
    meetingtime,
    message,
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(signupData);
    // Proceed with registration
    
    if (!popup?.id) {
      alert("No call selected for update.");
      return;
    }


    try {
      console.log(e);
      const token = localStorage.getItem("token");
  if (!token) {
    setError("No token found. Please log in again.");
    return;
  }

      const response = await axios.put(
        `https://signwave-api-ydf3.onrender.com/api/update_call/${popup.id}`,
        signupData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
            // 'Content-Type': 'application/json', // Ensure proper content type
          },
        }
      );
      if (response.status === 200) {
        alert('Update successful!');
        fetchCallHistory(); // Refresh the call history after update
      }else{
        alert('Update Not successful!');
        fetchCallHistory(); // Refresh the call history after update


      }
    } catch (err) {
      // Display error message
      // console.error('Error during signup', err); // This will log the error for debugging purposes
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      alert('Update Not successful!');

    }
    //  finally {
    //   setLoading(false); // Stop loading state
    // }
    setPopup(null);

  };

  const [popup, setPopup] = useState(null);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'created_at', headerName: 'Time', width: 350 },
    { field: 'meetingtime', headerName: 'Meeting Time', width: 300 },
    { field: 'message', headerName: 'Message', width: 300 },
    { field: 'receiver', headerName: 'Receiver', width: 150 },
    { field: 'updated_at', headerName: 'Updated At', width: 150 },
  ];


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
    {/* Navbar */}
    <nav className="w-full bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">ISL Translator</div>
        <ul className="hidden md:flex space-x-6 text-gray-600">
          <li className="hover:text-blue-500 cursor-pointer">Home</li>
          <li className="hover:text-blue-500 cursor-pointer">Features</li>
          <li className="hover:text-blue-500 cursor-pointer">About</li>
          <li className="hover:text-blue-500 cursor-pointer">Contact</li>
        </ul>
        <div className="md:hidden">
          <button className="text-gray-600 focus:outline-none">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <header className="w-full bg-blue-500 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Bridging Communication with Indian Sign Language
        </h1>
        <p className="mt-4 text-lg">
          Empowering individuals with a seamless speech-to-ISL translator.
        </p>
        <button className="mt-6 px-8 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </header>

    {/* Features Section */}
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-microphone-alt text-blue-500 text-4xl"></i>
            <h3 className="mt-4 text-xl font-bold text-gray-800">Speech-to-ISL</h3>
            <p className="mt-2 text-gray-600">
              Convert spoken words into Indian Sign Language in real time.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-language text-green-500 text-4xl"></i>
            <h3 className="mt-4 text-xl font-bold text-gray-800">Text-to-ISL</h3>
            <p className="mt-2 text-gray-600">
              Translate written text into ISL gestures and visuals.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-hands text-red-500 text-4xl"></i>
            <h3 className="mt-4 text-xl font-bold text-gray-800">Gesture Recognition</h3>
            <p className="mt-2 text-gray-600">
              Recognize and process ISL gestures into text or speech.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Call to Action */}
    <section className="py-16 bg-blue-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Start Using ISL Translator Today!</h2>
        <p className="mt-4 text-lg">
          Break barriers and enhance communication with our cutting-edge ISL tools.
        </p>
        <button className="mt-6 px-8 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100">
          Sign Up Now
        </button>
      </div>
    </section>

    {/* Footer */}
    <footer className="w-full bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 ISL Translator. All Rights Reserved.</p>
      </div>
    </footer>
    </div>
  )
}

export default CallHistory