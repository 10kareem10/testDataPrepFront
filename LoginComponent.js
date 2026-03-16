import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import Navbar from './Navbar';

const LoginComponent = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showAdminLink, setShowAdminLink] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("loggedInUser");

    // Show admin link on Ctrl+Shift+A
    const handleKeyCombo = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'a') {
        setShowAdminLink(true);
      }
    };
    window.addEventListener('keydown', handleKeyCombo);
    return () => window.removeEventListener('keydown', handleKeyCombo);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Normal User Login
     const handleLogin = async () => {
  try {
    const response = await fetch('http://10.10.96.100:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
 
    const rawText = await response.text();
 
    let result;
    try {
      result = JSON.parse(rawText);
    } catch {
      result = { message: rawText };
    }
    if (response.ok) {
      localStorage.setItem('loggedInUser', formData.username);
      localStorage.setItem('SESSION_ID', result.sessionId);
 
      setMessage('Login successful!');
      setTimeout(() => navigate('/homepage'), 1000);
    } else {
      setMessage(`Login failed: ${result.message}`);
    }
 
  } catch (error) {
    setMessage('Error: ' + error.message);
  }
};
  // Hardcoded Admin Login
  const handleAdminLogin = () => {
    const adminUsername = "testingadmin";
    const adminPassword = "testingteam";

    if (formData.username === adminUsername && formData.password === adminPassword) {
      localStorage.setItem('loggedInUser', formData.username);
      setMessage('Admin login successful!');
      setTimeout(() => navigate('/user-stats'), 500);
    } else {
      setMessage('Invalid admin credentials');
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="auth-container">
      <h2>Login</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      
      <div style={{ marginTop: '15px' }}>
        <button 
          onClick={handleLogin} 
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '6px',
            cursor: 'pointer',
            backgroundColor: '#219F3',
            color: '#fff',
            border: 'none'
          }}
        >
          Login
        </button>
      </div>

      {showAdminLink && (
        <p style={{ fontSize: '12px', marginTop: '5px' }}>
          <a href="#admin" onClick={(e) => { e.preventDefault(); handleAdminLogin(); }}>
            Admin Login
          </a>
        </p>
      )}

      <p>{message}</p>
      <p>You don't have an account? <button onClick={() => navigate('/register')}>Register</button></p>
    </div>
    </div>
  );
};

export default LoginComponent;
