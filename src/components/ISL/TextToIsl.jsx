import './SpeechToIsl.css';
import { useState } from "react";
import axios from 'axios';
import VideoModal from '../../components/VideoModal';
import useLoadingScreen from '../../hooks/Loading';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SpeechToIsl = () => {
    const [textInput, setTextInput] = useState("");
    const [wordList, setWordList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            const response = await handleConversion(textInput);
            if (!response || response.length === 0) {
                throw new Error('No translation generated');
            }
            setWordList(response);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error getting word list:', error);
        } finally {
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
            <h1 className="heading11" style={{ fontWeight: 'bold' }}>Speech to ISL Translator</h1>
            <div className='working-box' style={{ gap: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <div className="inbox" style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 3px 2px skyblue', padding: '20px', fontSize: '20px', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {textInput === "" ?
                            <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
                                Type Something to Translate....
                            </div> :
                            <div style={{ width: '100%', height: '100%' }}>
                                {textInput}
                            </div>
                        }
                    </div>

                    <div className='text-isl' >
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
                                fontSize: '16px',
                                width: '100%'
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleTranslate();
                                }
                            }}
                        />

                    </div>

                </div>
                <button
                    onClick={handleTranslate}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4F46E5',
                        color: 'white',
                        borderRadius: '5px',
                        fontWeight: '600',
                        width: '200px',
                    }}
                >
                    Translate
                </button>
                {/* 
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
                */}
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