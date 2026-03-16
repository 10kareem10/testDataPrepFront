import React, { useState } from 'react';
import './ListOfServicesComponent.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Navbar from './Navbar';
import img1 from './bodypic.jpg'
import img2 from './bodypic2.png';
import img3 from './bodypic3.png';
import transfer from './transfer.jpg'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaUniversity, FaCreditCard, FaPiggyBank, FaWallet, FaMoneyCheckAlt } from 'react-icons/fa';



const sliderImages = [img3];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 6000
};



const ListOfServicesComponent = () => {
    const group1Details = [
        { title: 'Onboarding', initialValue: 'Value 1' },
    ];
    const [count, setCount] = useState(0); // State to hold the count
    const [popupMessage, setPopupMessage] = useState(''); // State for the popup message
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [loading, setLoading] = useState(false); // State to control loader visibility
    const [testPassed, setTestPassed] = useState(false); // State to track if the test passed
    const navigate = useNavigate(); // Initialize the useNavigate hook




    const handleCountChange = (event) => {
        setCount(event.target.value); // Update state with input value
    };

    const [group1Values, setGroup1Values] = useState(group1Details.map(item => item.initialValue));

    const handleGroup1Change = (index) => (event) => {
        const newValues = [...group1Values];
        newValues[index] = event.target.value;
        setGroup1Values(newValues);
    };

    

    const handleGroup1Submit = (index) => () => {

        setLoading(true); // Start the loader before making the API call
        setTestPassed(false); // Reset test result
         

        // First, run the REST Assured tests by hitting the backend API
        fetch('http://10.10.96.100:8080/run-rest-assured', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: count.toString()}) // Send count as JSON
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
    // const handleGroup2Submit = (index) => () => {
    //     alert(`Group 2 Submitted: ${group2Values[index]}`);
    // };
    const handleOnboardingClick = () => {
        // Redirect to the Onboarding page
        navigate('/onboarding');
    };

    const handleCustomOnboardingClick = () => {
        // Redirect to the Onboarding page
        navigate('/customonboarding');
    };
    const handleTransferClick = () => {
        // Redirect to the Onboarding page
        navigate('/Transfer');
    };
    const handleDepositsClick = () => {
        // Redirect to the Onboarding page
        navigate('/ordervcn');
    };
    const handleDepositsMobileClick = () => {
        // Redirect to the Onboarding page
        navigate('/depositsMobile');
    };
    const handleAddRestrictionsClick = () => {
        // Redirect to the Onboarding page
        navigate('/addRestrictions');
    };

    return (
        <div>
          <Navbar />
            <div className="main-container">

  {/* Left: Image */}
              <div className="image-container">
                <img src={img3} alt="Onboarding Visual" className="fixed-image" />
              </div>
              
  {/* Right: Services */}
              <div className="card-container">
                <div className="card">
                 <h2 className="input-subtitle">OUR SERVICES - SIT</h2>
                  <div className="input-card">
                    <button className="submit-button1" onClick={handleOnboardingClick}>Onboarding</button>  
                    <button className="submit-button2" onClick={handleCustomOnboardingClick}>Custom Onboarding</button>  
                    <button className="submit-button3" onClick={handleTransferClick}>Transfer</button>  
                    <button className="submit-button4" onClick={handleAddRestrictionsClick}>Add Restrictions</button>
                    {/* <button className="submit-button3" onClick={handleDepositsClick}>VCN</button>   */}
                    {/* <button className="submit-button3" onClick={handleDepositsMobileClick}>Deposits</button>   */}
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
};

export default ListOfServicesComponent;