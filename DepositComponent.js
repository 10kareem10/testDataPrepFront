import React, { useState } from 'react';
import './DepositComponent.css'; // Create a CSS file for styling
import Navbar from './Navbar';
import Popup from './Popup'; // Import the popup component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection



const DepositComponent = () => {
    // Define state to hold the values of the input fields
    const [formData, setFormData] = useState({
        currentAccount:'',
        username: '',
        password: '',
        deviceId: ''
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
            [name]: value

        });
        console.log("Updated formData:", { ...formData, [name]: value }); // Debug log

    };

    // Handle form submission and send data to the backend
    const handleSubmit = (e) => {

        setLoading(true); // Start the loader before making the API call
        setTestPassed(false); // Reset test result
        const API_URL = "http://10.10.96.100:8080";

        const formDataString = JSON.stringify(formData);
        // Send form data to backend
        // fetch(`${API_URL}/run-deposits`, {
        
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: formDataString // Send the entire formData as a string
        // })
        fetch(`http://10.10.96.100:8080/run-deposits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formDataString // Send the entire formData as a string
        })
        .then(async (response) => {
            const text = await response.text(); // Read response body even on failure
            if (!response.ok) {
              throw new Error(text); // Throw the actual error message from backend
            }
            return text;
          })
          .then(data => {
            setPopupMessage(data); // Show backend message (success)
            setShowPopup(true);
            setTestPassed(true);
          })
          .catch((error) => {
            console.error('Error:', error);
            setPopupMessage(error.message); // Show backend message (fail)
            setShowPopup(true);
            setTestPassed(false);
          }).finally(() => {
            setLoading(false);
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
            <h1 className="onboarding-title">Order VCN</h1>

            <div className="onboarding-form">
            <div className="input-row">
                <input 
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                />
                <input 
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                />
                </div>
                
                <div className="input-row">
                <input 
                    type="text"
                    name="currentAccount"
                    value={formData.currentAccount}
                    onChange={handleInputChange}
                    placeholder="Current account"
                />
                <input 
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    placeholder="Device ID"
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
                    <p className="loading-text1">Please wait a while! Onboarding now</p> {/* Loading message */}
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

export default DepositComponent;
