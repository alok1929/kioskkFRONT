import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test');
        console.log('Backend connection test:', response.data);
      } catch (error) {
        console.error('Error testing backend connection:', error);
      }
    };

    testBackendConnection();
  }, []);

  const handleMicrophoneClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioFile(audioBlob);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setStatusMessage(isRecording ? 'Recording stopped' : 'Recording started');
        console.log('Recording started');
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const handleSendRecording = async () => {
    if (!audioFile) {
      console.error('No audio file to send');
      return;
    }

    const formData = new FormData();
    formData.append('audioFile', audioFile, 'recording.wav');

    try {
      console.log('Sending request to backend...');
      setStatusMessage("sending request to backend");
      const response = await axios.post('http://localhost:5000/record', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response from backend:', response.data);
      setStatusMessage("order recieved!");
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      console.error('Error uploading audio:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-blue-400 p-4 flex space-x-20'>
        <div className='text-2xl font-mono py-2'>kioskBOT</div>
        <div className='flex-grow flex items-center justify-center'>
          <div className='border-gray-300 bg-red-200 rounded-full p-1 w-10'>
            <div className='px-1 animate-pulse text-xl'>🙋</div>
          </div>
          <div className='px-6 p-2 flex font-semibold'>
            Hi! I'm a South Indian store assistant. Click 🔴 to start ordering!!
          </div>
        </div>
      </header>
      <div className='text-xl p-3 font-semibold'>Order Details:</div>
      {orderDetails && (
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">GST</th>
              <th className="px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.bill.details.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 ">{item.item}</td>
                <td className="border px-3 py-2">{item.price}</td>
                <td className="border px-3 py-2">{item.gst}</td>
                <td className="border px-3 py-2">{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <footer className='fixed bottom-0 left-0 w-full flex justify-center'>
        <div className='flex p-4 bg-gray-900 rounded-lg space-x-4'>
          <button
            className={`p-4 text-gray-400 hover:text-white ${isRecording ? 'animate-spin text-red-500' : ''}`}
            onClick={handleMicrophoneClick}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <FaMicrophone className='text-2xl' />
          </button>
          <div className='text-gray-400 flex items-center'>
            {statusMessage}
          </div>
          <button
            className='p-2 text-gray-400 hover:text-white'
            aria-label='Send recording'
            onClick={handleSendRecording}
            disabled={!audioFile}
          >
            <FaPaperPlane />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;