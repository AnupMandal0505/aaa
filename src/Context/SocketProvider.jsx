// SocketProvider.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Context Setup
const SocketContext = createContext(null);

// Constants
const URL = import.meta.env.VITE_BACKEND_URL || "https://one-to-one-webrtc-latest.onrender.com/" || "http://localhost:80";

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
    ]
};

// Notification Components
const Notification = ({ children, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in duration-300">
            <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 min-w-[300px]">
                {children}
            </div>
        </div>
    );
};

const CallAlert = ({ senderName, onAccept, onReject }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Phone size={20} />
                </div>
                <div>
                    <h3 className="font-semibold">Incoming Call</h3>
                    <p className="text-sm text-gray-300">from {senderName}</p>
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                <button 
                    onClick={onReject}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md flex items-center gap-2"
                >
                    <PhoneOff size={16} />
                    Reject
                </button>
                <button 
                    onClick={onAccept}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md flex items-center gap-2"
                >
                    <Phone size={16} />
                    Accept
                </button>
            </div>
        </div>
    );
};

// Media Controls Component
const MediaControls = ({ isAudioEnabled, isVideoEnabled, onToggleAudio, onToggleVideo, onEndCall }) => {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onEndCall}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
            >
                End Call
            </button>
            
            <button
                onClick={onToggleAudio}
                className={`p-4 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'} hover:opacity-90`}
            >
                {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
                onClick={onToggleVideo}
                className={`p-4 rounded-full ${isVideoEnabled ? 'bg-green-500' : 'bg-red-500'} hover:opacity-90`}
            >
                {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
        </div>
    );
};

