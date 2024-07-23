import React from 'react';  // Import React
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import routing components from react-router-dom
import Register from './components/Register';  // Import Register component
import Login from './components/Login';  // Import Login component
import Dashboard from './components/Dashboard';  // Import Dashboard component

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;  // Export App component
