import React from 'react';
import './ProgressBar.css'; // Add styles for the progress bar

const ProgressBar = ({ progress }) => {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;
