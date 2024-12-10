import './DashboardMain.css'; // Optional: Add your own styles here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandsBubbles, faFilePen, faCamera, faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from "axios";
const DashboardMain = () => {


  const [callHistory, setCallHistory] = useState([]);
  const [error, setError] = useState("");

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



  return (
    <div className="welcome-card">


      <div className="card-row-1">
      <div className="flex flex-col bg-white shadow-lg rounded-lg p-3 w-1/5 mx-2">
  <div className="flex items-center">
    <div className={`rounded-full p-2 bg-orange-500 text-white`}>
      <i className="fas fa-copy"></i>
    </div>
    <div className="ml-2 text-gray-600 text-xs font-bold">Used Space</div>
  </div>
  <div className="mt-3 text-xl font-semibold">$34,245</div>
  <div className="mt-1 flex items-center text-xs text-gray-500">
    <i className="fas fa-exclamation-circle text-red-500 mr-1"></i>
    Get more space
  </div>
</div> 

<div className="flex flex-col bg-white shadow-lg rounded-lg p-3 w-1/5 mx-2">
  <div className="flex items-center">
    <div className={`rounded-full p-2 bg-orange-500 text-white`}>
      <i className="fas fa-copy"></i>
    </div>
    <div className="ml-2 text-gray-600 text-xs font-bold">Used Space</div>
  </div>
  <div className="mt-3 text-xl font-semibold">$34,245</div>
  <div className="mt-1 flex items-center text-xs text-gray-500">
    <i className="fas fa-exclamation-circle text-red-500 mr-1"></i>
    Get more space
  </div>
</div>

<div className="flex flex-col bg-white shadow-lg rounded-lg p-3 w-1/5 mx-2">
  <div className="flex items-center">
    <div className={`rounded-full p-2 bg-orange-500 text-white`}>
      <i className="fas fa-copy"></i>
    </div>
    <div className="ml-2 text-gray-600 text-xs font-bold">Used Space</div>
  </div>
  <div className="mt-3 text-xl font-semibold">$34,245</div>
  <div className="mt-1 flex items-center text-xs text-gray-500">
    <i className="fas fa-exclamation-circle text-red-500 mr-1"></i>
    Get more space
  </div>
</div>


<div className="flex flex-col bg-white shadow-lg rounded-lg p-3 w-1/5 mx-2">
  <div className="flex items-center">
    <div className={`rounded-full p-2 bg-orange-500 text-white`}>
      <i className="fas fa-copy"></i>
    </div>
    <div className="ml-2 text-gray-600 text-xs font-bold">Used Space</div>
  </div>
  <div className="mt-3 text-xl font-semibold">$34,245</div>
  <div className="mt-1 flex items-center text-xs text-gray-500">
    <i className="fas fa-exclamation-circle text-red-500 mr-1"></i>
    Get more space
  </div>
</div>
      </div>



      <div style={{ display: 'flex' }}>
        <div className="task-menu">
          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faMicrophoneLines} /> Speech TO ISL <FontAwesomeIcon icon={faHandsBubbles} />
            </h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faFilePen} /> Text To ISL <FontAwesomeIcon icon={faHandsBubbles} /></h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"> <FontAwesomeIcon icon={faHandsBubbles} /> ISL To  Speech <FontAwesomeIcon icon={faMicrophoneLines} /></h3>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faHandsBubbles} /> ISL TO Text <FontAwesomeIcon icon={faFilePen} /></h3>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3">
            <h3 className="text-xl font-bold mb-2"><FontAwesomeIcon icon={faCamera} /> Make a Video Call</h3>
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
                    <button className='join-btn'>join</button>
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