import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [username, setUsername] = useState('');
  const [people, setPeople] = useState('people-1');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (username.trim() && password.trim()) {
      navigate(`/chat?username=${encodeURIComponent(username)}&people=${encodeURIComponent(people)}&password=${encodeURIComponent(password)}`);
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="join-container">
      <header className="join-header">
        <h1>ChatApp</h1>
      </header>
      <main className="join-main">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="people">Select people</label>
            <select
              name="people"
              id="people"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            >
              <option value="people-1">person1</option>
              <option value="people-2">person2</option>
              <option value="people-3">person3</option>
              <option value="people-4">person4</option>
              <option value="people-5">person5</option>
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter room password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div style={{ color: '#ff4444', marginBottom: '10px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn">
            Chat
          </button>
        </form>
      </main>
      <footer style={{ marginTop: '25px' }}>
        <div style={{ textAlign: 'right' }} className="credit"></div>
      </footer>
    </div>
  );
};

export default Join;

