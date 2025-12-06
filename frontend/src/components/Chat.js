import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [peopleName, setPeopleName] = useState('');
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username');
    const people = searchParams.get('people');
    const password = searchParams.get('password');

    if (!username || !people || !password) {
      navigate('/');
      return;
    }

    // Connect to Socket.io server
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    // Listen for password errors
    newSocket.on('passwordError', ({ message }) => {
      setPasswordError(message);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    });

    // Join chat room
    newSocket.emit('joinpeople', { username, people, password });

    // Listen for previous messages from database
    newSocket.on('previousMessages', (previousMessages) => {
      setMessages(previousMessages);
    });

    // Listen for room users
    newSocket.on('peopleUsers', ({ people, users }) => {
      setPeopleName(people);
      setUsers(users);
    });

    // Listen for new messages
    newSocket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [location.search, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('chatMessage', message);
      setMessage('');
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.close();
    }
    navigate('/');
  };

  if (passwordError) {
    return (
      <div className="chat-container">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#ff4444',
          fontSize: '18px'
        }}>
          <p>{passwordError}</p>
          <p style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>{peopleName}</h1>
        <button className="btn" onClick={handleLeave}>
          Leave people
        </button>
      </header>
      <main className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg._id || index} className="message">
                <p className="meta">
                  {msg.username} <span>{msg.time}</span>
                </p>
                <p className="text">{msg.text}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={handleSubmit}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            autoComplete="off"
          />
          <button type="submit" className="btn send-button">
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
      <footer style={{ marginTop: '25px' }}>
        <div style={{ textAlign: 'center', color: '#f5f6f7' }} className="credit"></div>
      </footer>
    </div>
  );
};

export default Chat;

