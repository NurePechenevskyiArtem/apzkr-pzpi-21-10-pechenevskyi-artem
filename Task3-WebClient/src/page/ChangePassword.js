import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/ChangePassword.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }

        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        let url = '';
        if (role === 'admin') {
            url = 'http://localhost:5000/admin/change-password';
        } else if (role === 'supplier') {
            url = 'http://localhost:5000/supplier/change-password';
        } else {
            setError('Invalid user role. Please try again.');
            return;
        }

        try {
            const response = await axios.put(url,
                { oldPassword, newPassword },
                { headers: { 'Authorization': token } }
            );
            setSuccess(response.data.message);
            setTimeout(() => {
                if (role === 'admin') {
                    navigate('/profile-admin');
                } else if (role === 'supplier') {
                    navigate('/profile-supplier');
                }
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to change password. Please try again.');
            }
            console.error('Error changing password:', error);
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <div className="form-group">
                    <label>Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <button type="submit" className="change-password-button">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
