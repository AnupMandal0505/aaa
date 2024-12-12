import './SpeechToIsl.css';
import { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import VideoModal from '../../components/VideoModal';
import useLoadingScreen from "../../hooks/Loading";

const SpeechToIsl = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);
    const [textInput, setTextInput] = useState("");
    const [button, setButton] = useState("Start Recording");
    const [wordList, setWordList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const { LoadingScreen, startLoading, stopLoading } = useLoadingScreen();

    const API_KEY = 'AIzaSyCcQjq-H7r7mEhLVE6XbsrraoT5Q4MXbos';
    const genAI = new GoogleGenerativeAI(API_KEY);

    const handleConversion = async (sentence) => {
        if (!sentence.trim()) {
            throw new Error('Sentence is empty');
        }
        
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            
            const prompt = `You are an expert in Indian Sign Language. Convert the English sentence given in between backticks to Indian Sign Language English using its grammar rules. \`${sentence}\`. Give only the English words without any extra characters.`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            
            // Fix: Properly access the text content from the response
            const responseText = response.text();
            if (!responseText) {
                throw new Error('Empty response from API');
            }

            // Process the response text
            const words = responseText.trim().split(" ");
            const finalWords = words.filter(word => word !== "" && word !== " ").map(word => word.toLowerCase());
            
            return finalWords;
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    };

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

        recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
                interimTranscript += event.results[i][0].transcript;
            }
            setTranscript(interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setError("Speech recognition error. Please try again.");
            stopListening();
            setButton("Start Recording");
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
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
        setError("");
        if (isListening) {
            await stopVoiceInput();
        } else {
            setTextInput("");
            setTranscript("");
            startListening();
        }
    };

    const stopVoiceInput = async () => {
        startLoading();
        const finalText = textInput + (transcript ? (textInput ? " " : "") + transcript : "");
        setTextInput(finalText);
        setTranscript("");
        stopListening();

        try {
            if (!finalText.trim()) {
                throw new Error('No speech detected');
            }
            
            const response = await handleConversion(finalText);
            if (!response || response.length === 0) {
                throw new Error('No translation generated');
            }
            
            setWordList(response);
            setIsModalOpen(true);
        } catch (error) {
            setError(error.message || "Failed to convert speech to ISL. Please try again.");
            console.error('Error getting word list:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-10 bg-gray-100">
            <LoadingScreen />
            <h1 className="font-bold text-2xl">Speech to ISL Translator</h1>
            
            <div className="w-[44vw] h-[60vh] flex flex-col items-center justify-center gap-10 bg-white rounded-lg shadow-lg p-6">
                <div className="w-[40vw] h-[40vh] bg-white rounded-lg shadow-sky-200 shadow-md p-5 text-xl font-medium">
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    {button === "Start Recording" ? (
                        <div className="w-full h-full text-center">
                            Press the button to start speaking....
                        </div>
                    ) : (
                        <div className="w-full h-full overflow-auto">
                            {isListening ? textInput + transcript : textInput}
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={async () => {
                        await startStopListening();
                        setButton(prev => prev === "Stop Recording" ? "Start Recording" : "Stop Recording");
                    }} 
                    className={`w-48 h-10 rounded-full text-white font-bold ${
                        button === 'Start Recording' ? "start-btn" : "stop-btn"
                    }`}
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