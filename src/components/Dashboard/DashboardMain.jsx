import './DashboardMain.css'; // Optional: Add your own styles here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsBubbles, faFilePen, faCamera, faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PageContext } from '../../pages/Dashbord';
const DashboardMain = () => {
  const navigate = useNavigate();
  const [callHistory, setCallHistory] = useState([]);
  const [error, setError] = useState("");

  const { setPage } = useContext(PageContext);
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
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, []);


  const caling = (dialer) => {
    navigate(`/calling/${dialer}`);
  }


  return (
    <div className="welcome-card">


      <div className="card-row-1">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Card Title 1</h3>
          <p className="text-gray-600">This is a simple card description.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Card Title 2</h3>
          <p className="text-gray-600">This is another card description.</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-bold mb-2">Card Title 3</h3>
          <p className="text-gray-600">This is yet another card description.</p>
        </div>
      </div>



      <div style={{ display: 'flex' }}>
        <div className="task-menu">
          <div className="bg-white shadow-md rounded-lg p-3" onClick={() => setPage(11)}>
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faMicrophoneLines} /> Speech TO ISL <FontAwesomeIcon icon={faHandsBubbles} />
            </h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3" onClick={() => setPage(12)}>
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faFilePen} /> Text To ISL <FontAwesomeIcon icon={faHandsBubbles} /></h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3" onClick={() => setPage(13)}>
            <h3 className="text-xl font-bold mb-2"> <FontAwesomeIcon icon={faHandsBubbles} /> ISL To  Speech <FontAwesomeIcon icon={faMicrophoneLines} /></h3>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faHandsBubbles} /> ISL TO Text <FontAwesomeIcon icon={faFilePen} /></h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faCamera} /> Live Video Translator</h3>
          </div>
        </div>
        <div style={{ flex: '3', paddingRight: '60px' }}>
          <h3 style={{ color: 'white', paddingTop: '30px', textAlign: 'center' }}>Call list for today</h3>
          <div className='current-call-list'>
            {
              callHistory.map(item => {
                let time = item.meetingtime.split(/[T+]/)[1]
                return <div key={item.id} className='item-lists'>
                  <div style={{ display: 'flex', paddingLeft: '30px' }}>
                    <img src='https://up.yimg.com/ib/th?id=OIP.GqGVPkLpUlSo5SmeDogUdwHaHa&pid=Api&rs=1&c=1&qlt=95&w=104&h=104' width={50} height={40} style={{ borderRadius: '50%', marginLeft: '30px' }} />
                    <div style={{ marginLeft: '20px' }}>
                      <h5 style={{ display: 'inline' }}>{item.receiver}</h5>
                      <h6>Time - {time}</h6>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', paddingRight: '60px' }}>
                    <button className='join-btn' onClick={() => caling(item.receiver)}>join</button>
                    <button className='edit-btn'>edit</button>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>











    </div>
  );
};

export default DashboardMain;