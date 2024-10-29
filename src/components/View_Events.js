import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const View_Events = () => {
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const { userLoggedIn } =useAuth();
    const navigate = useNavigate();
    
    // Determine the current view mode based on the route
    const getViewMode = () => {
        const pathname = location.pathname.toLowerCase();
        if (pathname.includes('edit')) return 1;
        if (pathname.includes('delete')) return 2;
        return 0; // Default view mode
    };

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/');
        }
    }, [userLoggedIn, navigate]);

    useEffect(() => {
        getEvents();
    }, [location.pathname]); // Re-fetch when pathname changes

    const getEvents = async () => {
        try {
            const user = localStorage.getItem('user');
            const userData = JSON.parse(user);
            const email_id = userData.email;
            
            const result = await fetch(`http://localhost:5000/list?email_id=${email_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await result.json();
            
            if (data.message === "Here is the List") {
                const parsedEvents = Object.values(data.list).map(item => 
                    typeof item === 'string' ? JSON.parse(item) : item
                );
                setEvents(parsedEvents);
            }
            else{
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error fetching events');
            console.error('Error:', error);
        }
    };

    const handleDelete = async (eventId) => {
        let result =await fetch(`http://localhost:5000/list/${eventId}`,{
            method:"Delete"
        });
        result= await result.json()
        if(result){
            alert(result['message']);
            getEvents();
        }
    };

    const searchHandle = async (event) => {
        //console.warn( event.target.value);
        let key=event.target.value;
        if(key){
            const user = localStorage.getItem('user');
            const userData = JSON.parse(user);
            const email_id=userData.email;
            let result =await fetch(`http://localhost:5000/search/${key}?email_id=${email_id}`);
            result=await result.json();
            if(result['message']==='Fetched'){
                const parsedEvents = Object.values(result.list).map(item => 
                    typeof item === 'string' ? JSON.parse(item) : item
                );
                setEvents(parsedEvents);
            }
            else{
                setEvents([]);
                //setMessage(result['message']);
            }
        }
        else{
            getEvents();
        }
    };

    const viewMode = getViewMode();

    return (
        <div className="event_list">
            <h3>Events List</h3>
            <input type="text" className='search-event-box' placeholder="Search Event"
            onChange={searchHandle}/>
            <ul className="header">
                <li>S. No.</li>
                <li>Title</li>
                <li>Date</li>
                <li>Time</li>
                <li className="description-header">Description</li>
                {viewMode !== 0 && <li>Action</li>}
            </ul>
            {events.length>0 ? events.map((item, index) => (
                <ul key={index} className="event-row">
                    <li>{index + 1}</li>
                    <li>{item.title}</li>
                    <li>{new Date(item.date).toLocaleDateString()}</li>
                    <li>{item.time}</li>
                    <li className="description-show">{item.description}</li>
                    {viewMode === 1 && (
                        <li>
                            {/* <button 
                                onClick={() => handleUpdate(item)}
                                className="update-btn"
                                to="/update"
                            >
                                Update
                            </button> */}
                            <Link to={"/update/"+item.id}>Update</Link>
                        </li>
                    )}
                    {viewMode === 2 && (
                        <li>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </li>
                    )}
                </ul>
            ))
            : <h2>No Results</h2>
            }
            {message && <div className="message" id="message">{message}</div>}
        </div>
    );
};

export default View_Events;
