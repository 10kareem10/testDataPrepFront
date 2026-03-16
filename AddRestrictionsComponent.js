import React, { useState } from 'react';
import './AddRestrictionsComponent.css';
import { useNavigate } from 'react-router-dom'; 
import Navbar from './Navbar';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUniversity, FaCreditCard, FaPiggyBank, FaWallet, FaMoneyCheckAlt } from 'react-icons/fa';

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000
};

const AddRestrictionsComponent = () => {
    const [count, setCount] = useState(0);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [testPassed, setTestPassed] = useState(false);
    const navigate = useNavigate();

    const handleCountChange = (event) => {
        setCount(event.target.value);
    };

    const handleGroup1Submit = () => {
        setLoading(true);
        setTestPassed(false);

        fetch('http://10.10.96.100:8080/run-rest-assured', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: count.toString(),// Send count as JSON
                sessionId: localStorage.getItem('SESSION_ID') // <-- pass sessionId
             }) 
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
        .catch(error => {
            console.error('Error:', error);
            setPopupMessage('Error running the test');
            setShowPopup(true);
            setTestPassed(false);
        })
        .finally(() => setLoading(false));
    };

    const handleClosePopup = () => setShowPopup(false);

    const buttons = [
        { label: 'Add Customer Restrictions', path: '/addCustomerRestrictions' },
        { label: 'Add Account Restrictions', path: '/addAccountRestrictions' },
        { label: 'Update Card Status', path: '/updateCardStatus' }
    ];

    return (
        <div>
            <Navbar />
            <div className="main-container">
                <div className="card-container">
                    <div className="card">
                    <h1 className="input-title">Restrictions Services</h1>
                       <h2 className="input-subtitle">EASILY MANAGE AND APPLY RESTRICTIONS</h2>
                        <div className="input-card">
                            {buttons.map((btn) => (
                                <button
                                    key={btn.path}
                                    className="submit-button"
                                    onClick={() => navigate(btn.path)}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="loading-section">
                        <div className="loader"></div>
                        <p className="loading-text">Please wait! Running the test...</p>
                    </div>
                )}

                {showPopup && (
                    <div className="popup">
                        <p>{popupMessage}</p>
                        <button onClick={handleClosePopup} className="close-popup">Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddRestrictionsComponent;