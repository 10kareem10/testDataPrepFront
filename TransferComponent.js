import React, { useState } from 'react';
import './TransferComponent.css'; // Create a CSS file for styling
import Navbar from './Navbar';
import Popup from './Popup'; // Import the popup component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection



const TransferComponent = () => {
    // Define state to hold the values of the input fields
    const [formData, setFormData] = useState({
        debitAccount: '',
        creditAccount: '',
        amount: ''
    });
    const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [loading, setLoading] = useState(false); // State to control loader visibility
    const [testPassed, setTestPassed] = useState(false); // State to track if the test passed
    const navigate = useNavigate(); // Initialize the useNavigate hook


    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
             username1: localStorage.getItem('loggedInUser'),
             sessionId: localStorage.getItem('SESSION_ID'), // <-- pass sessionId
            [name]: value
        });
    };

    // Handle form submission and send data to the backend
    const handleSubmit = (e) => {

        setLoading(true); // Start the loader before making the API call
        setTestPassed(false); // Reset test result
        const API_URL = "http://10.10.96.100:8080";
        
        const formDataString = JSON.stringify(formData);
        // Send form data to backend
        fetch("http://10.10.96.100:8080/run-transfer", {
        
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formDataString // Send the entire formData as a string
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to process request');
            }
            return response.text();
        })
        .then(data => {
           // Set popup message with backend response and show the popup
           setPopupMessage(data);
           setShowPopup(true);
           setTestPassed(true); // Mark the test as passed if no error occurs

        })
        .catch((error) => {
            console.error('Error:', error);
            setPopupMessage('Error running the test');
            setShowPopup(true);
            setTestPassed(false); // Mark the test as failed

        }).finally(() => {
            setLoading(false); // Stop the loader once the API call is done
        });
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Close the popup
    };

    const handleOnboardingClick = () => {
        // Redirect to the Onboarding page
        navigate('/onboarding');
    };

    return (
    <div>
        <Navbar/>
        <div className="onboarding-container">
            <h1 className="onboarding-title">Transfer</h1>
            <h2 className="onboarding-subtitle">Funding account: EGP100060001</h2>

            <div className="onboarding-form">
                <div className="input-row">
                <input 
                    type="text"
                    name="debitAccount"
                    value={formData.debitAccount}
                    onChange={handleInputChange}
                    placeholder="Debit Account (From)"
                />
                <input 
                    type="text"
                    name="creditAccount"
                    value={formData.creditAccount}
                    onChange={handleInputChange}
                    placeholder="Credit Account (To)"
                />
                </div>
                <div >
                <input 
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                />
                </div>
                
                
                
                
                
                <div className='buttons-class1'>
                <button type="submit" onClick={handleSubmit} className="submit-button">Submit</button>
                </div>
                </div>
            {/* Show loader if the state is loading */}
            {loading && (
                <div className="loading-section1">
                    <div className="loader1"></div> {/* Loader component */}
                    <p className="loading-text1">Please wait a while! Transferring now</p> {/* Loading message */}
                </div>
            )}
            {/* Popup component */}
            {showPopup && <Popup 
                    message={popupMessage} 
                    onClose={handleClosePopup} 
                />}
        </div>
    </div>
    );
};

export default TransferComponent;
