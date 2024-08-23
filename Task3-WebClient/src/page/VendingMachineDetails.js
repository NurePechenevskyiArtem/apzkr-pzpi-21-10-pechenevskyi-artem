import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../style/VendingMachineDetails.css"

const VendingMachineDetails = () => {
    const { machine_id } = useParams();
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingCount, setEditingCount] = useState({});

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/pizza-availability/machine-id/${machine_id}`);
                setPizzas(response.data);
            } catch (error) {
                console.error('Error fetching pizzas:', error);
                setError('Failed to fetch pizzas');
            } finally {
                setLoading(false);
            }
        };

        fetchPizzas();
    }, [machine_id]);

    const handleCountChange = (pizzaId, newCount) => {
        setEditingCount(prevState => ({
            ...prevState,
            [pizzaId]: newCount
        }));
    };

    const handleSaveCount = async (pizzaId) => {
        const newCount = editingCount[pizzaId];
        if (newCount === undefined) return;

        try {
            await axios.put(`http://localhost:5000/pizza-availability/edit-count/${pizzaId}/${machine_id}`, { count: newCount });
            setPizzas(prevState =>
                prevState.map(pizza => pizza.id === pizzaId ? { ...pizza, count: newCount } : pizza)
            );
            alert("Saved successfully!")
            setEditingCount(prevState => {
                const { [pizzaId]: _, ...rest } = prevState;
                return rest;
            });
        } catch (error) {
            console.error('Error updating pizza count:', error);
            alert('Failed to update pizza count');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="vending-machine-details-container">
            <h2>Vending Machine Details</h2>
            {pizzas.length === 0 ? (
                <p>No pizzas found in this vending machine.</p>
            ) : (
                <table className="pizza-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Count</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pizzas.map(pizza => (
                        <tr key={pizza.id}>
                            <td>{pizza.id}</td>
                            <td>{pizza.name}</td>
                            <td>{pizza.description}</td>
                            <td>{pizza.price}</td>
                            <td>
                                <input
                                    type="number"
                                    value={editingCount[pizza.id] !== undefined ? editingCount[pizza.id] : pizza.count}
                                    onChange={(e) => handleCountChange(pizza.id, parseInt(e.target.value, 10))}
                                    min="0"
                                />
                            </td>
                            <td>
                                <button onClick={() => handleSaveCount(pizza.id)}>Save</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VendingMachineDetails;
