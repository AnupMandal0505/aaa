"use client"
import React, { useEffect, useRef, useState } from 'react';
import {initializeHandTracking} from './helper'
import {toggleAudio, toggleVideo} from './localStream'
import { useSocket } from '../../Context/SocketProvider';

const CallDashboard
 = () => {
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentWord, setCurrentWord] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [prediction, setPrediction] = useState('');

  const [isVideoEnabled,setIsVideoEnabled] = useState(true);
  const [isAudioEnabled,setIsAudioEnabled] = useState(true);
  
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
    .then(()=>initializeHandTracking({
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
    .catch((err)=>{
        console.log(`Error waiting for remote stream ${err}`)
    })

    return () => {
      if (stream) {
        console.log("Destructer stream")
        //@ts-ignore
        stream.getTracks().forEach((track) => track.stop());
      }
      if(intervalId)
      {
        clearInterval(intervalId)
      }
      if (handTrackerRef.current) {
        handTrackerRef.current.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      {error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-[640px] h-[480px] bg-black">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Calling {remoteUserName}
              </div>
            )}
            <video 
              ref={remoteVideoRef}
              autoPlay 
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-xl font-semibold text-blue-600">
              <span>{remoteUserName}</span>
            </p>
            <p className="text-xl font-semibold text-blue-600">
              Current Word: {currentWord.join('')}
            </p>
            <p className="text-xl font-semibold text-green-600 mt-2">
              Sentence: {sentence.join(' ')}
            </p>
            <p className="text-lg mt-2">
              Current Prediction: {prediction}
            </p>
          </div>
          <div>
          <div className="relative w-[640px] h-[480px] bg-black">
                <video 
                  ref={localVideoRef}
                  autoPlay 
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
          </div>
          <div className="mt-4 text-center">
            <p className="text-xl font-semibold text-blue-600">
              <span>YOU</span>
            </p>
            <p className="text-xl font-semibold text-blue-600 center">
              <button onClick={()=>toggleVideo(localMediaStream,setIsVideoEnabled)}>Video {isVideoEnabled}</button>
              <button onClick={()=>toggleAudio(localMediaStream,setIsAudioEnabled)}>Audio {isVideoEnabled}</button>
              <button className="red" onClick={()=>{
                window.location.replace('/');
              }}>End Call {isVideoEnabled}</button>
            </p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallDashboard
;