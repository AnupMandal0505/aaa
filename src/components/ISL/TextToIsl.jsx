import './SpeechToIsl.css';
import { useState } from "react";
import VideoModal from '../../components/VideoModal';
import useLoadingScreen from '../../hooks/Loading';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SpeechToIsl = () => {
    const [textInput, setTextInput] = useState("");
    const [wordList, setWordList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState("");
    const { LoadingScreen, startLoading, stopLoading } = useLoadingScreen();

    const API_KEY = 'AIzaSyCcQjq-H7r7mEhLVE6XbsrraoT5Q4MXbos';
    const genAI = new GoogleGenerativeAI(API_KEY);

    const handleConversion = async (sentence) => {
        if (!sentence.trim()) {
            throw new Error('Please enter some text to translate');
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `You are an expert in Indian Sign Language. Convert the English sentence given in between backticks to Indian Sign Language English using its grammar rules. \`${sentence}\`. Give only the English words without any extra characters.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new Error('No response received from translation service');
            }

            const words = text.trim().split(" ");
            const finalWords = words.filter(word => word !== "" && word !== " ").map(word => word.toLowerCase());

            if (finalWords.length === 0) {
                throw new Error('No valid translation generated');
            }

            return finalWords;
        } catch (err) {
            console.error('Translation error:', err);
            throw new Error('Failed to translate. Please try again.');
        }
    };

    const handleTranslate = async () => {
        setError("");
        startLoading();
        try {
            const response = await handleConversion(textInput);
            setWordList(response);
            setIsModalOpen(true);
        } catch (error) {
            setError(error.message);
            console.error('Error getting word list:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
            <LoadingScreen />
            <h1 className="heading11" style={{ fontWeight: 'bold' }}>Text to ISL Translator</h1>
            <div className='working-box' style={{ gap: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                <div className="inbox" style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 3px 2px skyblue', padding: '20px', fontSize: '20px', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {textInput === "" ? (
                            <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
                                Type Something to Translate....
                            </div>
                        ) : (
                            <div style={{ width: '100%', height: '100%' }}>
                                {textInput}
                            </div>
                        )}
                    </div>

                    <div className='text-isl'>
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
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.target.style.backgroundColor = '#4338CA'}
                    onMouseOut={e => e.target.style.backgroundColor = '#4F46E5'}
                >
                    Translate
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