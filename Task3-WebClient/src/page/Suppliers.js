import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Suppliers.css';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/supplier');
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    const handleOrder = async () => {
        const machineId = localStorage.getItem('machine_id');
        try {
            const response = await axios.post('http://localhost:5000/purchase-order', {
                admin_id: localStorage.getItem('id'),
                supplier_id: selectedSupplierId,
                machine_id: machineId
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error creating purchase order:', error);
            setMessage('Failed to create purchase order');
        }
    };

    return (
        <div className="suppliers-container">
            <h2>Suppliers</h2>
            <table className="suppliers-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Company Name</th>
                    <th>Company Address</th>
                </tr>
                </thead>
                <tbody>
                {suppliers.map(supplier => (
                    <tr key={supplier.id}>
                        <td>{supplier.id}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.name}</td>
                        <td>{supplier.company_name}</td>
                        <td>{supplier.company_address}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="order-form">
                <label htmlFor="supplier-id">Supplier ID:</label>
                <input
                    type="text"
                    id="supplier-id"
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                />
                <button onClick={handleOrder}>Make Order</button>
            </div>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Suppliers;
