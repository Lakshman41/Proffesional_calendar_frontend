import React, { useState, useEffect, useCallback, useRef } from 'react';
import Calendar from 'react-calendar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { Bell, X, AlertCircle } from 'lucide-react';

const CalendarC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const { userLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const notificationTimeoutRef = useRef(null);
  const reminderTimeoutRef = useRef(null);

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/');
    }
  }, [userLoggedIn, navigate]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date();
      events.forEach((event) => {
        const [eventHour, eventMinute] = event.time.split(':');
        const eventDate = new Date(event.date);
        eventDate.setHours(parseInt(eventHour), parseInt(eventMinute), 0);

        if (Math.abs(now - eventDate) < 60000 && Notification.permission === 'granted') {
          setCurrentEvent(event);
          setShowNotification(true);

          new Notification(`Event: ${event.title}`, {
            body: `Time: ${event.time}\nDate: ${event.date}`,
            icon: '/path/to/your/notification-icon.png'
          });

          // Display a reminder alert
          reminderTimeoutRef.current = setTimeout(() => {
            alert(`Reminder: ${event.title} is happening now!`);
          }, 1000);

          // Auto-hide notification after 5 seconds
          notificationTimeoutRef.current = setTimeout(() => {
            setShowNotification(false);
            clearTimeout(reminderTimeoutRef.current);
          }, 5000);
        }
      });
    };

    const intervalId = setInterval(checkUpcomingEvents, 1000);
    return () => clearInterval(intervalId);
  }, [events]);

  const fetchAndMarkDates = useCallback(async () => {
    if (!userData.email) {
      console.warn('User email not found');
      return;
    }

    try {
      const result = await fetch(
        `http://localhost:5000/list?email_id=${encodeURIComponent(userData.email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await result.json();
      
      if (data.message === "Here is the List" && data.list) {
        const dates = Object.values(data.list).map(item => {
          try {
            const event = typeof item === 'string' ? JSON.parse(item) : item;
            return event.date;
          } catch (error) {
            console.error('Error parsing event:', error);
            return null;
          }
        }).filter(Boolean);

        setMarkedDates(dates);
        setMessage('');
        const parsedEvents = Object.values(data.list).map(item => 
          typeof item === 'string' ? JSON.parse(item) : item
        );
        setEvents(parsedEvents);
      } else {
        setMessage(data.message || 'No events found');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage('Error fetching events. Please try again.');
    }
  }, [userData.email]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // This will format as DD/MM/YYYY
  };

  const formatTime = (timeString) => {
    return timeString
  };

  const onDateClick = (date) => {
    setSelectedDate(date);
    const clickedDate = date.toISOString().split('T')[0];
    
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === clickedDate;
    });

    setSelectedEvents(dayEvents);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const tileDate = date.toISOString().split('T')[0];
      const isMarked = markedDates.some(markedDate => {
        const formattedMarkedDate = new Date(markedDate).toISOString().split('T')[0];
        return tileDate === formattedMarkedDate;
      });

      return isMarked ? (
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'red',
            borderRadius: '50%',
            margin: '2px auto 0',
          }}
        />
      ) : null;
    }
    return null;
  };

  const stopReminder = () => {
    setShowNotification(false);
    clearTimeout(notificationTimeoutRef.current);
    clearTimeout(reminderTimeoutRef.current);
  };

  return (
    <div className="calendar-container">
      {showNotification && currentEvent && (
        <div className="notification-container">
          <div className="notification-box">
            <div className="notification-header">
              <div className="notification-title">
                <Bell className="notification-icon" />
                <span>Event Reminder</span>
              </div>
              <div className="notification-actions">
                <button
                  onClick={stopReminder}
                  className="stop-reminder-button"
                >
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <span>Stop Reminder</span>
                </button>
                <button
                  onClick={() => {
                    setShowNotification(false);
                    clearTimeout(notificationTimeoutRef.current);
                    clearTimeout(reminderTimeoutRef.current);
                  }}
                  className="close-button"
                >
                  <X className="close-icon" />
                </button>
              </div>
            </div>
            <div className="notification-content">
              <h4>{currentEvent.title}</h4>
              <p>Date: {formatDate(currentEvent.date)}</p>
              <p>Time: {formatTime(currentEvent.time)}</p>
              {currentEvent.note && <p>Note: {currentEvent.note}</p>}
            </div>
          </div>
        </div>
      )}

      <h2>Event Calendar</h2>
      
      <div className="button-group">
        <button onClick={fetchAndMarkDates} className="fetch-button">
          Show Events
        </button>
      </div>

      {message && <div className="error-message">{message}</div>}

      <div className="calendar-grid">
        <div className="calendar-wrapper">
          <Calendar
            onChange={onDateClick}
            value={selectedDate}
            tileContent={tileContent}
            className="custom-calendar"
          />
        </div>

        <div className="events-panel">
          <div className="events-card">
            <h3>Events for {selectedDate.toLocaleDateString('en-GB')}</h3>
            {selectedEvents.length === 0 ? (
              <p className="no-events">No events scheduled for this date</p>
            ) : (
              <div className="events-list">
                {selectedEvents.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-header">
                      <Bell className="w-4 h-4 text-blue-500 mr-2" />
                      <h4>{event.title}</h4>
                    </div>
                    <p>Date: {formatDate(event.date)}</p>
                    <p>Time: {formatTime(event.time)}</p>
                    {event.note && <p>Note: {event.note}</p>}
                    {event.image && (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="event-image"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      <style jsx="true">{`
        .calendar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          animation: slideIn 0.3s ease-out forwards;
        }

        .notification-box {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: 320px;
          overflow: hidden;
        }

        .notification-header {
          background: #1a73e8;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .notification-icon {
          width: 16px;
          height: 16px;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .close-icon {
          width: 16px;
          height: 16px;
        }

        .notification-content {
          padding: 16px;
        }

        .notification-content h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .notification-content p {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .event-details {
          margin-top: 12px;
          line-height: 1.5;
        }

        .event-details p {
          margin: 4px 0;
          color: #666;
        }

        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .fetch-button {
          padding: 8px 16px;
          background-color: #1a73e8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .fetch-button:hover {
          background-color: #1557b0;
        }

        .error-message {
          color: red;
          text-align: center;
          margin-bottom: 16px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .calendar-wrapper {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .events-panel {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .events-card h3 {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }

        .no-events {
          color: #666;
          font-style: italic;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .event-item {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
        }

        .event-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .event-item h4 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .event-item p {
          color: #666;
          margin: 4px 0;
        }

        .event-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          margin-top: 12px;
        }

        .custom-calendar {
          width: 100%;
          border: none;
        }

        .react-calendar__tile {
          position: relative;
          padding: 10px;
          height: 45px;
        }

        .reminder-button {
          background: none;
          border: none;
          color: #1a73e8;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }

        .reminder-button:hover {
          background: rgba(26, 115, 232, 0.1);
        }
        .notification-actions {
          display: flex;
          gap: 8px;
        }

        .stop-reminder-button {
          background: none;
          border: none;
          color: #1a73e8;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stop-reminder-button:hover {
          background: rgba(26, 115, 232, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CalendarC;