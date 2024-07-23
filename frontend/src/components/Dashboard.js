import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for accessibility

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState('');
    const [biller, setBiller] = useState('');
    const [transactionLimit, setTransactionLimit] = useState(5); // Initial limit to show 5 transactions
    const [errorMessage, setErrorMessage] = useState(''); // Error message state

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/auth/user', {
                headers: {
                    'x-auth-token': token,
                },
            });
            setUser(res.data);
            setBalance(res.data.balance);
            fetchTransactions(token);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    const fetchTransactions = async (token) => {
        try {
            const res = await axios.get('/transaction/history', {
                headers: {
                    'x-auth-token': token,
                },
            });
            setTransactions(res.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/auth/user', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setUser(res.data);
                setBalance(res.data.balance);
                fetchTransactions(token);
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };
    
        fetchUserData(); // Call fetchUserData directly inside useEffect
    
    }, []); // Removed fetchUserData from dependency array to avoid unnecessary re-fetching

    const handleTransaction = async () => {
        if (transactionType === 'withdraw' && parseFloat(amount) > balance) {
            setErrorMessage('Withdrawal amount exceeds current balance.');
            return;
        }else if (transactionType === 'paybill' && parseFloat(amount) > balance) {
            setErrorMessage('Paybill amount exceeds current balance');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `/transaction/${transactionType}`,
                { amount: parseFloat(amount), biller }, // Ensure amount is parsed as a float
                {
                    headers: {
                        'x-auth-token': token,
                    },
                }
            );

            // Update transactions state with the new transaction
            setTransactions(prevTransactions => [res.data, ...prevTransactions]);

            // Refetch user data to get the updated balance
            await fetchUserData();

            // Close modal and reset form
            setModalIsOpen(false);
            setAmount('');
            setBiller('');
            setErrorMessage('');
        } catch (err) {
            console.error('Error handling transaction:', err);
        }
    };

    const openModal = (type) => {
        setTransactionType(type);
        setModalIsOpen(true);
        setErrorMessage('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setAmount('');
        setBiller('');
        setErrorMessage(''); // Clear error message when modal is closed
    };

    const loadMoreTransactions = () => {
        // Increase the transaction limit by 5 on each "See More" click
        setTransactionLimit(prevLimit => prevLimit + 5);
    };

    const getTransactionTypeColor = (type) => {
        switch (type) {
            case 'deposit':
                return 'text-green-600';
            case 'withdraw':
                return 'text-red-600';
            case 'paybill':
                return 'text-blue-600';
            default:
                return 'text-gray-800';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page after logout
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none">Logout</button>
                </div>
                {user ? (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-lg font-medium">Welcome, {user.firstname} {user.lastname}!</p>
                        <p className="text-sm">Email: {user.email}</p>
                        <p className="text-lg font-semibold mt-4">Balance: ${balance.toFixed(2)}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                            <button onClick={() => openModal('deposit')} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none">Deposit</button>
                            <button
                                onClick={() => openModal('withdraw')}
                                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none ${balance === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={balance === 0}
                            >
                                Withdraw
                            </button>
                            <button
                                onClick={() => openModal('paybill')}
                                className={`bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none ${balance === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={balance === 0}
                            >
                                Pay Bill
                            </button>
                        </div>

                        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal">
                            <div className="bg-white p-6 rounded-md max-w-md mx-auto">
                                <h2 className="text-2xl font-semibold mb-4">{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleTransaction(); }}>
                                    {errorMessage && (
                                        <div className="mb-4 text-red-500">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Amount:</label>
                                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                                    </div>
                                    {transactionType === 'paybill' && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Biller:</label>
                                            <input type="text" value={biller} onChange={(e) => setBiller(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        <button type="submit" className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium mr-2 focus:outline-none`}>Submit</button>
                                        <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md text-sm font-medium focus:outline-none">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </Modal>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">Transaction History</h2>
                        {transactions && transactions.length > 0 ? (
                            <div>
                                <ul className="divide-y divide-gray-200">
                                    {transactions.slice(0, transactionLimit).map((transaction, index) => (
                                        <li key={index} className="py-4">
                                            <p className={`${getTransactionTypeColor(transaction.type)} font-semibold`}>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}:</p>
                                            <p className="ml-2">${transaction.amount.toFixed(2)} {transaction.biller ? `to ${transaction.biller}` : ''}</p>
                                            <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                                {transactionLimit < transactions.length && (
                                    <div className="mt-4">
                                        <button onClick={loadMoreTransactions} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md text-sm font-medium focus:outline-none">See More</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-500">No transactions yet.</p>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
