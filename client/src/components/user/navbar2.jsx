import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function Navbar2() {
  const { state } = useAppContext();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // check if user data exists in state
    if (state.user && state.user.name) {
      setUsername(state.user.name);
    } else {
      // fallback to localStorage if state doesn't have the user info
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUsername(parsedUser.name || '');
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    }
  }, [state.user]); // re-run when state.user changes

  return (
    <div className="flex items-center justify-between px-4 py-[22px] border-b sticky top-0 bg-white shadow-md z-20">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">
          {username ? `Welcome ${username}` : 'Welcome'}
        </h1>
      </div>
      <nav className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-500">About</Link>
        <Link to="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
      </nav>
    </div>
  );
}