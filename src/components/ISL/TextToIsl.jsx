
import './SpeechToIsl.css';

import { useState, useEffect, useRef } from "react";

const SpeechToIsl = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const [textInput, setTextInput] = useState("");
  const [button, setButton] = useState("Translate to ISL");
  const [videoPlay, setVideoPlay] = useState(false);

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

  const startStopListening = () => {
    if (isListening) {
      stopVoiceInput();
    } else {
      startListening();
    }
  };

  const stopVoiceInput = () => {
    setTextInput((prevVal) => prevVal + (transcript ? (prevVal ? " " : "") + transcript : ""));
    setTranscript("");
    stopListening();
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#F3F4F6', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px', alignItems: 'center' }}>
      <h1 className='heading-translator' style={{ fontWeight: 'bold' }}>Text to ISL Translator</h1>
      <div className='box-translator' style={{ gap: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
        {
          videoPlay ? <div className='video-play-true' style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0px 0px 3px 2px skyblue' }}> <iframe width="100%" height="100%" src="https://www.youtube.com/embed/xJ_V55awyIo?si=kv8_pqH6trV6NKaR" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div> : <textarea className=" border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ maxWidth: '40vw', maxHeight: '40vh', minWidth: '40vw', minHeight: '40vh', border: '1px solid #1eb9fc', padding: '10px', fontSize: '20px', fontWeight: '500' }}>{isListening ? textInput + transcript : textInput}</textarea>
        }
        <button onClick={() => {
          startStopListening();
          if (button === "Translate to ISL") {
            setButton("Write Something");
            setTranscript("");
            setTextInput("");
            setVideoPlay(true);
          } else {
            setButton("Translate to ISL");
            setVideoPlay(false);
          }
        }} className={button === 'Translate to ISL' ? "start-btn" : "stop-btn"} style={{ width: '200px', height: '40px', borderRadius: '20px', color: 'white', fontWeight: '800' }} >
          {button}
        </button>
      </div>
    </div >
  );
};

export default SpeechToIsl;

