import './SpeechToIsl.css';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import VideoModal from '../../components/VideoModal';
import useLoadingScreen from '../../hooks/Loading';

const SpeechToIsl = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);
    const [textInput, setTextInput] = useState("");
    const [button, setButton] = useState("Start Recording");
    const [wordList, setWordList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {LoadingScreen, startLoading, stopLoading } = useLoadingScreen();

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) {
            console.error("Speech recognition API not supported.");
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.continuous = true;

        if ("webkitSpeechGrammarList" in window) {
            const grammar = "#JSGF V1.0; grammar punctuation; public <punc> = . | , | ? | ! | ; | : ;";
            const SpeechRecognitionList = new window.webkitSpeechGrammarList();
            SpeechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = SpeechRecognitionList;
        }

        recognition.onresult = async (event) => {
            let interimTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
                interimTranscript += event.results[i][0].transcript;
            }
            setTranscript(interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            recognition.stop();
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const startStopListening = async () => {
        if (isListening) {
            await stopVoiceInput();
        } else {
            startListening();
        }
    };

    const handleTranslate = async () => {
      startLoading();
      try {
          const response = await axios.post('http://localhost:9001/isl_text', {
              sentence: textInput.trim()
          });
          setWordList(response.data);
          setIsModalOpen(true);
      } catch (error) {
          console.error('Error getting word list:', error);
      } finally{
        stopLoading();
      }
  };
  
  const stopVoiceInput = async () => {
      const finalText = textInput + (transcript ? (textInput ? " " : "") + transcript : "");
      setTextInput(finalText);
      setTranscript("");
      stopListening();

      await handleTranslate();
  };

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
            <h1 style={{ fontWeight: 'bold' }}>Speech to ISL Translator</h1>
            <div style={{ width: '44vw', height: '60vh', gap: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ backgroundColor: 'white', width: '40vw', height: '40vh', borderRadius: '10px', boxShadow: '0px 0px 3px 2px skyblue', padding: '20px', fontSize: '20px', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {button === "Start Recording" ? 
                            <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
                                Press the button to start speaking or type below....
                            </div> : 
                            <div style={{ width: '100%', height: '100%' }}>
                                {isListening ? textInput + transcript : textInput}
                            </div>
                        }
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type='text' 
                            value={textInput} 
                            onChange={e => setTextInput(e.target.value)}
                            placeholder="Type text to translate..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #e2e8f0',
                                fontSize: '16px'
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleTranslate();
                                }
                            }}
                        />
                        <button
                            onClick={handleTranslate}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4F46E5',
                                color: 'white',
                                borderRadius: '5px',
                                fontWeight: '600'
                            }}
                        >
                            Translate
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={async () => {
                        await startStopListening();
                        if (button === "Stop Recording") {
                            setButton("Start Recording");
                        } else {
                            setButton("Stop Recording");
                        }
                    }} 
                    className={button === 'Start Recording' ? "start-btn" : "stop-btn"} 
                    style={{ width: '200px', height: '40px', borderRadius: '20px', color: 'white', fontWeight: '800' }}
                >
                    {button}
                </button>
            </div>

            <VideoModal 
                words={wordList}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default SpeechToIsl;