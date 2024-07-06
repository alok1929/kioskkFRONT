import React, { useState, useRef } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa'; // Assuming Font Awesome
import MicLogo from './MicLogo';


const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          audioChunks.current = [];
        };

        mediaRecorder.current.start();
        setIsRecording(true);
      } else {
        mediaRecorder.current.stop();
        setIsRecording(false);
      }
    } catch (err) {
      console.error("Error accessing the microphone:", err);
    }
  };

  return (
    <div className='flex flex-col items-center p-4'>
      <button 
        onClick={toggleRecording}
        className={`px-4 py-2 rounded text-white`}
      >
        {isRecording ? <FaStop/>: <FaPlay/>}
      </button>
      {audioURL && (
        <audio src={audioURL} controls className="mt-4" />
      )}
    </div>
  );
};

export default AudioRecorder;
