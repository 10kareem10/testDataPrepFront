import React, { useState } from 'react';
import './DepositComponent.css'; // Create a CSS file for styling
import Navbar from './Navbar';
import Popup from './Popup'; // Import the popup component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection



const MobileDepositsComponent = () => {
    // Define state to hold the values of the input fields
    const [formData, setFormData] = useState({
        productID: '',
        term: '',
        currentAccount:'',
        amount: '',
        deviceId: '',
        type: '',
        frequency: '',
        username: '',
        password: ''
    });
    const productOptions = [
        { name: 'MDI.CD.3Y.INT.ANNUALLY' },
        { id: 2, name: 'MDI.CD.3Y.INT.MONTHLY' },
        { id: 3, name: 'MDI.CD.3Y.INT.QUARTERLY' },
        { id: 4, name: 'MDI.CD.3Y.INT.SEMIANN' },
        { id: 5, name: 'MDI.CD.3Y.INT.RENEWAL' },
        { id: 6, name: 'MDI.CD.3Y.INT.UPFRONT' },
        { id: 7, name: 'MDI.CD.5Y.INT.ANNUALLY' },
        { id: 8, name: 'MDI.CD.5Y.INT.MONTHLY' },
        { id: 9, name: 'MDI.CD.5Y.INT.QUARTERLY' },
        { id: 10, name: 'MDI.CD.5Y.INT.SEMIANN' },
        { id: 11, name: 'MDI.CD.5Y.INT.RENEWAL' },
        { id: 12, name: 'MDI.CD.5Y.INT.UPFRONT' },
        { id: 13, name: 'MDI.TD.1Y.INT.MONTHLY' },
        { id: 14, name: 'MDI.TD.1Y.INT.QUARTERLY' },
        { id: 15, name: 'MDI.TD.1Y.INT.SEMIANN' },
        { id: 16, name: 'MDI.TD.3M.INT.MONTHLY' },
        { id: 17, name: 'MDI.TD.6M.INT.MONTHLY' },
        { id: 18, name: 'MDI.TD.6M.INT.QUARTERLY' },
        { id: 19, name: 'MDI.TD.9M.INT.MONTHLY' },
        { id: 20, name: 'MDI.TD.9M.INT.QUARTERLY' },
        { id: 21, name: 'MDI.TD.INT.RENEWAL' },
        { id: 22, name: 'MDI.TD.1Y.INT.UPFRONT' }
    ];
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
        fetch(`http://10.10.96.100:8080/run-mobiledeposits`, {
        
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
            <h1 className="onboarding-title">Mobile Deposits</h1>
            <h2 className="onboarding-subtitle">Customize your own deposit</h2>

            <div className="onboarding-form">
                <div className="input-row">
                    <select
                        type="select"
                        name="productID"
                        value={formData.productID}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select a Product</option>
                        {productOptions.map((product) => (
                            <option key={product.name}  value={product.name}>
                                {product.name}
                            </option>
                        ))}
                        </select>
                    
                <input 
                    type="text"
                    name="term"
                    value={formData.term}
                    onChange={handleInputChange}
                    placeholder="Term"
                />
                </div>
                <div className="input-row">
                <input 
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    placeholder="Device ID"
                />
                <input 
                    type="text"
                    name="currentAccount"
                    value={formData.currentAccount}
                    onChange={handleInputChange}
                    placeholder="Account number"
                />
                </div>
                <div className="input-row">
                <input 
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="Type"
                />
                <input 
                    type="text"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    placeholder="Frequency"
                />
                </div>
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

export default MobileDepositsComponent;
