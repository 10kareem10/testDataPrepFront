import React, { useState } from 'react';
import './AddCustomerRestrictionsComponent.css';
import Navbar from './Navbar';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';

const restrictionOptions = [
    { value: "0", label: "0 - No Restrictions" },
    { value: "1", label: "1 - Post No Debits" },
    { value: "2", label: "2 - Post No Credits" },
    { value: "3", label: "3 - Post No Entries" },
    { value: "4", label: "4 - Refer Credits" },
    { value: "5", label: "5 - Refer Debits" },
    { value: "6", label: "6 - Refer All" },
    { value: "12", label: "12 - Customer Deceased" },
    { value: "13", label: "13 - KYC Expiry / NID expired" },
    { value: "14", label: "14 - CBE" },
    { value: "15", label: "15 - Sanctioned Customer" },
    { value: "16", label: "16 - Inactive" },
    { value: "17", label: "17 - BLOCK TERRORIST CUSTOMER BY EMLCU" },
    { value: "18", label: "18 - No Debit - Mobile Number overtaken" },
    { value: "55", label: "55 - Staff Customer" },
    { value: "80", label: "80 - Pending Closure" },
    { value: "90", label: "90 - Automatic Closing" },
];

const AddCustomerRestrictionsComponent = () => {
    const [formData, setFormData] = useState({
        customerId: '',
        restrictionValue: '',
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
            username1: localStorage.getItem('loggedInUser'), // optional
            sessionId: localStorage.getItem('SESSION_ID'), // <-- pass sessionId
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
            customerId: formData.customerId,
            restrictionValue: [
                { restrictionValue: formData.restrictionValue }
            ]
        };
        fetch('http://10.10.96.100:8080/run-addcustomerrestrictions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
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

    return (
        <div>
            <Navbar />
            <div className="onboarding-container">
                <h1 className="onboarding-title">Add Customer Restrictions</h1>
                <h2 className="onboarding-subtitle">Fill your data</h2>

                <form className="onboarding-form" onSubmit={handleSubmit}>
                    <div className="input-row">
                        <input
                            type="text"
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleInputChange}
                            placeholder="Customer ID"
                            required
                        />

                        <select
                            name="restrictionValue"
                            value={formData.restrictionValue}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>
                                Select Restriction Value
                            </option>
                            {restrictionOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="buttons-class">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="loading-section">
                        <div className="loader"></div>
                        <p className="loading-text">
                            Please wait! Adding restriction now...
                        </p>
                    </div>
                )}

                {showPopup && (
                    <Popup
                        message={popupMessage}
                        onClose={handleClosePopup}
                    />
                )}
            </div>
        </div>
    );
};

export default AddCustomerRestrictionsComponent;