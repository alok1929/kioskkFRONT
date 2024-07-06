import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const RecordingAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onComplete(); // Callback to parent component to indicate recording completion
    }, 5000); // Simulated 5-second recording time, adjust as needed

    return () => {
      clearTimeout(timeoutId); // Clean up timeout on unmount or completion
    };
  }, [onComplete]);

  return (
    <motion.div
      className="h-16 bg-gray-100 overflow-hidden rounded-lg flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 20"
        className="h-full w-full"
        style={{ marginTop: '10px' }} // Adjust margin top to fit your layout
      >
        <motion.path
          fill="none"
          stroke="#3182CE"
          strokeWidth="0.5"
          d="M0 10 Q 20 5, 40 10 T 80 10 T 100 10"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      </motion.svg>
    </motion.div>
  );
};

export default RecordingAnimation;
