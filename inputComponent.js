import React, { useState } from 'react';
import './inputComponent.css';
import Navbar from './Navbar';
import { FaUser } from 'react-icons/fa'; // Import the person icon
import Popup from './Popup'; // Import the popup component
import ProgressBar from './ProgressBar'; // Import the ProgressBar component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection





const InputComponent = () => {
    const group1Details = [
        { title: 'Onboarding', initialValue: 'Value 1' },
    ];
    const [count, setCount] = useState(); // State to hold the count
    const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [loading, setLoading] = useState(false); // State to control loader visibility
    const [testPassed, setTestPassed] = useState(false); // State to track if the test passed
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate(); // Initialize the useNavigate hook


    const handleCountChange = (event) => {
        setCount(event.target.value); // Update state with input value
    };


    const [group1Values, setGroup1Values] = useState(group1Details.map(item => item.initialValue));
   
    const handleGroup1Submit = (index) => () => {

        setLoading(true); // Start the loader before making the API call
        setTestPassed(false); // Reset test result
        const API_URL = "http://10.10.96.100:8080";

         // Simulate progress update every second (you can replace this with real-time updates)
         

        // First, run the REST Assured tests by hitting the backend API
        fetch("http://10.10.96.100:8080/run-rest-assured", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',   
            },
            body: JSON.stringify({ count: count.toString(),
                username: localStorage.getItem('loggedInUser'),// Send count as JSON 
                sessionId: localStorage.getItem('SESSION_ID') // <-- pass sessionId
            })
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

    const handleCustomOnboardingClick = () => {
        // Redirect to the Onboarding page
        navigate('/customonboarding');
    };


    return (
        <div>
            <Navbar />
             <div className="main-container1">
             <div className="card-container">
                <div className="card"> {/* Added this wrapper for the card styling */}
                <h1 className="input-title">Easy Onboarding</h1>
                <h2 className="input-subtitle">YOUR EASIER WAY TO ONBOARD A CUSTOMER</h2>
                <div className="input-card1">
                <FaUser className="card-icon" />
                {group1Details.map((item, index) => (
                    <div className="column" key={index}>
                      <input className='input-textfield'
                        type="number" 
                        value={count} 
                        onChange={handleCountChange} // Capture input changes
                        placeholder="   Enter a count"
                      />
                      <div className='buttons-class'>
                    <button className="submit-button" onClick={handleGroup1Submit(index)}>Onboard</button>  
                    <button className="submit-button" onClick={handleCustomOnboardingClick}>Custom Onboarding</button>  
                    </div>
                    </div>
                 ))}
            </div>
             {/* Show loader if the state is loading */}
             {loading && (
                <div className="loading-section">
                    <div className="loader"></div> {/* Loader component */}
                    <p className="loading-text">Please wait a while! Onboarding now</p> {/* Loading message */}
                </div>
            )}
            {/* Popup component */}
            {showPopup && <Popup 
                    message={popupMessage} 
                    onClose={handleClosePopup} 
                    showDownloadButton={testPassed} // Pass test result to Popup
                />}
        </div>

                </div>
             </div>
            </div> 
    );
};

export default InputComponent;