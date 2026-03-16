import React from 'react';
import './Popup.css';

const Popup = ({ message, onClose, showDownloadButton }) => {

    const handleDownload = () => {
        const API_URL = "http://10.10.96.100:8080";
        const sessionId = localStorage.getItem("SESSION_ID");

        if (!sessionId) {
            alert("Session expired. Please login again.");
            return;
        }

        //pass sessionId to backend
        window.location.href = `http://10.10.96.100:8080/download-excel?sessionId=${sessionId}`;

    };

    return (
        <div className="popup-overlay">
            <div className="popup-card">
                <h2>Run Result</h2>
                <p>{message}</p>

                <button onClick={onClose}>Close</button>

                {showDownloadButton && (
                    <button onClick={handleDownload}>
                        Download Excel
                    </button>
                )}
            </div>
        </div>
    );
};

export default Popup;
