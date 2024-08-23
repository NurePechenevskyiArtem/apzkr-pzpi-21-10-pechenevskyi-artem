import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/PurchaseOrderAdmin.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const supplierId = localStorage.getItem('id');

            try {
                const response = await axios.get(`http://localhost:5000/purchase-order/supplier-id/${supplierId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching purchase orders:', error);
                setError('Failed to fetch purchase orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleOrderClick = async (excelName) => {
        const downloadUrl = `http://localhost:5000/download-excel/${excelName}`;
        window.location.href = downloadUrl;
    };

    const handleSetCompleted = async (orderId) => {
        try {
            await axios.put(`http://localhost:5000/purchase-order/set-completed/${orderId}`);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 1 } : order
                )
            );
            window.location.reload();
        } catch (error) {
            console.error('Error setting order as completed:', error);
            setError('Failed to set order as completed');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="purchase-order-admin-container">
            {orders.length === 0 ? (
                <p>No purchase orders found.</p>
            ) : (
                orders.map(order => (
                    <div
                        key={order.id}
                        className="order-card"
                        onClick={() => handleOrderClick(order.excel_name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Admin Name:</strong> {order.admin_name}</p>
                        <p><strong>For vending machine:</strong> {order.city}, {order.address}</p>
                        <p><strong>Supplier Name:</strong> {order.supplier_name}</p>
                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Excel Name:</strong> {order.excel_name}</p>
                        <p><strong>Status:</strong> {order.status ? 'Completed' : 'Not completed'}</p>
                        {order.status === true ? (
                            <button className="set-completed-button" disabled>
                                Completed
                            </button>
                        ) : (
                            <button
                                className="set-completed-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetCompleted(order.id);
                                }}
                            >
                                Set Completed
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;
