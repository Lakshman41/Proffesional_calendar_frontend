import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignOut } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';

const Nav = () => {
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { userLoggedIn } =useAuth();

    const options = [
        { label: 'Create', link: '/Create_Event' },
        { label: 'View', link: '/View' },
        { label: 'Edit', link: '/Edit' },
        { label: 'Delete', link: '/Delete' },
    ];

    const logout = async() => {
        localStorage.clear();
        navigate('/signup');
        const res=await doSignOut();
    }

    const toggleDropdown = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setIsOpen(false);
        // Clear any existing events data from state
        localStorage.setItem('viewMode', option.label.toLowerCase());
        navigate(option.link);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <ul className="nav-ul">
                <li><Link to="/">About</Link></li>
                {userLoggedIn && <li ref={dropdownRef} className="dropdown-container">
                    <Link to="#" onClick={toggleDropdown}>Events</Link>
                    {isOpen && (
                        <div className="dropdown-menu">
                            {options.map((option, index) => (
                                <div 
                                    key={index} 
                                    className="dropdown-item" 
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    )}
                </li>}
                {userLoggedIn && <li><Link to="/calendar">Calendar</Link></li>}
                <li>
                    {userLoggedIn ? 
                        <Link to="/profile">Profile</Link>
                        : 
                        <Link to="/signup">Sign Up</Link>
                    }
                </li>
                <li>
                    {userLoggedIn ? 
                        <Link onClick={logout} to="/signup">Logout</Link>
                        : 
                        <Link to="/login">Login</Link>
                    }
                </li>
            </ul>
        </div>
    )
}

export default Nav;