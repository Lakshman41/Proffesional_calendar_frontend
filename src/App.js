import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import View_Events from './components/View_Events';
import Create_Event from './components/Create_Event';
import PrivateComponent from './components/PrivateComponent';
import Update_Event from './components/Update_Event.js';
import { AuthProvider } from './contexts/authContext';
import CalendarC from './components/CalendarC.js';
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function App() {
  const location = useLocation();
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {};
  });

  // Refresh userData whenever "/profile" route is accessed
  useEffect(() => {
    if (location.pathname === '/profile') {
      const user = localStorage.getItem('user');
      setUserData(user ? JSON.parse(user) : {});
    }
  }, [location]);

  return (
    <AuthProvider>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<h1 className="about">THIS PROFESSIONAL CALENDAR IS CREATED BY LAKSHMAN SINGH</h1>} />
          <Route element={<PrivateComponent />}>
            <Route path="/Create_Event" element={<Create_Event />} />
            <Route path="/calendar" element={<CalendarC />}></Route>
            <Route path="/View" element={<View_Events />} />
            <Route path="/Edit" element={<View_Events />} />
            <Route path="/Delete" element={<View_Events />} />
            <Route path="/update/:id" element={<Update_Event />} />
            <Route path="/logout" element={<h1>Logout Successful</h1>} />
            <Route 
              path="/profile" 
              element={
                <h1 id="details">
                  <ul>
                    <li>NAME: {userData.name}</li>
                    <li>EMAIL: {userData.email}</li>
                  </ul>
                </h1>
              } 
            />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
