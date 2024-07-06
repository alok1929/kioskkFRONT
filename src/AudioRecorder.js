import React, { useEffect,useState, useRef } from 'react';

const AudioRecorder = ({ isRecording, onRecordingComplete }) => {
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [audioURL, setAudioURL] = useState('');

  useEffect(() => {
    const startRecording = async () => {
      try {
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
          onRecordingComplete();
        };

        mediaRecorder.current.start();
      } catch (err) {
        console.error("Error accessing the microphone:", err);
      }
    };

    const stopRecording = () => {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
    };

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isRecording, onRecordingComplete]);

  return (
    <div className='flex  items-center '>
      {audioURL && (
        <audio src={audioURL} controls className="mt-4" />
      )}
    </div>
  );
};

export default AudioRecorder;