// Main Provider Component
const SocketProvider = ({ children }) => {
    // State
    const [userName, setUserName] = useState(localStorage.getItem("user"));
    const [remoteUserName, setRemoteUserName] = useState(null);
    const [senderName, setSenderName] = useState(null);
    const [notify, setNotify] = useState(false);
    const [lobby, setLobby] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Refs
    const localAudioTrack = useRef(null);
    const localVideoTrack = useRef(null);
    const remoteVideoTrack = useRef(null);
    const remoteAudioTrack = useRef(null);
    const remoteMediaStream = useRef(null);
    const localMediaStream = useRef(null);
    const remoteVideoRef = useRef();
    const localVideoRef = useRef();
    const handTrackerRef = useRef(null);
    const timeoutRef = useRef(null);

    // Initialize socket and peer connection
    const socket = useMemo(() => io(URL), []);
    const pc = useMemo(() => new RTCPeerConnection(ICE_SERVERS), []);

    // Handlers
    const handleUserName = useCallback((e) => {
        const value = e.target.value;
        setUserName(value);
        localStorage.setItem('user', value);
    }, []);

    const setupLocalStream = useCallback(async (stream) => {
        if (!localVideoRef.current) return;
        
        const videoTrack = stream.getVideoTracks()[0];
        const localStream = new MediaStream([videoTrack]);
        localVideoRef.current.srcObject = localStream;
        
        try {
            await localVideoRef.current.play();
        } catch (error) {
            console.error("Failed to play local video:", error);
        }
    }, []);

    const setupRemoteStream = useCallback(async (stream) => {
        if (!remoteVideoRef.current) return;
        
        remoteVideoRef.current.srcObject = stream;
        try {
            await remoteVideoRef.current.play();
        } catch (error) {
            console.error("Failed to play remote video:", error);
        }
    }, []);

    const getCamAndPlay = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            localMediaStream.current = stream;
            const [audioTrack] = stream.getAudioTracks();
            const [videoTrack] = stream.getVideoTracks();
            
            localVideoTrack.current = videoTrack;
            localAudioTrack.current = audioTrack;
            
            await setupLocalStream(stream);
        } catch (error) {
            console.error("Failed to get media devices:", error);
            setError("Failed to access camera and microphone");
        }
    }, [setupLocalStream]);

    const toggleVideo = useCallback(async () => {
        try {
            if (localVideoTrack.current) {
                localVideoTrack.current.enabled = !localVideoTrack.current.enabled;
                setIsVideoEnabled(localVideoTrack.current.enabled);

                if (localVideoRef.current) {
                    if (!localVideoTrack.current.enabled) {
                        localVideoRef.current.srcObject = null;
                    } else {
                        const stream = new MediaStream([localVideoTrack.current]);
                        localVideoRef.current.srcObject = stream;
                        await localVideoRef.current.play().catch(console.error);
                    }
                }

                socket.emit('mediaStateChange', {
                    type: 'video',
                    enabled: localVideoTrack.current.enabled
                });
            }
        } catch (error) {
            console.error('Error toggling video:', error);
        }
    }, [socket]);

    const toggleAudio = useCallback(() => {
        try {
            if (localAudioTrack.current) {
                localAudioTrack.current.enabled = !localAudioTrack.current.enabled;
                setIsAudioEnabled(localAudioTrack.current.enabled);

                socket.emit('mediaStateChange', {
                    type: 'audio',
                    enabled: localAudioTrack.current.enabled
                });
            }
        } catch (error) {
            console.error('Error toggling audio:', error);
        }
    }, [socket]);

    const handleIncomingTrack = useCallback((event) => {
        if (!remoteVideoRef.current) return;
        
        const [remoteStream] = event.streams;
        remoteMediaStream.current = remoteStream;
        setupRemoteStream(remoteStream);
    }, [setupRemoteStream]);

    const cleanup = useCallback(() => {
        [localAudioTrack, localVideoTrack].forEach(track => {
            if (track.current) {
                track.current.stop();
                track.current = null;
            }
        });

        if (remoteMediaStream.current) {
            remoteMediaStream.current.getTracks().forEach(track => track.stop());
            remoteMediaStream.current = null;
        }

        if (handTrackerRef.current) {
            handTrackerRef.current.close();
            handTrackerRef.current = null;
        }

        [remoteVideoRef, localVideoRef].forEach(ref => {
            if (ref.current) ref.current.srcObject = null;
        });

        if (pc) {
            pc.close();
        }

        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
    }, [pc]);

    const handleCall = useCallback(async (receiverName) => {
        setRemoteUserName(receiverName);
        socket.emit("call", receiverName);
        
        // const interval = setInterval(() => {
        //     if (lobby) {
        //         clearInterval(interval);
        //         return;
        //     }
        // }, 1000);

        // setTimeout(() => clearInterval(interval), 10000);
    }, [lobby, socket]);

    const handleCallResponse = useCallback(async (senderName, accept) => {
        if (accept) {
            setRemoteUserName(senderName);
            await getCamAndPlay();
            socket.emit('answerCall', senderName);
        } else {
            setUserName(null);
            socket.emit('rejectCall', senderName);
        }
    }, [getCamAndPlay, socket]);

    useEffect(()=>{
        if(userName && socket) socket.emit('addUser', userName);
    },[userName])

    // Socket event handlers
    useEffect(() => {
        if (!userName || !socket) return;
        
        // socket.emit('addUser', userName);

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on("rejectCall", (canceledBy) => {
            setRemoteUserName(null);
            setNotify(false);
            setError(`Call rejected by ${canceledBy}`);
            setTimeout(() => setError(null), 3000);
        });

        socket.on("end", () => {
            cleanup();
            setNotify(false);
            setError('Call ended');
            setTimeout(() => setError(null), 3000);
        });

        socket.on("call", ({ senderName }) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            
            if (!lobby) {
                setSenderName(senderName);
                setNotify(true);
                
                timeoutRef.current = setTimeout(() => {
                    setNotify(false);
                    setSenderName(null);
                    socket.emit('rejectCall', senderName);
                }, 30000);
            }
        });

        socket.on('send-offer', async ({ roomId }) => {
            await getCamAndPlay();
            
            pc.ontrack = handleIncomingTrack;
            
            if (localMediaStream.current) {
                localMediaStream.current.getTracks().forEach(track => 
                    pc.addTrack(track, localMediaStream.current)
                );
            }

            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("offer", { sdp: offer, roomId });
                
                pc.onicecandidate = (e) => {
                    if (e.candidate) {
                        socket.emit("add_ice_candidate", {
                            candidate: e.candidate,
                            roomId,
                            type: "sender",
                        });
                    }
                };
            } catch (error) {
                console.error("Error creating/sending offer:", error);
                setError("Failed to establish connection");
            }
        });

        socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
            try {
                await getCamAndPlay();
                
                pc.ontrack = handleIncomingTrack;
                await pc.setRemoteDescription(remoteSdp);
                
                if (localMediaStream.current) {
                    localMediaStream.current.getTracks().forEach(track => 
                        pc.addTrack(track, localMediaStream.current)
                    );
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                
                socket.emit("answer", { roomId, sdp: answer });

                pc.onicecandidate = (e) => {
                    if (e.candidate) {
                        socket.emit("add_ice_candidate", {
                            candidate: e.candidate,
                            type: "receiver",
                            roomId
                        });
                    }
                };
            } catch (error) {
                console.error("Error handling offer:", error);
                setError("Failed to connect to peer");
            }
        });

        socket.on("answer", async ({ sdp: remoteSdp }) => {
            try {
                await pc.setRemoteDescription(remoteSdp);
                setLobby(false);
            } catch (error) {
                console.error("Error handling answer:", error);
                setError("Failed to establish connection");
            }
        });

        socket.on("add_ice_candidate", async ({ candidate }) => {
            try {
                await pc.addIceCandidate(candidate);
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        });

        socket.on('mediaStateChange', ({ type, enabled }) => {
            if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                const tracks = remoteVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => {
                    if ((type === 'video' && track.kind === 'video') ||
                        (type === 'audio' && track.kind === 'audio')) {
                        track.enabled = enabled;
                    }
                });
            }
        });

        return () => {
            socket.off();
            cleanup();
        };
    }, [socket, cleanup, getCamAndPlay, handleIncomingTrack, pc]);

    const navigate = useNavigate();

    const contextValue = {
        socket,
        localAudioTrack,
        localVideoTrack,
        localMediaStream,
        getCamAndPlay,
        pc,
        callUser: handleCall,
        remoteVideoRef,
        localVideoRef,
        remoteUserName,
        handleUserName,
        setUserName,
        toggleVideo,
        toggleAudio,
        isVideoEnabled,
        isAudioEnabled,
        handTrackerRef,
        isLoading,
        setIsLoading,
        error,
        setError,
        notify,
        senderName,
        handleCallResponse
    };

    return (
        <SocketContext.Provider value={contextValue}>
            <Notification isVisible={notify}>
                <CallAlert 
                    senderName={senderName}
                    onAccept={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        handleCallResponse(senderName, true);
                        setNotify(false);
                        navigate('/call');
                    }}
                    onReject={() => {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        handleCallResponse(senderName, false);
                        setNotify(false);
                    }}
                />
            </Notification>
            
            <Notification isVisible={error !== null}>
                <div className="text-red-400">
                    {error}
                </div>
            </Notification>
            
            {children}
        </SocketContext.Provider>
    );
};

const useSocket = () => useContext(SocketContext);

export { useSocket, SocketProvider };