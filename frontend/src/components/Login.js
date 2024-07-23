import React, { useState } from 'react';
import axios from '../axiosConfig'; // Ensure this imports the configured axios instance
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError(''); // Clear previous error messages
    
        try {
            console.log('Making request to:', axios.defaults.baseURL + '/auth/login'); // Debug the base URL
            const res = await axios.post('/auth/login', formData);
            console.log(res.data);
            // Store the token and user data, and redirect to the dashboard
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
    
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg); // Set error message from server response
            } else {
                setError('An error occurred. Please try again.'); // Set a generic error message
            }
        }
    };

    const redirectToSignUp = () => {
        navigate('/register'); // Redirect to the sign-up page
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-white">
                <div className="flex justify-center mb-6">
                    <img src={process.env.PUBLIC_URL + '/assets/bank.png'} alt="Logo" className="w-24 h-24" />
                </div>
                <h1 className='text-3xl font-semibold text-center mb-6'>Golden Ore Bank</h1>
                <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                <form onSubmit={onSubmit} >
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent" required />
                    </div>
                    {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign in</button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm">Don't have an account?</p>
                    <button onClick={redirectToSignUp} className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none">Create an account</button>
                </div>
            </div>
        </div>
    );
};

export default Login;