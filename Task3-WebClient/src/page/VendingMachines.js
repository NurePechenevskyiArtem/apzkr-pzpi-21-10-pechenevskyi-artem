import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/VendingMachines.css';
import {useNavigate} from "react-router-dom";

const VendingMachines = () => {
    const [vendingMachines, setVendingMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVendingMachines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/vending-machine');
                setVendingMachines(response.data);
            } catch (error) {
                console.error('Error fetching vending machines:', error);
                setError('Failed to fetch vending machines');
            } finally {
                setLoading(false);
            }
        };

        fetchVendingMachines();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const handleMachineClick = (id) => {
        navigate(`/vending-machine/${id}`);
    };

    return (
        <div className="vending-machines-container">
            {vendingMachines.length === 0 ? (
                <p>No vending machines found.</p>
            ) : (
                vendingMachines.map(machine => (
                    <div key={machine.id} className="vending-machine-card"
                         onClick={() => handleMachineClick(machine.id)}
                    >
                        <p><strong>ID:</strong> {machine.id}</p>
                        <p><strong>City:</strong> {machine.city}</p>
                        <p><strong>Address:</strong> {machine.address}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default VendingMachines;
