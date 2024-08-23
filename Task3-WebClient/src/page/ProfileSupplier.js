import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/ProfileSupplier.css';
import { useNavigate } from 'react-router-dom';

const ProfileSupplier = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editProfile, setEditProfile] = useState({
        email: '',
        name: '',
        company_name: '',
        company_address: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/supplier-profile', {
                    headers: {
                        'Authorization': token
                    }
                });
                setProfile(response.data);
                setEditProfile({
                    email: response.data.email,
                    name: response.data.name,
                    company_name: response.data.company_name,
                    company_address: response.data.company_address
                });
            } catch (error) {
                setError('Failed to fetch profile. Please try again.');
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProfile, [name]: value });
    };

    const handleCancelEdit = () => {
        setEditProfile({
            email: profile.email,
            name: profile.name,
            company_name: profile.company_name,
            company_address: profile.company_address
        });
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put('http://localhost:5000/supplier-profile/edit', editProfile, {
                headers: {
                    'Authorization': token
                }
            });
            setProfile(response.data);
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update profile. Please try again.');
            console.error('Error updating profile:', error);
        }
    };

    const handleChangePassword = () => {
        navigate('/password-change');
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Supplier Profile</h2>
            <div className="profile-section">
                <h3>Personal Information</h3>
                <div>
                    <p><strong>Email:</strong></p>
                    <input
                        type="text"
                        name="email"
                        value={editProfile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <p><strong>Name:</strong></p>
                    <input
                        type="text"
                        name="name"
                        value={editProfile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <p><strong>Company Name:</strong></p>
                    <input
                        type="text"
                        name="company_name"
                        value={editProfile.company_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <p><strong>Company Address:</strong></p>
                    <input
                        type="text"
                        name="company_address"
                        value={editProfile.company_address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>

                {isEditing ? (
                    <div className="edit-buttons">
                        <button onClick={handleSaveEdit} className="save-button">Save</button>
                        <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                    </div>
                ) : (
                    <button onClick={handleEditToggle} className="edit-button">Edit Profile</button>
                )}
                <button onClick={handleChangePassword} className="change-password-button">Change Password</button>
            </div>
        </div>
    );
};

export default ProfileSupplier;
