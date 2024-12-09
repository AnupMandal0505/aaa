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
        `http://127.0.0.1:8000/api/update_call/${popup.id}`,
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
    <div className='tour-data-body' style={{ display: 'flex', flexDirection: 'column' }}>
      <div className='tour-data-table'>
        <DataGrid
          rows={callHistory}
          columns={columns}
          onRowClick={(e) => { setPopup(e) }}
        />
      </div>
      {
        popup != null && <div className='callHistory-pop-up'>
          <div style={{ display: 'flex', justifyContent: 'end' }}><h6 style={{ textAlign: 'end', paddingRight: '10px', backgroundColor: 'red', display: 'inline', padding: '5px', borderTopRightRadius: '10px' }} onClick={() => setPopup(null)}>X</h6></div>

          <div className='call-history-popup-box'>
            <h3>Update Call Info</h3>
            <form  onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
              <input type="datetime-local" id="appointment"  onChange={(e) => setMeetingtime(e.target.value)} name="meetingtime" required />
              <textarea name="message"  onChange={(e) => setMessage(e.target.value)}  placeholder='Optional Massage' style={{ maxHeight: '100px', minHeight: '100px', maxWidth: '200px', minWidth: '200px' }} />
              <button type="submit" className='update-popup'>Update</button>
            </form>
          </div>
        </div>
      }
    </div>
  )
}

export default CallHistory