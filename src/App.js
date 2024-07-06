import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder'; // Adjust the import path as per your file structure
import { FaPaperPlane } from 'react-icons/fa';
import MicLogo from './MicLogo';
import RecordingAnimation from './RecordingAnimation';

const App = () => {
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleMicrophoneClick = () => {
    setIsRecording(!isRecording); // Toggle recording state
    setShowAudioRecorder(true); // Show audio recorder when recording starts
  };

  const handleRecordingComplete = () => {
    setIsRecording(false); // Reset recording state when recording is complete
  };

  return (
    <div>
      <div className='bg-blue-400 p-4 flex space-x-20'>
        <div className='text-2xl font-mono py-2'>kioskBOT</div>
        <div className=' p-1 px-80 flex items-center justify-center'>
          <div className=' border-gray-300 bg-red-200 rounded-full p-1 w-10'>
            <div className='px-1 animate-pulse text-xl'>🙋</div>
          </div>
          <div className='px-6 p-2 flex font-semibold'>
            Hi! I'm a South Indian store assistant. Click 🔴 to start ordering!!
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full flex justify-center">
        <div className='justify-end flex'>
          <div className="flex p-4 bg-gray-900 rounded-lg">
            {showAudioRecorder && <AudioRecorder />} {/* Render AudioRecorder if showAudioRecorder is true */}
            <button
              className="flex-shrink-0 p-2 text-gray-400 hover:text-white"
              onClick={handleMicrophoneClick}
            >
              {isRecording ? (
                <RecordingAnimation onComplete={handleRecordingComplete} />
              ) : (
                <MicLogo isRecording={isRecording} />
                
              )}
            </button>
            <button className="flex-shrink-0 p-2 text-gray-400 hover:text-white">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
