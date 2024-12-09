"use client"
import React, { useEffect, useRef, useState } from 'react';
import { initializeHandTracking } from './helper'
import { toggleAudio, toggleVideo } from './localStream'
import { useSocket } from '../../Context/SocketProvider';
import './VideoCall.css';

const CallDashboard
  = () => {
    const canvasRef = useRef(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentWord, setCurrentWord] = useState([]);
    const [sentence, setSentence] = useState([]);
    const [prediction, setPrediction] = useState('');

    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    // Arghya's assigned states
    const [isFildOn, setIsFieldOn] = useState(false);
    const [isText, setIsText] = useState(true);
    const [isSpeak, setIsSpeak] = useState(true);
    const toggleText = () => {
      setIsText(!isText);
      setIsFieldOn(!isFildOn);
    }
    const toggleSpeak = () => setIsSpeak(!isSpeak);

    //

    const handTrackerRef = useRef(null);
    const prevCharacterRef = useRef('');
    const consecutiveCountRef = useRef(0);
    const requiredCount = 10;

    const {
      localVideoRef,
      remoteVideoRef,
      remoteUserName,
      localMediaStream
    } = useSocket();

    const waitForRemoteStream = async (stream) => {
      // Polling interval in milliseconds
      const interval = 100;

      // Function to check if remoteVideoRef is ready
      const checkRemoteVideoRef = () => {
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (remoteVideoRef?.current && remoteVideoRef.current?.srcObject) {
              clearInterval(checkInterval);
              resolve(remoteVideoRef.current);
            }
          }, interval);
        });
      };

      try {
        const videoRefElement = await checkRemoteVideoRef();
        console.log(stream, videoRefElement);
      } catch (error) {
        console.error("Error waiting for remoteVideoRef:", error);
      }
    };


    useEffect(() => {
      let stream = null;
      let intervalId = null;

      waitForRemoteStream(stream)
        .then(() => initializeHandTracking({
          setIsLoading,
          canvasRef,
          remoteVideoRef,
          handTrackerRef,
          setError,
          prevCharacterRef,
          consecutiveCountRef,
          requiredCount,
          currentWord,
          setSentence,
          setCurrentWord,
          sentence,
          setPrediction,
          intervalId
        }))
        .catch((err) => {
          console.log(`Error waiting for remote stream ${err}`)
        })

      return () => {
        if (stream) {
          console.log("Destructer stream")
          //@ts-ignore
          stream.getTracks().forEach((track) => track.stop());
        }
        if (intervalId) {
          clearInterval(intervalId)
        }
        if (handTrackerRef.current) {
          handTrackerRef.current?.close();
        }
      };
    }, []);

    return (
      <div className="flex flex-col items-center h-screen bg-gray-100">
        {isLoading && <h1 className='mt-2'>Calling to {remoteUserName}....</h1>}
        <div style={{ display: 'flex' }}>
          <div className="">

            {/* Receiver's Video Feed (Large Screen) */}
            <div className={`${isFildOn ? "riciver-video-left" : "riciver-video-right"}`}>
              <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay muted />

              {/* Audio Control (Mute/Unmute) */}
              {/*
          <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-50 p-2 rounded-full cursor-pointer" onClick={toggleAudio}>
            {isAudioOn ? (
              <span className="text-white text-xl">🔊</span>
            ) : (
              <span className="text-white text-xl">🔇</span>
            )}
          </div>
          */}
            </div>


            <div className={`${isFildOn ? "overlay-video-call-left" : "overlay-video-call-right"}`}>
              {/* Audio Toggle Button (Below the Screens) */}
              <div className="call-menu">
                <button
                  className={' text-white p-2 bg-red-500'}
                  onClick={() => window.location.replace('/')}
                  style={{ width: '100px', height: '60px', borderRadius: '10px', fontWeight: '700' }}
                >
                  End Call
                </button>
                <button
                  className={`bg-gray-800 text-white p-2 ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={toggleAudio}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', fontWeight: '700' }}
                >
                  {isAudioEnabled ? <span className="text-white text-xl">🔊</span> : <span className="text-white text-xl">🔇</span>}
                </button>
                <button
                  className={`bg-gray-800 text-white p-2 ${isVideoEnabled ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={toggleVideo}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', fontWeight: '700' }}
                >
                  {isVideoEnabled ? <span className="text-white text-xl">Video On</span> : <span className="text-white text-xl">Video off</span>}
                </button>
                <button
                  className={`bg-gray-800 text-white p-2`}
                  onClick={toggleText}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', fontWeight: '700' }}
                >
                  {isText ? 'Text' : <span className="text-white text-xl">❌</span>}
                </button>
                <button
                  className={`bg-gray-800 text-white p-2`}
                  onClick={toggleSpeak}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', fontWeight: '700' }}
                >
                  {isSpeak ? 'Audio' : <span className="text-white text-xl">❌</span>}
                </button>
              </div>
              {/* Sender's Video Feed (Small Screen with Camera Control) */}
              <div className="sender-video relative">
                {isVideoEnabled ? (
                  <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <p>Your Video is Off</p>
                  </div>
                )}

                {/* Camera Control (Video On/Off) */}
                {/* <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 p-2 rounded-full cursor-pointer" onClick={toggleVideo}>
              {isVideoOn ? (
                <span className="text-white text-xl">📷</span>
              ) : (
                <span className="text-white text-xl">❌</span>
              )}
            </div> */}
              </div>
            </div>
          </div>
          <div className={`${isFildOn ? "field-on" : "field-off"}`}>
            <div style={{ backgroundColor: '#a9a9a9', width: '30vw', height: '85vh', borderRadius: '10px', border: '4px solid #ffffff', boxShadow: '0px 0px 20px 1px #a9a9a9' }}>
              <p>khv,igawlivcliesugvl uieshlfobvihbsoeoyvlosohohglfuacglies ugugelfugusoihleblohsvheosihvoioeshfo iho;ifhoiahoieh oihih ohoih ihi oho o hoih ou kyuf ukugi uguyu fi uy fi ughog uyf h oo ugt iu boiyy o</p>
            </div>
          </div>
        </div>

      </div >
    );
  };

export default CallDashboard
  ;