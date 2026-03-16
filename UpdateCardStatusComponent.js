import React, { useState } from 'react';
import './UpdateCardStatusComponent.css';
import Navbar from './Navbar';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';

const cardStatusOptions = [
    { value: "00", label: "00 - NORMAL" },
    { value: "01", label: "01 - PIN TRIES EXCEEDED" },
    { value: "02", label: "02 - NOT YET ISSUED" },
    { value: "03", label: "03 - CARD EXPIRED" },
    { value: "04", label: "04 - LOST" },
    { value: "05", label: "05 - STOLEN" },
    { value: "06", label: "06 - CUSTOMER CLOSE" },
    { value: "07", label: "07 - BANK CANCELLED" },
    { value: "08", label: "08 - SUSPECTED FRAUD" },
    { value: "09", label: "09 - DAMAGED" },
    { value: "10", label: "10 - VIRTUAL ACTIVE" },
    { value: "20", label: "20 - PENDING_ISSUANCE" },
    { value: "21", label: "21 - CARD_EXTRACTED" },
    { value: "22", label: "22 - EXTRACTION_FAILED" },
    { value: "24", label: "24 - FAILED PRINTING INST" },
    { value: "30", label: "30 - PENDING_ACTIVATION" },
    { value: "50", label: "50 - TEMP BLK BY BANK" },
    { value: "51", label: "51 - TEMP BLK BY CUSTOMER" },
    { value: "52", label: "52 - Not Sold" },
    { value: "66", label: "66 - CONFIRMED FRAUD" },
    { value: "88", label: "88 - Failed from MDP" }
];

const UpdateCardStatusComponent = () => {
    const [formData, setFormData] = useState({
        pan: '',
        newStatus: '',
    });

    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [testPassed, setTestPassed] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTestPassed(false);

        const payload = {
            username1: localStorage.getItem('loggedInUser'),
            sessionId: localStorage.getItem('SESSION_ID'), // <-- pass sessionId
            UpdateCardStatusRequestDetails: {
                CardIdentifier: { Pan: formData.pan },
                NewStatus: formData.newStatus
            }
        };
        fetch('http://10.10.96.100:8080/run-updatecardstatus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to process request');
                return response.text();
            })
            .then(data => {
                setPopupMessage(data);
                setShowPopup(true);
                setTestPassed(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                setPopupMessage('Error running the test');
                setShowPopup(true);
                setTestPassed(false);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <Navbar />
            <div className="onboarding-container">
                <h1 className="onboarding-title">Update Card Status</h1>
                <h2 className="onboarding-subtitle">Fill your data</h2>

                <form className="onboarding-form" onSubmit={handleSubmit}>
                    <div className="input-row">
                        <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleInputChange}
                            placeholder="Pan"
                        />
                        <select
                            name="newStatus"
                            value={formData.newStatus}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>
                                Select Card Status
                            </option>
                            {cardStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='buttons-class'>
                        <button type="submit" className="submit-button" disabled={loading}>
                            Submit
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="loading-section">
                        <div className="loader"></div>
                        <p className="loading-text">Please wait! Adding status now...</p>
                    </div>
                )}

                {showPopup && <Popup
                    message={popupMessage}
                    onClose={handleClosePopup}
                />}
            </div>
        </div>
    );
};

export default UpdateCardStatusComponent;
