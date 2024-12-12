import './SpeechToIsl.css';
import { useState } from "react";
import axios from 'axios';
import VideoModal from '../../components/VideoModal';
import useLoadingScreen from '../../hooks/Loading';

const SpeechToIsl = () => {
    const [textInput, setTextInput] = useState("");
    const [wordList, setWordList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { startLoading, stopLoading } = useLoadingScreen();

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
        } finally {
            stopLoading();
        }
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