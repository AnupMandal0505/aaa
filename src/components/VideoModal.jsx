import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const VideoModal = ({ words, isOpen, onClose, onComplete }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState('');
  const [videoQueue, setVideoQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedVideos, setFailedVideos] = useState(new Set());

  useEffect(() => {
    if (words && words.length > 0) {
      generateVideoQueue();
    }
  }, [words]);

  const generateVideoQueue = () => {
    setIsLoading(true);
    let queue = [];

    for (const word of words) {
      const wordUrl = `https://signwave-sih.s3.ap-south-1.amazonaws.com/output_word/${word.toLowerCase()}.mp4`;
      queue.push({ url: wordUrl, type: 'word', original: word });
    }

    setVideoQueue(queue);
    if (queue.length > 0) {
      setCurrentVideo(queue[0]);
    }
    setIsLoading(false);
  };

  const handleVideoError = async (error) => {
    console.error('Video playback error:', error);

    const currentItem = videoQueue[currentVideoIndex];
    if (currentItem.type === 'word' && !failedVideos.has(currentItem.url)) {
      setFailedVideos(prev => new Set(prev).add(currentItem.url));

      const letters = currentItem.original.split('');
      const letterUrls = letters.map(letter => ({
        url: `https://signwave-sih.s3.ap-south-1.amazonaws.com/output_alphabet/${letter.toLowerCase()}.mp4`,
        type: 'letter',
        original: letter
      }));

      const newQueue = [
        ...videoQueue.slice(0, currentVideoIndex),
        ...letterUrls,
        ...videoQueue.slice(currentVideoIndex + 1)
      ];

      setVideoQueue(newQueue);
      setCurrentVideo(newQueue[currentVideoIndex]);
    } else {
      handleVideoEnd();
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoQueue.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      setCurrentVideo(videoQueue[currentVideoIndex + 1]);
    } else {
      // Call onComplete before closing
      // onComplete();
      setCurrentVideoIndex(0);
      setCurrentVideo('');
      setVideoQueue([]);
      setIsLoading(true);
      setFailedVideos(new Set());

      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl transform transition-all w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ISL Translation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : currentVideo ? (
              <video
                key={currentVideo.url}
                className="w-full h-full"
                autoPlay
                onEnded={handleVideoEnd}
                onError={handleVideoError}
              >
                <source src={currentVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                No videos available
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {!isLoading && videoQueue.length > 0 &&
                `Playing ${currentVideoIndex + 1} of ${videoQueue.length}`
              }
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;