import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
  username: '',
  password: ''
});

  const navigate = useNavigate();

const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://10.10.96.100:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.text();

      if (response.ok) {
        setMessage('Registered successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(`Registration failed: ${result}`);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input name="username" placeholder="Enter your MDI username"  onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
      <p>Already have an account? <button onClick={() => navigate('/login')}>Login</button></p>

    </div>
  );
};

export default RegisterComponent;
