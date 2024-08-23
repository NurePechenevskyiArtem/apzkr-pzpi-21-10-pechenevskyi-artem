import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../style/Navigation.css';

const Navigation = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        if (token) {
            setIsAuthenticated(true);
            setRole(storedRole);
        } else {
            setIsAuthenticated(false);
            setRole('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole('');
        navigate('/');
    };

    return (
        <nav className="navigation">
            <h1 className="logo">PizzaExpress</h1>
            {isAuthenticated ? (
                <div className="nav-links">
                    {role === 'admin' && (
                        <>
                            <NavLink
                                to="/profile-admin"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                Profile
                            </NavLink>
                            <NavLink
                                to="/my-vending-machine"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                My Vending Machine
                            </NavLink>
                            <NavLink
                                to="/assortment"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                Assortment
                            </NavLink>
                            <NavLink
                                to="/purchase-order/admin"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                PurchaseOrder
                            </NavLink>
                            <NavLink
                                to="/suppliers"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                Suppliers
                            </NavLink>
                        </>
                    )}
                    {role === 'supplier' && (
                        <>
                            <NavLink
                                to="/profile-supplier"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                Profile
                            </NavLink>
                            <NavLink
                                to="/my-orders"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                My Orders
                            </NavLink>
                            <NavLink
                                to="/vending-machines"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                            >
                                Vending Machines
                            </NavLink>
                        </>
                    )}
                    <button className="nav-button logout-button" onClick={handleLogout}>
                        <span className="logout-icon"></span> Logout
                    </button>
                </div>
            ) : (
                <div className="nav-links">
                    <button
                        className="nav-button login-button"
                        onClick={() => navigate('/')}
                    >
                        Login for Admin
                    </button>
                    <button
                        className="nav-button login-button"
                        onClick={() => navigate('/login/supplier')}
                    >
                        Login for Supplier
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
