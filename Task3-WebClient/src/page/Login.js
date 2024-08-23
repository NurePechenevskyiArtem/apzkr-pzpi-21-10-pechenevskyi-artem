import React, { useState } from 'react';
import axios from 'axios';
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/admin-login', { email, password });
            const { token, id, machine_id } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('id', id);
            localStorage.setItem('machine_id', machine_id);
            localStorage.setItem('role', 'admin');
            setError('')

            alert("Login successful!");

            navigate('/profile-admin');
            window.location.reload();

            console.log('Login successful:', response.data);
        } catch (response) {
            setError(response.message);
            console.error('Error logging in:', response.message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
