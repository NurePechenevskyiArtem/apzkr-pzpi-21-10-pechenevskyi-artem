import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/PurchaseOrderAdmin.css';

const PurchaseOrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const adminId = localStorage.getItem('id');

            try {
                const response = await axios.get(`http://localhost:5000/purchase-order/admin-id/${adminId}`);
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
                        <p><strong>Supplier Name:</strong> {order.supplier_name}</p>
                        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Excel Name:</strong> {order.excel_name}</p>
                        <p><strong>Status:</strong> {order.status ? 'Выполнено' : 'Не выполнено'}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default PurchaseOrderAdmin;
