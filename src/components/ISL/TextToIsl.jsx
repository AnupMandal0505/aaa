import React, { useState } from 'react';

// Simulate ISL conversion (In real use case, this would call an API or database)
const getISLSign = (text) => {
  const islDictionary = {
    hello: 'hello_sign_image_or_video_url',
    world: 'world_sign_image_or_video_url',
    // Add more words and their corresponding ISL signs
  };

  return islDictionary[text.toLowerCase()] || 'default_sign_image_or_video_url';
};

const TextToISL = () => {
  const [textInput, setTextInput] = useState('');
  const [islSign, setIslSign] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const sign = getISLSign(textInput);
    setIslSign(sign);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Text to ISL Converter</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Enter text (e.g., hello, world)"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Convert to ISL
        </button>
      </form>

      {islSign && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">ISL Sign:</h2>
          <img src={islSign} alt="ISL Sign" className="mt-4 max-w-full h-auto" />
          {/* Alternatively, you could display a video instead of an image */}
          {/* <video src={islSign} controls className="mt-4" /> */}
        </div>
      )}
    </div>
  );
};

export default TextToISL;
