import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { firstname, lastname, email, password } = formData;

    // Handle form field changes
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle form submission
    const onSubmit = async e => {
        e.preventDefault();
        setError(''); // Clear previous error messages

        try {
            const res = await axios.post('/auth/register', formData);
            console.log(res.data);
            // Replace window.location.href with history.push('/login') if using React Router
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg); // Set error message from server response
            } else {
                setError('An error occurred. Please try again.'); // Set a generic error message
            }
        }
    };

    // Redirect to login page
    const redirectToLogin = () => {
        navigate('/login'); 
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center mb-6">Create an Account</h1>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstname" name="firstname" value={firstname} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastname" name="lastname" value={lastname} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign up</button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm">Already have an account?</p>
                    <button onClick={redirectToLogin} className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none">Login</button>
                </div>
            </div>
        </div>
    );
};

export default Register;