import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from './logo_onebank.svg';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // User icon

const Navbar = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("dark-mode") === "true";
        setDarkMode(stored);
        document.body.classList.toggle("dark-mode", stored);

        const user = localStorage.getItem("username");
        if (user) setUsername(user);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.body.classList.toggle("dark-mode", newMode);
        localStorage.setItem("dark-mode", newMode);
    };

    const handleLogoClick = () => {
        navigate('/homepage');
    };

    const handleUserClick = () => {
        if (username) {
            alert(`Logged in as ${username}`);
            // You can later add "logout" or "profile" here
        } else {
            navigate('/login'); // redirect guest to login
        }
    };

    const getInitial = (name) => {
        return name?.charAt(0)?.toUpperCase();
    };

    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" onClick={handleLogoClick} />
            <h1 className="navbar-title">TESTING TEAM</h1>

            {/* <div className="navbar-icons">
                <button className="darkmode-toggle" onClick={toggleDarkMode}>
                    {darkMode ? '☀️' : '🌙'}
                </button>

                <div className="user-icon" onClick={handleUserClick}>
                    {username ? (
                        <div className="user-initial">{getInitial(username)}</div>
                    ) : (
                        <FaUserCircle size={28} />
                    )}
                </div>
            </div> */}
        </nav>
    );
};

export default Navbar;
